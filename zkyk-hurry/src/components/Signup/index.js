import React, { useState } from 'react';

import './signup.css';
import Input from '../Input';
import Button from '../Button';
import Axios from 'axios';
import { host } from '../../_config';

let inputs = {
    username : '',
    email : '',
    password : '',
    invitation : ''
};
const Signup = () => {
    let [error, setError] = useState('');
    const clickHandler = () => {
        if(error) return false;
        let validated = Object.keys(inputs).filter(v => {
            return !inputs[v].validated;
        });
        if(validated.length){
            setError('信息填写不合规范，请检查。');
            setTimeout(() => {
                setError('');
            },2500)
        }
        else{
            Axios({
                method : 'POST',
                url : host + '/user/signup',
                data : {
                    username : inputs['username'].value,
                    password : inputs['password'].value,
                    email : inputs['email'].value,
                    invitation : inputs['invitation'].value
                },
                headers : {
                    'Content-Type' : 'application/json; charset=UTF-8'
                }
            }).then(_data => {
                let { data } = _data;
                if(data.code === 'success'){
                    // history.push('/');
                }
                else if(data.code === 'error'){
                    setError(data.info);
                    setTimeout(() => {
                        setError('');
                    }, 2500)
                    console.log(inputs)
                }
            })
            .catch(error => console.log(error))
        }
    }
    return (
        <div className='signup-container'>
            <div className='signup-title'>
                <span>创建账号以享受更多服务</span>
            </div>
            <Input type='text' label='用户名' placeholder='请输入用户名' dataName='username' form={inputs} />
            <Input type='email' validateType='email' label='邮箱' placeholder='请输入邮箱' dataName='email' form={inputs} />
            <Input type='password' validateType='pass' label='密码' placeholder='请输入密码' dataName='password' form={inputs} />
            <Input type='text' label='企业邀请码' placeholder='请输入邀请码' dataName='invitation' form={inputs} />
            <Button text='注册' hollow={true} loading={true} loadingText='请稍候' click={clickHandler} errorText={error} />
        </div>
    );
}

export default Signup;