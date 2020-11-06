import React, { useState, useEffect } from 'react';
import './userInfo.css';
import Input from '../Input';
import Button from '../Button';
import Axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { host } from '../../_config';
import Modal from '../Modal';
import Alert from '../Alert';
import { slideUp } from '../../utils/slideUp';
import { clone } from '../../utils/BIOObject';
import QrCodeSrc from '../../icons/qrcode.svg';
import { useHistory } from 'react-router-dom';

const UserInfo = () => {
    const history = useHistory();
    const user = useSelector(state => state.user);
    let [inputs, setInputs] = useState({
        username : '',
        tel : ''
    });
    let [defaultVal, setDefaultVal] = useState();
    let [error, setError] = useState('');
    let [message, setMsg] = useState('');
    let [share, setShare] = useState(false);
    let controller = {};
    let emailController = {};
    let alertController = {};

    useEffect(() => {
        slideUp();
        Axios({
            method : 'GET',
            url : host + '/user/personal/info',
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
        Axios({
            method : 'GET',
            url : host + '/user/permission',
            params : {
                'access-token' : user.token,
                controller : 'ds',
                action : 'bind'
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            },
            timeout : 5000
        }).then(_data => {
            const {data} = _data;
            if(data.code === 'success') setShare(true);
            else setShare(false);
        }).catch(error => console.log(error));
    }, [])
    const handleUpdate = (begin, end) => {
        begin();
        // check empty
        let validated = Object.keys(inputs).filter(v => {
            return !inputs[v].validated;
        });
        if(validated.length){
            setError('内容不合规范，请检查修改后再做提交。');
            setTimeout(() => {
                setError('');
                end();
            }, 2500);
            return false;
        }
        else Axios({
            method : 'POST',
            url : host + '/user/personal',
            data : {
                username : inputs.username.value,
                tel : inputs.tel.value
            },
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
                let val = clone(defaultVal);
                setDefaultVal(val);
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
        }).catch(error => console.log(error));
    }
    const handleSendEmail = (begin, end) => {
        begin();
        Axios({
            method : 'GET',
            url : host + '/user/reset/password/reset',
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
                setMsg(data.info);
                alertController.on('toggle');
                setTimeout(() => {
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
    const handleEditEmail = (begin, end) => {
        begin();
        Axios({
            method : 'GET',
            url : host + '/user/reset/email/reset',
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
                setMsg(data.info);
                alertController.on('toggle');
                setTimeout(() => { 
                    end();
                }, 2500)
            }
            else if(data.code === 'success') {
                end();
                setMsg('邮件发送成功，请前往邮箱查看');
                emailController.on('toggle');
                alertController.on('toggle');
            }
        }).catch(error => end());
    }

    return (
        <div className='userInfo-container'>
            {share ? (<div className='userInfo-qrcode'>
                <img className='userInfo-qrcode-icon' src={QrCodeSrc} onClick={() => history.push('/share')} />
            </div>) : null}
            <div className='userInfo-title'><span>基本信息</span></div>
            <Input label='用户名' dataName='username' form={inputs} defaultValue={defaultVal} note='用户名代表了您的身份，只能设置一次'/>
            <Input label='电话号码' type='tel' placeholder='绑定电话号码' dataName='tel' form={inputs} defaultValue={defaultVal} enableEmpty={true} validateType='tel' />
            <Input label='所属机构' type='text' placeholder='用户所属机构' dataName='organization' defaultValue={defaultVal} readOnly={true} />
            <Button text='保存' errorText={error} click={handleUpdate} controlledByFunc={true} hollow={true} loading={true} />
            <div className='userInfo-title'><span>设置</span></div>
            <div className='userInfo-setting-pass'>
                登录密码<span onClick={() => controller.on('toggle')}>修改</span>
            </div>
            <div className='userInfo-setting-email'>
                邮箱地址<span onClick={() => emailController.on('toggle')}>修改</span>
            </div>
            <Modal title='验证邮箱' controller={controller} content={
                <>
                    <div className='userInfo-validate-email'>
                        <div>我们将向您的邮箱<span className='email'>{defaultVal ? defaultVal.email : ''}</span>发送一封邮件用以重置密码。请确认邮箱地址后选择发送。</div>
                    </div>
                    <Button text='发送' withError={false} click={handleSendEmail} controlledByFunc={true} loading={true} />
                </>
            } />
            <Modal title='修改邮箱地址' controller={emailController} content={
                <>
                    <div className='userInfo-validate-email'>
                        <div>我们将向您的邮箱<span className='email'>{defaultVal ? defaultVal.email : ''}</span>发送一封邮件用以修改邮箱地址。请确认邮箱地址后选择发送。</div>
                    </div>
                    <Button text='修改' withError={false} click={handleEditEmail} controlledByFunc={true} loading={true} />
                </>
            } />
            <Alert controller={alertController} content={message} />
        </div>
    );
}

export default UserInfo;