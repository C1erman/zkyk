import React, { useState, useEffect } from 'react';
import './resetPass.css';
import Input from '../Input';
import Button from '../Button';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Alert from '../Alert';
import Axios from 'axios';
import { host } from '../../_config';
import * as BIO from '../../actions';

const ResetPass = () => {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    let [inputs, setInputs] = useState({
        password : '',
        passwordConfirm : ''
    });
    let [error, setError] = useState('');
    let [token, setToken] = useState(user.token);
    let controller = {};
    useEffect(() => {
        let token = new URLSearchParams(location.search).get('token');
        if(!token) history.push('/');
        else setToken(token);
    }, [])
    const handleReset = (begin, end) => {
        begin();
        // check empty
        let validated = Object.keys(inputs).filter(v => {
            return !inputs[v].validated;
        });
        if(validated.length){
            setError('表单内容不合规范，请检查修改后再做提交。');
            setTimeout(() => {
                setError('');
                end();
            }, 2500);
            return false;
        }
        else if(inputs.password.value !== inputs.passwordConfirm.value){
            setError('两次输入的密码不一致。');
            setTimeout(() => {
                setError('');
                end();
            }, 2500);
            return false;
        }
        else Axios({
            method : 'POST',
            url : host + '/user/reset/password',
            data : {
                token : token,
                password : inputs.password.value
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            },
            timeout : 5000
        }).then(_data => {
            const {data} = _data;
            if(data.code === 'error'){
                setError(data.info);
                setTimeout(() => { 
                    setError('');
                    end();
                }, 2500)
            }
            else if(data.code === 'success'){
                controller.on('toggle');
                end();
            };
        }).catch(error => end());
    }

    return (
        <div className='resetPass-container'>
            <div className='resetPass-title'><span>修改密码</span></div>
            <Input type='password' label='新密码' placeholder='请输入新密码' validateType='pass' form={inputs} dataName='password' />
            <Input type='password' label='确认新密码' placeholder='请再次输入新的密码' validateType='pass' form={inputs} dataName='passwordConfirm' />
            <Button text='修改' click={handleReset} controlledByFunc={true} errorText={error} loading={true} />
            <Alert controller={controller} content='修改成功，请重新登录' beforeClose={() => {
                    history.push('/user/login');
                    dispatch({type : BIO.LOGIN_EXPIRED});
                }} />
        </div>
    );
}

export default ResetPass;