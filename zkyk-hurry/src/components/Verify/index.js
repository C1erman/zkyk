import React, { useState, useEffect } from 'react';
import './verify.css';
import Button from '../Button';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Alert from '../Alert';
import Axios from 'axios';
import { host } from '../../_config';
import * as BIO from '../../actions';

const Verify = () => {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    let [error, setError] = useState('');
    let [token, setToken] = useState(user.token);
    let controller = {};
    useEffect(() => {
        document.title = '验证邮箱';

        let token = new URLSearchParams(location.search).get('token');
        if(!token) history.push('/');
        else{
            setToken(token);
            dispatch({
                type : BIO.LOGIN_EXPIRED
            });
        }
    }, []);
    const handleValidate = (begin, end) => {
        begin();
        Axios({
            method : 'POST',
            url : host + '/user/verify/email',
            data : {
                token : token
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
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
        }).catch(error => end())
    }
    return (
        <div className='verify-container'>
            <div className='verify-title'><span>验证邮箱</span></div>
            <p className='verify-content'>请点击下方按钮以激活您的邮箱与账户。</p>
            <Button text='确认' click={handleValidate} controlledByFunc={true} errorText={error} loading={true} />
            <Alert controller={controller} content='邮箱验证成功，请登录' beforeClose={() => {
                    history.push('/user/login');
                    dispatch({type : BIO.LOGIN_EXPIRED});
                }} />
        </div>
    );
}
export default Verify;