import React, { useState, useEffect } from 'react';

import './signup.css';
import Input from '../Input';
import Button from '../Button';
import Axios from 'axios';
import { host } from '../../_config';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { slideUp } from '../../utils/slideUp';
import Alert from '../Alert';
import * as BIO from '../../actions';

const Signup = () => {
    let history = useHistory();
    const dispatch = useDispatch();
    let controller = {};
    let [message, setMsg] = useState('');
    let [error, setError] = useState('');
    let [inputs, setInputs] = useState({
        username : '',
        email : '',
        password : '',
        invitation : ''
    });
    useEffect(() => {
        slideUp();
    }, [])

    const clickHandler = (begin, end) => {
        if(error) return false;
        else begin();
        let validated = Object.keys(inputs).filter(v => {
            return !inputs[v].validated;
        });
        if(validated.length){
            setError('信息填写不合规范，请检查。');
            setTimeout(() => {
                setError('');
                end();
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
                    if(data.data.validated) setMsg('注册成功，请登录');
                    else setMsg('注册成功，请验证邮箱以激活账户');
                    controller.on('toggle');
                    end();
                }
                else if(data.code === 'error'){
                    setError(data.info);
                    setTimeout(() => {
                        setError('');
                        end();
                    }, 2500)
                }
            })
            .catch(error =>{
                console.log(error);
                end();
            })
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
            <Input type='number' label='企业邀请码' placeholder='请输入邀请码' dataName='invitation' form={inputs} />
            <Button text='注册' hollow={true} loading={true} controlledByFunc={true} loadingText='请稍候' click={clickHandler} errorText={error} />
            <Alert controller={controller} content={message} beforeClose={() => {
                    history.push('/user/login');
                    dispatch({type : BIO.LOGIN_EXPIRED});
                }} />
        </div>
    );
}

export default Signup;