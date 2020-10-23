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

    const clickHandler = (begin, end) => {
        if(loginError) return false;
        else begin();
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
    return (
        <>
            <div className='login-container'>
                <div className='login-title'>
                    <span>登录</span>
                </div>
                <Input type='text' label='账号' placeholder='请输入邮箱或用户名' dataName='username' form={inputs} />
                <Input type='password' label='密码' placeholder='请输入密码' validateType='pass' dataName='password' form={inputs} />
                <div className='login-to-signup'>没有账号？<Link to='/user/signup'>前去注册</Link></div>
                <Button text='登录' click={clickHandler} controlledByFunc={true} errorText={loginError} loading={true} loadingText='请稍候' loadingTime={2500} />
            </div>
            <Alert controller={controller} content={list ? '登录成功，即将跳转至报告列表页' : '登录成功，即将跳转至绑定采样页'} 
            beforeClose={() => { list ? history.push('/report/list') : history.push('/') }} />
            <Modal title='注意' slave={true} controller={modalController} content={
                <>
                    <p>您使用了初始密码进行了登录，出于安全性考虑，您必须修改密码。</p>
                    <Button text='前往修改初始密码' withError={false} click={() => history.push('/user/reset?token=' + tempToken)} />
                </>
            } />
        </>
        
    );
}

export default Login;