import React, { useRef, useState, useEffect } from 'react';
import Axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';

import './add.css';
import { host } from '../../_config';

import { slideUp } from '../../utils/slideUp';
import { getPreviousDay } from '../../utils/BIODate';
import { useSelector, useDispatch } from 'react-redux';
import * as BIO from '../../actions';

import Input from '../Input';
import AutoInput from '../AutoInput';

const Add = () => {
    // 路由
    const history = useHistory();
    // 提交反馈信息
    const [error, setError] = useState('');
    const [submit, setSubmit] = useState('提交');
    let [inputs, setInputs] = useState({
        first_name : '',
        last_name : '',
        email : '',
        height : '',
        weight : '',
        birthday : '',
        antibiotics : ''
    })
    // redux
    let sampleId = useSelector(state => state.add.sampleId);
    let user_id = useSelector(state => state.user.id);
    let token = useSelector(state => state.user.token);
    let edit = useSelector(state => state.edit);

    const dispatch = useDispatch();
    // ref
    const selectGenderRef = useRef();
    const selectBloodRef = useRef();
    const selectFoodRef = useRef();

    const location = useLocation();
    let [defaultVal, setDefault] = useState();
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
                    dispatch({
                        type : BIO.REPORT_EDIT,
                        data : {
                            current : edit.current,
                            barCode : data.data.barcode,
                            personId : data.data.person_id,
                            testeeId : data.data.testee_id,
                            sampleId : data.data.sample_id
                        }
                    });
                    // 下拉列表
                    selectGenderRef.current.value = data.data.gender;
                    selectBloodRef.current.value = data.data.blood_type;
                    selectFoodRef.current.value = data.data.meat_egetables;
                    // 其它
                    let {last_name, first_name, height, weight, birthday, antibiotics} = data.data;
                    setDefault({
                        last_name, first_name, height, weight, birthday, antibiotics
                    });
                }
            })
            .catch(error => console.log(error))
        }
    }, [])

    const handleSubmit = () => {
        if(submit !== '提交') return false;
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
                setSubmit('提交');
            }, 2500);
            return false;
        }
        else{
            let {last_name, first_name, birthday, height, weight, antibiotics} = inputs;
            let data = {
                last_name : last_name.value, first_name : first_name.value, birthday : birthday.value, height : height.value, 
                weight : weight.value, antibiotics : antibiotics.value,
                sample_id : sampleId,
                blood_type, meat_egetables, gender,
                // user_id,
            }
            let url = host + '/sample/bind';
            if(location.state?.current){
                data = {
                    ...data,
                    person_id : edit.personId,
                    testee_id : edit.testeeId,
                    sample_id : edit.sampleId
                }
                url = host + '/sample/modify';
            }
            Axios({
                method : 'POST',
                url : url,
                data : data,
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
                        setSubmit('提交');
                    }, 3000)
                }
                else if(data.code === 'success'){
                    setSubmit('绑定成功');
                    setTimeout(() => {
                        history.push('/report/list');
                        dispatch({
                            type : BIO.ADD_SUCCESS
                        })
                    },3000)
                }
            })
            .catch(error => {
                setSubmit('提交');
                console.log(error)
            })
        }
    }
    return (
        <div className='add-container'>
            <div className='add-noti'>
                <p>为了更加准确的为你提供建议，我们需要使用下述信息，请如实填写。</p>
                <p>你本次填写的采样管编号为：<span className='add-noti-barcode'>{useSelector(state => state.add.barCode) || edit.barCode}</span></p>
            </div>
            <div className='add-divide'></div>
            <div className='add-form'>
                <p className='add-label-container'><span className='add-label'>联系方式</span></p>
                <Input placeholder='请输入姓氏' label='姓' validateType='name' dataName='last_name' form={inputs} defaultValue={defaultVal} />
                <Input placeholder='请输入名字' label='名' validateType='name' dataName='first_name' form={inputs} defaultValue={defaultVal} />
                <Input type='email' placeholder='请输入电子邮箱' label='邮箱' validateType='email' dataName='email' form={inputs} defaultValue={defaultVal} />
                <p className='add-label-container'><span className='add-label'>基本信息</span></p>
                <div className='add-form-input'>
                    <label>性别</label>
                    <select className='add-form-inputs' ref={selectGenderRef}>
                        <option value='M'>男</option>
                        <option value='F'>女</option>
                    </select>
                </div>
                <Input type='number' placeholder='请输入身高' label='身高 / 厘米' validateType='height' dataName='height' form={inputs} defaultValue={defaultVal} />
                <Input type='number' placeholder='请输入体重' label='体重 / 公斤' validateType='weight' dataName='weight' form={inputs} defaultValue={defaultVal} />
                <Input type='date' label='生日' max={getPreviousDay()} dataName='birthday' form={inputs} defaultValue={defaultVal} />
                <div className='add-form-input'>
                    <label>血型</label>
                    <select className='add-form-inputs' ref={selectBloodRef}>
                        <option value='O'>O 型</option>
                        <option value='A'>A 型</option>
                        <option value='B'>B 型</option>
                        <option value='AB'>AB 型</option>
                        <option value='OTHER'>其他型 / 不详</option>
                    </select>
                </div>
                <p className='add-label-container'><span className='add-label'>近期状况</span></p>
                <div className='add-form-input'>
                    <label>饮食中肉食占比</label>
                    <select className='add-form-inputs' ref={selectFoodRef}>
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
                {/* <div className='add-form-input add-form-radio'>
                    <input type='checkbox' value='allow' />我允许中科宜康使用样本数据进行检测。
                    <label></label> 
                </div> */}
                <button className={submit !== '提交' ? 'add-form-btn disabled' : 'add-form-btn'} onClick={handleSubmit}>{submit}</button>
                <p className='add-form-error'>{error}</p>
                {location.state?.current ? <button className={submit !== '提交' ? 'add-form-btn-back disabled' : 'add-form-btn-back'} onClick={() => history.push('/report/list')}>不做修改</button> : null}
            </div>
        </div>
    );
}

export default Add;