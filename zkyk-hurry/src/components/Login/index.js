import React, { useState } from 'react';
import './login.css';
import Input from '../Input';
import Button from '../Button';
import Axios from 'axios';
import { host } from '../../_config';
import { useHistory } from 'react-router-dom';

const Login = () => {
    let [acc, setAcc] = useState('');
    let [pass, setPass] = useState('');

    let [loginError, setError] = useState('');
    let history = useHistory();

    const clickHandler = () => {
        if(acc.length && pass.length){
            Axios({
                method : 'POST',
                url : host + '/user/login',
                data : {
                    username : acc,
                    password : pass
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
        else{
            setError('请填写表单之后再操作。');
            setTimeout(() => {
                setError('');
            },2500)
        }
    }
    return (
        <div className='login-container'>
            <div className='login-title'>
                <span>请登录</span>
            </div>
            <Input type='email' label='账号' placeholder='请输入邮箱' validateType='email' effectiveVal={(val) => setAcc(val)} />
            <Input type='password' label='密码' placeholder='请输入密码' validateType='pass' effectiveVal={(val) => setPass(val)} />
            <Button text='登录' click={clickHandler} errorText={loginError} loading={true} loadingText='请稍候' loadingTime={2500} />
        </div>
    );
}

export default Login;