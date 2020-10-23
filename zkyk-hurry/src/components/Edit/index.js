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

const Edit = () => {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    let token = useSelector(state => state.user.token);
    // 提交反馈信息
    const [error, setError] = useState('');
    const [submit, setSubmit] = useState('修改');
    let [inputs, setInputs] = useState({
        first_name : '',
        last_name : '',
        height : '',
        weight : '',
        birthday : '',
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
    // ref
    const selectGenderRef = useRef();
    const selectBloodRef = useRef();
    const selectFoodRef = useRef();
    
    useEffect(() => {
        slideUp();
        if(location.state?.current){
            Axios({
                method : 'GET',
                url : host + '/sample/updateBind',
                params : {
                    id : location.state.current,
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
                }
            })
            .catch(error => console.log(error))
        }
    }, [])

    const handleSubmit = () => {
        if(submit !== '修改') return false;
        else setSubmit('请稍候');
        // 下拉框是一定有值的
        let gender = selectGenderRef.current.value,
            blood_type = selectBloodRef.current.value,
            meat_egetables = selectFoodRef.current.value;
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
            let {last_name, first_name, birthday, height, weight, antibiotics} = inputs;
            Axios({
                method : 'POST',
                url : host + '/sample/modify',
                data : {
                    last_name : last_name.value, first_name : first_name.value, birthday : birthday.value, height : height.value, 
                    weight : weight.value, antibiotics : antibiotics.value,
                    blood_type, meat_egetables, gender,
                    // user_id,
                    person_id : editData.person_id, testee_id : editData.testee_id, sample_id : editData.sample_id, sample_id : editData.sample_id
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
                        })
                    },3000)
                }
            })
            .catch(error => {
                setSubmit('修改');
                console.log(error)
            })
        }
    }
    return (
        <div className='edit-container'>
            <div className='edit-noti'>
                <p>您当前正在预览采样管编号为<span className='edit-noti-barcode'>{editData.barcode}</span>
                的绑定信息，受测人编码为<span className='edit-noti-testeeCode'>{editData.code}</span>。</p>
                <p className='edit-noti-time'>送样时间为<span>{editData.date_of_collection}</span></p>
            </div>
            <div className='edit-divide'></div>
            <div className='edit-form'>
                <p className='edit-label-container'><span className='edit-label'>联系方式</span></p>
                <Input placeholder='请输入姓氏' label='姓' validateType='name' dataName='last_name' form={inputs} defaultValue={defaultVal} />
                <Input placeholder='请输入名字' label='名' validateType='name' dataName='first_name' form={inputs} defaultValue={defaultVal} />
                <p className='edit-label-container'><span className='edit-label'>基本信息</span></p>
                <div className='edit-form-input'>
                    <label>性别</label>
                    <select className='edit-form-inputs' ref={selectGenderRef}>
                        <option value='M'>男</option>
                        <option value='F'>女</option>
                    </select>
                </div>
                <Input type='number' placeholder='请输入身高' label='身高 / 厘米' validateType='height' dataName='height' form={inputs} defaultValue={defaultVal} />
                <Input type='number' placeholder='请输入体重' label='体重 / 公斤' validateType='weight' dataName='weight' form={inputs} defaultValue={defaultVal} />
                <Input type='date' label='生日' max={getPreviousDay()} dataName='birthday' form={inputs} defaultValue={defaultVal} />
                <div className='edit-form-input'>
                    <label>血型</label>
                    <select className='edit-form-inputs' ref={selectBloodRef}>
                        <option value='O'>O 型</option>
                        <option value='A'>A 型</option>
                        <option value='B'>B 型</option>
                        <option value='AB'>AB 型</option>
                        <option value='OTHER'>其他型 / 不详</option>
                    </select>
                </div>
                <p className='edit-label-container'><span className='edit-label'>近期状况</span></p>
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
                <button className={submit !== '修改' ? 'edit-form-btn-back disabled' : 'edit-form-btn-back'} onClick={() => history.push('/report/list')}>不做修改</button>
            </div>
        </div>
    );
}

export default Edit;