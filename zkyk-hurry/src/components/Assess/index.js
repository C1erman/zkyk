import React, { useEffect, useState } from 'react';
import './assess.css';
import Axios from 'axios';
import { host } from '../../_config';
import { useSelector, useDispatch } from 'react-redux';
import { slideUp } from '../../utils/slideUp';
import * as BIO from '../../actions';
import { useHistory } from 'react-router-dom';
import Alert from '../Alert';

const Assess = () => {
    let [assess, setAssess] = useState([]);
    let report = useSelector(state => state.report);
    let user = useSelector(state => state.user);
    let alertController ={};
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        slideUp();
        Axios({
            method : 'GET',
            url : host + '/sample/indicator',
            params : {
                id : report.current,
                'access-token' : user.token
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            },
            timeout : 5000
        }).then(_data => {
            const {data} = _data;
            if(data.code === 'success')  setAssess(data.data);
        })
        .catch(error => {
            if(error.response?.status === 500){
                console.log('网络请求出现问题。');
            }else if(error.response?.status === 401){
                alertController.on('toggle');
            }
        });
    }, []);
    const mapRisk = {
        'low-risk' : 'low-risk',
        'middle-risk' : 'middle-risk',
        'high-risk' : 'high-risk',
        'weaker' : 'high-risk',
        'normal' : 'low-risk'
    }
    return (
        <div className='assess-container'>
            <div className='assess-title'><span>健康评估</span></div>
            <div>
                {assess.map((v, i) => (
                    <div key={i} className='assess-items'>
                        <div className='assess-item-header'>
                            <div>{v.type_zh}</div><div className={mapRisk[v.rank_en]}>{v.rank_zh}</div>
                        </div>
                        <div className='assess-item-body'>
                            <div>{v.summary}</div>
                        </div>
                        {v.suggestion ? (<div className='assess-item-result'>
                            {v.suggestion}
                        </div>) : null}
                    </div>
                ))}
            </div>
            <Alert controller={alertController} content='登录凭证过期，请重新登录' beforeClose={() => {
                dispatch({
                    type : BIO.LOGIN_EXPIRED
                });
                history.push('/user/login');
            }} />
        </div>
    );
}

export default Assess;