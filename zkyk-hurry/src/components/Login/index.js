import React, { useState } from 'react';
import './login.css';
import Input from '../Input';
import Button from '../Button';
import Axios from 'axios';
import { host } from '../../_config';
import { useHistory } from 'react-router-dom';

const Login = () => {
    let history = useHistory();
    let inputs = {
        username : '',
        password : ''
    }
    let [loginError, setError] = useState('');

    const clickHandler = () => {
        if(loginError) return false;
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
                url : host + '/user/login',
                data : {
                    username : inputs['username'].value,
                    password : inputs['password'].value
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
                }
                console.log('sd')
            })
            .catch(error => console.log(error))
        }
    }
    return (
        <div className='login-container'>
            <div className='login-title'>
                <span>请登录</span>
            </div>
            <Input type='email' label='账号' placeholder='请输入邮箱' validateType='email' dataName='username' form={inputs} />
            <Input type='password' label='密码' placeholder='请输入密码' validateType='pass' dataName='password' form={inputs} />
            <Button text='登录' click={clickHandler} errorText={loginError} loading={true} loadingText='请稍候' loadingTime={2500} />
        </div>
    );
}

export default Login;