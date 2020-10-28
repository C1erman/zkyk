import React, { useEffect, useState } from 'react';
import './assess.css';
import Axios from 'axios';
import { host } from '../../_config';
import { useSelector, useDispatch } from 'react-redux';
import { slideUp } from '../../utils/slideUp';
import * as BIO from '../../actions';
import { useHistory } from 'react-router-dom';

const Assess = () => {
    let [assess, setAssess] = useState([]);
    let report = useSelector(state => state.report);
    let user = useSelector(state => state.user);
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
        }).catch(error => {
            // 后续改成全局消息提醒
            console.info('登录凭证过期，用户需要重新登录。');
            dispatch({
                type : BIO.LOGIN_EXPIRED
            });
            history.push('/user/login');
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
                            {/* <div>结果评价：</div> */}
                            {v.suggestion}
                        </div>) : null}
                    </div>
                ))}
            </div> 
        </div>
    );
}

export default Assess;