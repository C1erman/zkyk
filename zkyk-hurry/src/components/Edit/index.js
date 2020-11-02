import React, { useRef, useState, useEffect } from 'react';
import Axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';

import './edit.css';
import { host } from '../../_config';

import { slideUp } from '../../utils/slideUp';
import { getPreviousDay } from '../../utils/BIODate';
import { useSelector, useDispatch } from 'react-redux';
import * as BIO from '../../actions';

import Input from '../Input';
import AutoInput from '../AutoInput';
import Modal from '../Modal';
import Button from '../Button';
import Alert from '../Alert';

const Edit = () => {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    let token = useSelector(state => state.user.token);
    let current = useSelector(state => state.edit.current);
    let controller = {};
    let alertController = {};
    // 提交反馈信息
    const [error, setError] = useState('');
    const [submit, setSubmit] = useState('修改');
    let [inputs, setInputs] = useState({
        height : '',
        weight : '',
        antibiotics : ''
    });
    let [editData, setEditData] = useState({
        barcode : '',
        code : '',
        sample_id : '',
        testee_id : '',
        person_id : '',
        date_of_collection : ''
    });
    let [defaultVal, setDefault] = useState();
    let [editInput, setEditInput] = useState({
        last_name : '',
        first_name : '',
        birthday : ''
    });
    let [editErr, setEditErr] = useState('');
    let [alertMessage, setMsg] = useState('');
    // ref
    const selectGenderRef = useRef();
    const selectBloodRef = useRef();
    const selectFoodRef = useRef();

    const selectEditBloodRef = useRef();
    const selectEditGenderRef = useRef();
    
    useEffect(() => {
        slideUp();
        let sampleId = location.state?.current || current;
        if(sampleId){
            Axios({
                method : 'GET',
                url : host + '/sample/update/bind',
                params : {
                    id : sampleId,
                    'access-token' : token
                },
                headers : {
                    'Content-Type' : 'application/json; charset=UTF-8'
                }
            }).then(_data => {
                const { data } = _data;
                if(data.code === 'success'){
                    let {last_name, first_name, height, weight, birthday, antibiotics,
                        gender, blood_type, meat_egetables,
                        sample_id, barcode, testee_id, code, person_id, date_of_collection} = data.data;
                    setDefault({
                        last_name, first_name, height, weight, birthday, antibiotics
                    });
                    setEditData({
                        sample_id, barcode, testee_id, code, person_id, date_of_collection
                    });
                    // 下拉列表
                    selectGenderRef.current.value = gender;
                    selectBloodRef.current.value = blood_type;
                    selectFoodRef.current.value = meat_egetables;
                    // readOnly
                    selectGenderRef.current.disabled = 'disabled';
                    selectBloodRef.current.disabled = 'disabled';
                }
            }).catch(error => console.log(error));
        }
    }, [])

    const handleSubmit = () => {
        if(submit !== '修改') return false;
        else setSubmit('请稍候');
        // 下拉框是一定有值的
        let meat_egetables = selectFoodRef.current.value;
        // check empty
        let validated = Object.keys(inputs).filter(v => {
            return !inputs[v].validated;
        });
        if(validated.length){
            setError('表单内容不合规范，请检查修改后再做提交。');
            setTimeout(() => {
                setError('');
                setSubmit('修改');
            }, 2500);
            return false;
        }
        else{
            let { height, weight, antibiotics} = inputs;
            Axios({
                method : 'POST',
                url : host + '/sample/modify',
                data : {
                    height : height.value, 
                    weight : weight.value,
                    antibiotics : antibiotics.value,
                    meat_egetables,
                    testee_id : editData.testee_id, sample_id : editData.sample_id, person_id : editData.person_id
                },
                params : {
                    'access-token' : token
                },
                headers : {
                    'Content-Type' : 'application/json; charset=UTF-8'
                }
            }).then(_data => {
                const { data } = _data;
                if(data.code === 'error'){
                    setError(data.info);
                    setSubmit('失败');
                    setTimeout(() => {
                        setError('');
                        setSubmit('修改');
                    }, 3000)
                }
                else if(data.code === 'success'){
                    setSubmit('修改成功，即将跳转');
                    setTimeout(() => {
                        history.push('/report/list');
                        dispatch({
                            type : BIO.REPORT_EDIT_SUCCESS
                        });
                    },3000)
                }
            })
            .catch(error => setSubmit('修改'));
        }
    }
    const handleEdit = (begin, end) => {
        begin();
        let validated = Object.keys(editInput).filter(v => {
            return !editInput[v].validated;
        });
        if(validated.length){
            setEditErr('信息填写不合规范，请检查。');
            setTimeout(() => {
                end();
                setEditErr('');
            },2500)
        }
        else Axios({
            method : 'POST',
            url : host + '/sample/alter/person',
            params : {
                'access-token' : token
            },
            data : {
                last_name : editInput.last_name.value,
                first_name : editInput.first_name.value,
                birthday : editInput.birthday.value,
                gender : selectEditGenderRef.current.value,
                blood_type : selectEditBloodRef.current.value,
                person_id : editData.person_id
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            },
            timeout : 5000
        }).then(_data => {
            const {data} = _data;
            if(data.code === 'error'){
                setEditErr(data.info);
                setTimeout(() => {
                    end();
                    setEditErr('');
                }, 2500)
            }
            else if(data.code === 'success') {
                end();
                setMsg('信息修改成功');
                setDefault({
                    ...defaultVal,
                    last_name : editInput.last_name.value,
                    first_name : editInput.first_name.value,
                    birthday : editInput.birthday.value
                })
                selectGenderRef.current.value = selectEditGenderRef.current.value;
                selectBloodRef.current.value = selectEditBloodRef.current.value;
                controller.on('toggle');
                alertController.on('toggle');
            }
        })
        .catch(error => end());
        
    }
    return (
        <div className='edit-container'>
            <div className='edit-noti'>
                <p>您当前正在预览采样管编号为<span className='edit-noti-barcode'>{editData.barcode}</span>
                的绑定信息，受测人编码为<span className='edit-noti-testeeCode'>{editData.code}</span>
                ，此份信息的送样时间为<span className='edit-noti-time'>{editData.date_of_collection}</span>。</p>
            </div>
            <div className='edit-divide'></div>
            <div className='edit-form'>
                <p className='edit-label-container'><span className='edit-label'>受测人基本信息</span></p>
                <Input placeholder='请输入姓氏' label='姓' validateType='name' dataName='last_name' defaultValue={defaultVal} readOnly={true} />
                <Input placeholder='请输入名字' label='名' validateType='name' dataName='first_name' defaultValue={defaultVal} readOnly={true} />
                <div className='edit-form-input'>
                    <label>性别</label>
                    <select className='edit-form-inputs readonly' ref={selectGenderRef}>
                        <option value='M'>男</option>
                        <option value='F'>女</option>
                    </select>
                </div>
                <div className='edit-form-input'>
                    <label>血型</label>
                    <select className='edit-form-inputs readonly' ref={selectBloodRef}>
                        <option value='O'>O 型</option>
                        <option value='A'>A 型</option>
                        <option value='B'>B 型</option>
                        <option value='AB'>AB 型</option>
                        <option value='OTHER'>其他型 / 不详</option>
                    </select>
                </div>
                <Input type='date' label='生日' max={getPreviousDay()} dataName='birthday' defaultValue={defaultVal} readOnly={true} />
                <div className='edit-for-testee'>上述信息为受测人基本信息。<span onClick={() => {
                    controller.on('toggle');
                    }}>点击修改</span></div>
                <p className='edit-label-container'><span className='edit-label'>受测人近期状况</span></p>
                <Input type='number' placeholder='请输入身高' label='身高 / 厘米' validateType='height' dataName='height' form={inputs} defaultValue={defaultVal} />
                <Input type='number' placeholder='请输入体重' label='体重 / 公斤' validateType='weight' dataName='weight' form={inputs} defaultValue={defaultVal} />
                <div className='edit-form-input'>
                    <label>饮食中肉食占比</label>
                    <select className='edit-form-inputs' ref={selectFoodRef}>
                        <option value='0'>0% - 20%</option>
                        <option value='1'>20% - 40%</option>
                        <option value='2'>40% - 60%</option>
                        <option value='3'>60% - 80%</option>
                        <option value='4'>80% - 100%</option>
                    </select>
                </div>
                <AutoInput label='一周内服用过的抗生素' placeholder='如果不填写则代表没有服用' 
                    headers={{'Content-Type' : 'application/json; charset=UTF-8'}}
                    url={host + '/validate/antibiotics'}
                    keyName='name'
                    dataName='antibiotics' form={inputs} defaultValue={defaultVal} />
                <button className={submit !== '修改' ? 'edit-form-btn disabled' : 'edit-form-btn'} onClick={handleSubmit}>{submit}</button>
                <p className='edit-form-error'>{error}</p>
                <button className={submit !== '修改' ? 'edit-form-btn-back disabled' : 'edit-form-btn-back'} onClick={() => history.push('/report/list')}>返回</button>
                <Modal title='受测人基本信息修改' controller={controller} content={
                    <div className='edit-testee-container'>
                        <p>修改受测人基本信息将会引起所有相关联绑定信息的修改，请谨慎修改。</p>
                        <Input placeholder='请输入姓氏' label='姓' validateType='name' dataName='last_name' defaultValue={defaultVal} form={editInput} />
                        <Input placeholder='请输入名字' label='名' validateType='name' dataName='first_name' defaultValue={defaultVal} form={editInput} />
                        <div className='edit-form-input'>
                            <label>性别</label>
                            <select className='edit-form-inputs' ref={selectEditGenderRef}>
                                <option value='M'>男</option>
                                <option value='F'>女</option>
                            </select>
                        </div>
                        <div className='edit-form-input'>
                            <label>血型</label>
                            <select className='edit-form-inputs' ref={selectEditBloodRef}>
                                <option value='O'>O 型</option>
                                <option value='A'>A 型</option>
                                <option value='B'>B 型</option>
                                <option value='AB'>AB 型</option>
                                <option value='OTHER'>其他型 / 不详</option>
                            </select>
                        </div>
                        <Input type='date' label='生日' max={getPreviousDay()} dataName='birthday' defaultValue={defaultVal} form={editInput} />
                        <Button text='修改' errorText={editErr} loading={true} controlledByFunc={true} click={handleEdit} hollow={true} />
                    </div>
                } afterVisible={() => {
                    selectEditGenderRef.current.value = selectGenderRef.current.value;
                    selectEditBloodRef.current.value = selectBloodRef.current.value;
                }} />
                <Alert controller={alertController} content={alertMessage} />
            </div>
        </div>
    );
}

export default Edit;