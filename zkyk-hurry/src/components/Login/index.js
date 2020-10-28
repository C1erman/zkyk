import React, { useState, useEffect } from 'react';
import './login.css';
import Input from '../Input';
import Button from '../Button';
import Axios from 'axios';
import { host } from '../../_config';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as BIO from '../../actions';
import Alert from '../Alert';
import { slideUp } from '../../utils/slideUp';
import Modal from '../Modal';

const Login = () => {
    let history = useHistory();
    const dispatch = useDispatch();
    useEffect(() => slideUp(), []);

    let [tempToken, setTempToken] = useState('');
    let [loginError, setError] = useState('');
    let [inputs, setInputs] = useState({
        username : '',
        password : ''
    });
    // 判断用户是否添加过报告
    let [list, setList] = useState(false);
    let controller = {};
    let modalController = {};
    // 找回密码
    let [email, setEmail] = useState({
        email : ''
    });
    let passController = {};
    let alertController = {};
    let [message, setMsg] = useState('');
    let [emailErr, setEmailErr] = useState('');

    const clickHandler = (begin, end) => {
        begin();
        let validated = Object.keys(inputs).filter(v => {
            return !inputs[v].validated;
        });
        if(validated.length){
            setError('信息填写不合规范，请检查。');
            setTimeout(() => {
                end();
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
                },
                timeout : 5000
            }).then(_data => {
                let { data } = _data;
                if(data.code === 'success'){
                    // 初次登录
                    if(data.data.initial){
                        setTempToken(data.data['resetToken']);
                        modalController.on('toggle');
                    }
                    else{
                        dispatch({
                            type : BIO.LOGIN_SUCCESS,
                            data : data.data
                        });
                        setList(data.data.sample);
                        controller.on('open');
                    }
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
            .catch(error => {
                setError('网络请求出现问题，请稍后再试。');
                setTimeout(() => {
                    setError('');
                    end();
                }, 2500)
            })
        }
    }
    const handleSendEmail = (begin, end) => {
        begin();
        let validated = Object.keys(email).filter(v => {
            return !email[v].validated;
        });
        if(validated.length){
            setEmailErr('邮箱填写不合规范，请检查。');
            setTimeout(() => {
                end();
                setEmailErr('');
            },2500)
        }
        else Axios({
            method : 'GET',
            url : host + '/user/reset/passwordReset',
            params : {
                email : email.email.value
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            },
            timeout : 5000
        }).then(_data => {
            const {data} = _data;
            if(data.code === 'error'){
                setEmailErr(data.info);
                setTimeout(() => { 
                    setEmailErr('');
                    end();
                }, 2500)
            }
            else if(data.code === 'success') {
                end();
                setMsg('邮件发送成功，请前往邮箱查看');
                controller.on('toggle');
                alertController.on('toggle');
            }
        }).catch(error => end());
    }
    return (
        <>
            <div className='login-container'>
                <div className='login-title'>
                    <span>登录</span>
                </div>
                <Input type='text' label='账号' placeholder='请输入邮箱或用户名' dataName='username' form={inputs} />
                <Input type='password' label='密码' placeholder='请输入密码' validateType='pass' dataName='password' form={inputs} />
                {/* <div className='login-to-signup'>没有账号？<Link to='/user/signup'>前去注册</Link></div> */}
                <div className='login-to-signup'>忘记密码？<a onClick={() => passController.on('toggle')}>点击找回</a></div>
                <Button text='登录' click={clickHandler} controlledByFunc={true} errorText={loginError} loading={true} loadingText='请稍候' loadingTime={2500} />
            </div>
            <Alert controller={controller} content={list ? '登录成功，即将跳转至报告列表页' : '登录成功，即将跳转至绑定采样页'} 
            beforeClose={() => { list ? history.push('/report/list') : history.push('/') }} />
            <Modal title='注意' slave={true} controller={modalController} content={
                <>
                    <p>您使用了初始密码进行了登录，出于安全性考虑，您必须修改密码。</p>
                    <Button loading={true} text='前往修改初始密码' withError={false} click={() => history.push('/user/reset?token=' + tempToken)} />
                </>
            } />
            <Modal title='验证邮箱' controller={passController} content={
                <>
                    <div className='login-validate-email'>
                        <div>我们将向您的邮箱发送一封邮件，用以重置密码。</div>
                        <div>请输入并确认邮箱地址后选择发送。</div>
                    </div>
                    <Input type='email' withLabel={false} placeholder='请输入你的邮箱' validateType='email' dataName='email' form={email} />
                    <Button loading={true} text='发送' errorText={emailErr} click={handleSendEmail} controlledByFunc={true} />
                </>
            } />
            <Alert controller={alertController} content={message} />
        </>
        
    );
}

export default Login;