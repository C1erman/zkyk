import React, { useState, useEffect } from 'react';
import './resetEmail.css';
import Input from '../Input';
import Button from '../Button';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Alert from '../Alert';
import Axios from 'axios';
import { host } from '../../_config';
import * as BIO from '../../actions';

const ResetEmail = () => {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    let [inputs, setInputs] = useState({
        email : ''
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
        else Axios({
            method : 'POST',
            url : host + '/user/reset/email',
            data : {
                token : token,
                email : inputs.email.value
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
        }).catch(error => {
            setError('网络请求出现问题，请稍后再试');
            setTimeout(() => { 
                setError('');
                end();
            }, 2500)
        });
    }

    return (
        <div className='resetEmail-container'>
            <div className='resetEmail-title'><span>修改邮箱地址</span></div>
            <Input type='email' label='新邮件地址' placeholder='请输入新邮件地址' validateType='email' form={inputs} dataName='email' />
            <Button text='修改' click={handleReset} controlledByFunc={true} errorText={error} loading={true} />
            <Alert controller={controller} content='修改成功' beforeClose={() => {
                    history.push('/user/info')
                    dispatch({
                        type : BIO.USER_EDIT_EMAIL,
                        data : inputs.email.value
                    });
                }} />
        </div>
    );
}

export default ResetEmail;