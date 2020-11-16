import React, { useEffect, useState } from 'react';
import './assess.css';
import Axios from 'axios';
import { host } from '../../_config';
import { useSelector } from 'react-redux';
import { slideUp } from '../../utils/slideUp';

const Assess = () => {
    let [assess, setAssess] = useState([]);
    let report = useSelector(state => state.report);
    let user = useSelector(state => state.user);

    useEffect(() => {
        slideUp();
        document.title = '健康评估';
        Axios({
            method : 'GET',
            url : host + '/sample/indicator',
            params : {
                id : report.current,
                'access-token' : user.token
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            const {data} = _data;
            if(data.code === 'success')  setAssess(data.data);
        })
        .catch(error => console.log(error));
    }, []);
    const mapRisk = {
        'low-risk' : 'low-risk',
        'middle-risk' : 'middle-risk',
        'high-risk' : 'high-risk',
        'weaker' : 'high-risk',
        'normal' : 'low-risk',
        'abnormal_low' : 'middle-risk',
        'abnormal_high' : 'high-risk'
    }
    return (
        <div className='assess-container'>
            <div className='assess-title'><span>健康评估</span></div>
            <div>
                {assess.map((v, i) => (
                    <div key={i} className='assess-items'>
                        <div className='assess-item-header'>
                            <div>{v.type_zh}</div><div className={mapRisk[v.conclusion]}>{v.rank_zh}</div>
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
        </div>
    );
}

export default Assess;