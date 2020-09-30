import React, { useRef, useState, useEffect } from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { slideUp } from '../../utils/slideUp';
import './add.css';
import { host } from '../../_config';

// 表单验证规则
const telValidate = (telString) => {
    const telRegexp = /^[1][3,4,5,7,8][0-9]{9}$/;
    return telRegexp.test(telString);
}
const heightValidate = (heightString) => {
    const heightRegexp = /^\d{2,3}(\.\d{1})*$/;
    return heightRegexp.test(heightString);
}
const weightValidate = (weightString) => {
    const weightRegexp = /^\d{2,3}(\.\d{1})*$/;
    return weightRegexp.test(weightString);
}
const nameValidate = (nameString) => {
    const nameRegexp = /^[\u4e00-\u9fa5]{1,3}$/;
    return nameRegexp.test(nameString);
}
const validate = (type, value) => {
    if(!value.length) return { error : true, message : '不能为空。' };
    switch(type){
        case 'tel' : {
            if(!telValidate(value)) return {error : true, message : '电话号码不合规范。'}
            else return { error : false };
        }
        case 'height' : {
            if(!heightValidate(value)) return {error : true, message : '请输入正确的身高，最多支持小数点后一位。'}
            else return { error : false };
        }
        case 'weight' : {
            if(!weightValidate(value)) return {error : true, message : '请输入正确的体重，最多支持小数点后一位。'}
            else return { error : false };
        }
        case 'name' : {
            if(!nameValidate(value)) return {error : true, message : '请输入汉字。'}
            else return { error : false };
        }
        default : {
            return { error : false }
        }
    }
}
// 时间初始化
const formatDate = (number, type) => {
    if(type === 'm') number += 1;
    return number < 10 ? '0' + number : number;
}
const getNow = () => {
    var date = new Date();
    return [date.getFullYear(), formatDate(date.getMonth(), 'm'), formatDate(date.getDate())].join('-');
}
const getPreviousDay = () => {
    var date = new Date();
    var millSecond = 24 * 60 * 60 * 1000;
    date.setTime(date.getTime() - millSecond);
    return [date.getFullYear(), formatDate(date.getMonth(), 'm'), formatDate(date.getDate())].join('-');
}
// input 框
const InputRender = ({ type = 'text', label, placeholder, validateType = 'text', dataName, saveValueCallback, ...rest}) => {
    const inputRef = useRef();
    const [ error, setError ] = useState('');
    return (
        <div className='add-form-input'>
            <label>{label}</label>
            <input autoComplete='on' className={'add-form-inputs'} type={type}  ref={inputRef} placeholder={placeholder} onChange={() => {
                let result = validate(validateType, inputRef.current.value);
                if(result.error) setError(result.message);
                else{
                    setError('');
                    saveValueCallback({
                        error : false,
                        name : dataName,
                        value : inputRef.current.value
                    })
                }
            }} {...rest} />
            <p className='add-form-error'>{error.length ? error : ''}</p>
        </div>
    );
}

const Add = () => {
    // 回到顶部
    useEffect(() => {
        slideUp()
    }, [])
    // 路由
    const history = useHistory();
    // 反馈信息
    const [error, setError] = useState('');
    const [submit, setSubmit] = useState('提交');
    // ref
    const radioGenderRef = useRef();
    const radioBloodRef = useRef();
    const radioFoodRef = useRef();
    const radioAntiRef = useRef();
    // state 大全
    const [first_name, setFN] = useState();
    const [last_name, setLN] = useState();
    const [mobile, setM] = useState();
    const [height, setH] = useState();
    const [weight, setW] = useState();
    const [birthday, setB] = useState();

    const labels = {
        first_name : setFN,
        last_name : setLN,
        mobile : setM,
        height : setH,
        weight : setW,
        birthday : setB
    }
    const saveValue = ({error, name, value}) => {
        labels[name]({
            error,
            value
        })
    }
    const handleSubmit = () => {
        if(submit !== '提交') return false;
        else setSubmit('请稍后');
        let sample_id = localStorage.getItem('sample_id');
        // 下拉框是一定有值的
        let gender = radioGenderRef.current.value,
            blood_type = radioBloodRef.current.value,
            meat_egetables = radioFoodRef.current.value,
            antibiotics = radioAntiRef.current.value;
        // 自定义 input 框
        let result = [last_name, first_name, birthday, height, weight, mobile].filter((v) => {
            return v && !v.error;
        })
        if(result.length < 6){
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
                    last_name : last_name.value,
                    first_name : first_name.value,
                    birthday : birthday.value,
                    gender,
                    blood_type,
                    height : height.value,
                    weight : weight.value,
                    sample_id,
                    mobile : mobile.value,
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
                    localStorage.clear();
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
                <p>你本次填写的采样管编号为：<span className='add-noti-barcode'>{localStorage.getItem('barcode') || '暂无'}</span></p>
            </div>
            <div className='add-divide'></div>
            <div className='add-form'>
                <p className='add-label-container'><span className='add-label'>联系方式</span></p>
                <InputRender type='text' placeholder='请输入姓氏' dataName='last_name' saveValueCallback={saveValue} label='姓' validateType='name' />
                <InputRender type='text' placeholder='请输入名字' dataName='first_name' saveValueCallback={saveValue} label='名' validateType='name' />
                <InputRender type='tel' placeholder='请输入电话号码' dataName='mobile' saveValueCallback={saveValue} label='电话号码' validateType='tel' />
                <p className='add-label-container'><span className='add-label'>基本信息</span></p>
                <div className='add-form-input'>
                    <label>性别</label>
                    <select className='add-form-inputs' ref={radioGenderRef}>
                        <option value='M'>男</option>
                        <option value='F'>女</option>
                    </select>
                </div>
                <InputRender type='number' placeholder='请输入身高' dataName='height' saveValueCallback={saveValue} label='身高 / 厘米' validateType='height' />
                <InputRender type='number' placeholder='请输入体重' dataName='weight' saveValueCallback={saveValue} label='体重 / 公斤' validateType='weight' />
                <InputRender type='date' placeholder='' dataName='birthday' saveValueCallback={saveValue} label='生日' max={getPreviousDay()} />
                <div className='add-form-input'>
                    <label>血型</label>
                    <select className='add-form-inputs' ref={radioBloodRef}>
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
                    <select className='add-form-inputs' ref={radioFoodRef}>
                        <option value='0'>0% - 20%</option>
                        <option value='1'>20% - 40%</option>
                        <option value='2'>40% - 60%</option>
                        <option value='3'>60% - 80%</option>
                        <option value='4'>80% - 100%</option>
                    </select>
                </div>
                <div className='add-form-input'>
                    <label>一周内是否服用抗生素</label>
                    <select className='add-form-inputs' ref={radioAntiRef}>
                        <option value='0'>未服用</option>
                        <option value='1'>服用过</option>
                    </select>
                </div>
                <button className={submit !== '提交' ? 'add-form-btn disabled' : 'add-form-btn'} onClick={handleSubmit}>{submit}</button>
                <p className='add-form-error'>{error}</p>
            </div>
        </div>
    );
}

export default Add;