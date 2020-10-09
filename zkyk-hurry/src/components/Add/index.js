import React, { useRef, useState, useEffect } from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';

import './add.css';
import { host } from '../../_config';

import { slideUp } from '../../utils/slideUp';
import { getPreviousDay } from '../../utils/BIODate';
import { useSelector, useDispatch } from 'react-redux';
import * as BIO from '../../actions';

import Input from '../Input';
import AutoInput from '../AutoInput';

const Add = () => {
    // 回到顶部
    useEffect(() => {
        slideUp()
    }, [])
    // 路由
    const history = useHistory();
    // 提交反馈信息
    const [error, setError] = useState('');
    const [submit, setSubmit] = useState('提交');
    // redux
    let sampleId = useSelector(state => state.add.sampleId);
    const dispatch = useDispatch();
    // ref
    const selectGenderRef = useRef();
    const selectBloodRef = useRef();
    const selectFoodRef = useRef();
    // state
    const [first_name, setFN] = useState();
    const [last_name, setLN] = useState();
    const [mobile, setM] = useState();
    const [height, setH] = useState();
    const [weight, setW] = useState();
    const [birthday, setB] = useState();
    const [antibiotics, setA] = useState('');

    const handleSubmit = () => {
        if(submit !== '提交') return false;
        else setSubmit('请稍候');
        // 下拉框是一定有值的
        let gender = selectGenderRef.current.value,
            blood_type = selectBloodRef.current.value,
            meat_egetables = selectFoodRef.current.value;
        // 自定义 input 框
        let result = [last_name, first_name, birthday, height, weight, mobile].filter((v) => {
            return !v;
        });
        // check empty
        if(result.length){
            setError('信息未填写完整，请继续填写。');
            setTimeout(() => {
                setError('');
                setSubmit('提交');
            }, 2500);
            return false;
        }
        else{
            Axios({
                method : 'POST',
                url : host + '/validate/bind',
                data : {
                    last_name,
                    first_name,
                    birthday,
                    gender,
                    blood_type,
                    height,
                    weight,
                    sample_id : sampleId,
                    mobile,
                    meat_egetables,
                    antibiotics
                },
                headers : {
                    'Content-Type' : 'application/json; charset=UTF-8'
                }
            }).then(_data => {
                const { data } = _data;
                if(data.code === 'error'){
                    setError(data.info);
                    setSubmit('失败');
                }
                else if(data.code === 'success'){
                    setSubmit('绑定成功，3秒后将跳转至首页');
                    dispatch({
                        type : BIO.ADD_SUCCESS
                    })
                    setTimeout(() => {
                        history.push('/');
                    },3000)
                }
            })
            .catch(error => console.log(error))
        }
    }
    return (
        <div className='add-container'>
            <div className='add-noti'>
                <p>为了更加准确的为你提供建议，我们需要使用下述信息，请如实填写。</p>
                <p>你本次填写的采样管编号为：<span className='add-noti-barcode'>{useSelector(state => state.add.barCode) || '暂无'}</span></p>
            </div>
            <div className='add-divide'></div>
            <div className='add-form'>
                <p className='add-label-container'><span className='add-label'>联系方式</span></p>
                <Input placeholder='请输入姓氏' label='姓' validateType='name' effectiveVal={(val) => setLN(val)} />
                <Input placeholder='请输入名字' label='名' validateType='name' effectiveVal={(val) => setFN(val)} />
                <Input type='tel' placeholder='请输入电话号码' label='电话号码' validateType='tel' effectiveVal={(val) => setM(val)} />
                <p className='add-label-container'><span className='add-label'>基本信息</span></p>
                <div className='add-form-input'>
                    <label>性别</label>
                    <select className='add-form-inputs' ref={selectGenderRef}>
                        <option value='M'>男</option>
                        <option value='F'>女</option>
                    </select>
                </div>
                <Input type='number' placeholder='请输入身高' label='身高 / 厘米' validateType='height' effectiveVal={(val) => setH(val)} />
                <Input type='number' placeholder='请输入体重' label='体重 / 公斤' validateType='weight' effectiveVal={(val) => setW(val)} />
                <Input type='date' label='生日' max={getPreviousDay()} effectiveVal={(val) => setB(val)} />
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
                    dataName='data'
                    keyName='name'
                    effectiveVal={(value) => setA(value)} />
                <button className={submit !== '提交' ? 'add-form-btn disabled' : 'add-form-btn'} onClick={handleSubmit}>{submit}</button>
                <p className='add-form-error'>{error}</p>
            </div>
        </div>
    );
}

export default Add;