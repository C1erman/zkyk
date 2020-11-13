import React, { useRef, useState, useEffect } from 'react';
import './input.css';

// 验证规则 
const telValidate = (telString) => {
    const telRegexp = /^[1][3,4,5,7,8][0-9]{9}$/;
    return telRegexp.test(telString);
}
const heightValidate = (heightString) => {
    const heightRegexp = /^\d{2,3}(\.\d{2})*$/;
    return heightRegexp.test(heightString);
}
const weightValidate = (weightString) => {
    const weightRegexp = /^\d{2,3}(\.\d{2})*$/;
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
const zhValidate = (string) => {
    const zhRegexp = /[\u4e00-\u9fa5]/;
    return !zhRegexp.test(string);
}
const passValidate = (passString) => {
    const passRegexp = /^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z\d_]{6,20}$/;
    return passRegexp.test(passString);
}
const validate = (type, value, enableEmpty = false) => {
    if(!value.length) return enableEmpty ? { error : false } : { error : true, message : '不能为空。' };
    switch(type){
        case 'tel' : {
            if(!telValidate(value)) return {error : true, message : '电话号码不合规范。'}
            else return { error : false };
        }
        case 'height' : {
            if(!heightValidate(value)) return {error : true, message : '请输入正确的身高，最多支持小数点后两位。'}
            else return { error : false };
        }
        case 'weight' : {
            if(!weightValidate(value)) return {error : true, message : '请输入正确的体重，最多支持小数点后两位。'}
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
            if(!zhValidate(value)) return {error : true, message : '不能含有中文。'}
            else if(!passValidate(value)) return {error : true, message : '密码应由大小写字母、数字组成，长度需满足6至20位。'}
            else return { error : false };
        }
        default : {
            return { error : false }
        }
    }
}
const customValidate = (regExp, enableEmpty = false, value, errorMsg = '格式错误') => {
    if(!value.length) return enableEmpty ? { error : false } : { error : true, message : '不能为空。' };
    if(regExp.test(value)) return { error : false }
    else return { error : true , message : errorMsg};
}

const Input = ({
    type = 'text',
    withLabel = true,
    label = 'label',
    validateType,
    placeholder,
    dataName,
    enableEmpty = false,
    errorMsg,
    form = {},
    readOnly = false,
    defaultValue = {},
    note,
    ...rest
}) => {
    let [error, setError] = useState('');
    let inputRef = useRef();
    let emptyRegexp = /\s/;
    // 目前架构只能给一个初始值
    // 被重复挂载时会引起 BUG，使用 delete 进行清除
    useEffect(() => {
        if(form && enableEmpty) form[dataName] = {validated : true, value : form[dataName]};
        return () => {
            if(form && enableEmpty) delete form[dataName];
        }
    }, []);
    // 赋默认值
    useEffect(() => {
        if(defaultValue[dataName]){
            inputRef.current.value = defaultValue[dataName];
            form[dataName] = { validated : true, value : defaultValue[dataName] };
        }
    }, [defaultValue])

    return (
        <div className='input-container'>
            {withLabel ? (<label>{label}</label>) : null}
            <input className={'input' + (readOnly ? ' readonly' : '')} type={type} ref={inputRef} readOnly={readOnly} placeholder={placeholder} onChange={() => {
                let value = inputRef.current.value;
                if(emptyRegexp.test(value)) return inputRef.current.value = value.replace(emptyRegexp, '');
                let result;
                if(validateType instanceof RegExp) result = customValidate(validateType, enableEmpty, value, errorMsg);
                else result = validate(validateType, value, enableEmpty);
                let data = {
                    validated : !result.error,
                    value : value
                }
                if(form) form[dataName] = data;
                if(result.error) setError(result.message);
                else setError('');
            }}
            {...rest} />
            {note && !error.length ? (
                <p className='input-note'>{note}</p>
            ) : null}
            {error.length ? (<p className='input-error'>{error}</p>) : null}
            
        </div>
    )
}

export default Input;