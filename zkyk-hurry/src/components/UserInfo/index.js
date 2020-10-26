import React, { useState, useEffect } from 'react';
import './userInfo.css';
import Input from '../Input';
import Button from '../Button';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { host } from '../../_config';
import Modal from '../Modal';
import Alert from '../Alert';

const UserInfo = () => {
    const user = useSelector(state => state.user);
    let [inputs, setInputs] = useState({
        username : '',
        email : ''
    });
    let [defaultVal, setDefaultVal] = useState();
    let [error, setError] = useState('');
    let [message, setMsg] = useState('');
    let controller = {};
    let alertController = {};

    useEffect(() => {
        Axios({
            method : 'GET',
            url : host + '/user/getPersonal',
            params : {
                'access-token' : user.token
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
                }, 2500)
            }
            else if(data.code === 'success') setDefaultVal(data.data);
        }).catch(error => console.log(error));
    }, [])
    const handleUpdate = (begin, end) => {
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
            url : host + '/user/personal?access-token=' + user.token,
            data : {
                email : inputs.email.value,
                username : inputs.username.value
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
                setDefaultVal(data.data);
                end();
                setMsg('信息更新成功')
                alertController.on('toggle');
            };
        }).catch(error => {
            setError('网络请求出现异常，请稍后再试。');
            setTimeout(() => { 
                setError('');
                end();
            }, 2500)
        });
    }
    const handleOpenModal = () => {
        controller.on('toggle');
    }
    const handleSendEmail = (begin, end) => {
        begin();
        Axios({
            method : 'GET',
            url : host + '/user/reset/passwordReset',
            params : {
                email : defaultVal?.email
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
            else if(data.code === 'success') {
                end();
                setMsg('邮件发送成功，请前往邮箱查看');
                controller.on('toggle');
                alertController.on('toggle');
            }
        }).catch(error => end());
    }

    return (
        <div className='userInfo-container'>
            <div className='userInfo-title'><span>个人信息</span></div>
            <Input label='用户名' dataName='username' form={inputs} defaultValue={defaultVal}/>
            <Input label='邮箱' dataName='email' form={inputs} defaultValue={defaultVal} />
            <Button text='保存' errorText={error} click={handleUpdate} controlledByFunc={true} hollow={true} loading={true} />
            <div className='userInfo-title'><span>密码设置</span></div>
            <div className='userInfo-setting-pass'>
                登录密码<span onClick={handleOpenModal}>修改</span>
            </div>
            <Modal title='验证邮箱' controller={controller} content={
                <>
                    <div className='userInfo-validate-email'>
                        <div>我们将向您的邮箱<span className='email'>{defaultVal ? defaultVal.email : ''}</span>发送一封邮件，用以重置密码。</div>
                        <div>请确认邮箱地址后选择发送。</div>
                    </div>
                    <Button text='发送' withError={false} click={handleSendEmail} controlledByFunc={true} loading={true} />
                </>
            } />
            <Alert controller={alertController} content={message} />
        </div>
    );
}

export default UserInfo;