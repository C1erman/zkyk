import React, { useRef, useState } from 'react';
import './input.css';

// 验证规则 
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
const emailValidate = (emailString) => {
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegexp.test(emailString);
}
const passValidate = (passString) => {
    const passRegexp = /[\u4e00-\u9fa5]/;
    return passRegexp.test(passString);
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
        case 'email' : {
            if(!emailValidate(value)) return {error : true, message : '邮箱地址不合规范。'}
            else return { error : false };
        }
        case 'pass' : {
            if(passValidate(value)) return {error : true, message : '不能含有中文。'}
            else return { error : false };
        }
        default : {
            return { error : false }
        }
    }
}

const Input = ({
    type = 'text',
    withLabel = true,
    label = 'label',
    validateType,
    placeholder,
    dataName,
    enableEmpty = false,
    form,
    ...rest
}) => {
    let [error, setError] = useState('');
    let inputRef = useRef();
    if(form && enableEmpty) form[dataName] = {validated : true, value : form[dataName]};

    return withLabel ? (
        <div className='input-container'>
            <label>{label}</label>
            <input className='input' type={type} ref={inputRef} placeholder={placeholder} onChange={() => {
                let value = inputRef.current.value;
                let result = validate(validateType, value);
                console.log(result)
                let data = {
                    validated : !result.error,
                    value : value
                }
                if(form) form[dataName] = data;
                if(result.error) setError(result.message);
                else setError('');
            }} {...rest} />
            <p className='input-error'>{error.length ? error : ''}</p>
        </div>
    ) : (
        <div className='input-container'>
            <input className='input' type={type} ref={inputRef} placeholder={placeholder} onChange={() => {
                let value = inputRef.current.value;
                let result = validate(validateType, value);
                let data = {
                    validated : !result.error,
                    value : value
                }
                if(form) form[dataName] = data;
                if(result.error) setError(result.message);
                else setError('');
            }} {...rest} />
            <p className='input-error'>{error.length ? error : ''}</p>
        </div>
    );
}

export default Input;