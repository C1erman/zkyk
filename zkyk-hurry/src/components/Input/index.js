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

const Input = ({
    type = 'text',
    withLabel = true,
    label = 'label',
    validateType,
    placeholder,
    effectiveVal,
    ...rest
}) => {
    let [error, setError] = useState('');
    let inputRef = useRef();

    return withLabel ? (
        <div className='input-container'>
            <label>{label}</label>
            <input className='input' type={type} ref={inputRef} placeholder={placeholder} onChange={() => {
                let value = inputRef.current.value;
                let result = validate(validateType, value);
                if(result.error) setError(result.message);
                else {
                    setError('');
                    typeof effectiveVal === 'function' ? effectiveVal(value) : null;
                };
            }} {...rest} />
            <p className='input-error'>{error.length ? error : ''}</p>
        </div>
    ) : (
        <div className='input-container'>
            <input autoComplete='on' className='input' type={type}  ref={inputRef} placeholder={placeholder} onChange={() => {
                let result = validate(validateType, inputRef.current.value);
                if(result.error) setError(result.message);
                else setError('');
            }} {...rest} />
            <p className='input-error'>{error.length ? error : ''}</p>
        </div>
    );
}

export default Input;