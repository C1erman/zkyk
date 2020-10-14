import React, { useEffect, useState } from 'react';
import './overview.css';
import Axios from 'axios';
import { host } from '../../_config';
import { useSelector } from 'react-redux';

const Overview = () => {
    let [user, setUser] = useState({});
    let [flora, setFlora] = useState([]);
    let [result, setResult] = useState([]);
    let report = useSelector(state => state.report);

    useEffect(() => {
        // 模块 A
        Axios({
            method : 'GET',
            url : host + '/sample/personal',
            params : {
                id : report.current
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            },
            timeout : 5000
        }).then(_data => {
            const {data} = _data;
            if(data.code === 'success')  setUser(data.data);
        }).catch(error => {});
        // 模块 BC
        Axios({
            method : 'GET',
            url : host + '/sample/metrics',
            params : {
                id : report.current
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            },
            timeout : 5000
        }).then(_data => {
            const {data} = _data;
            if(data.code === 'success')  setFlora(data.data);
        }).catch(error => {});
        // 模块 E
        Axios({
            method : 'GET',
            url : host + '/charts/bacteria',
            params : {
                id : report.current
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            },
            timeout : 5000
        }).then(_data => {
            const {data} = _data;
            if(data.code === 'success')  setResult(data.data);
        }).catch(error => {});
    }, [])
    const judgeRange = (value, min, max) =>{
        if(value < min) {
            return { className : 'overview-result-below' }
        }
        else if(value > max) {
            return { className : 'overview-result-above' }
        }
    }
    return (
        <div className='overview-container'>
            <div className=''></div>
            <div className='overview-title'><span>整体情况</span></div>
            <div className='overview-total'>
                <div>
                    <span className='overview-total-label'>受检者<span>{user.name}</span></span>
                    <span className='overview-total-label'>性别<span>{user.gender}</span></span>
                </div>
                <div>
                    <span className='overview-total-label'>出生日期<span>{user.birthday}</span></span>
                    <span className='overview-total-label'>报告日期<span>{user.date_of_production}</span></span>
                </div>
            </div>
            <div className='overview-title'><span>菌群状态分析</span></div>
            <div className='overview-flora'>
                {flora.map((v, i) => (
                    <div key={i} className='overview-flora-items'>
                        <div className='overview-flora-item-header'>
                            <div>{v.type_zh}</div><div>{v.rank_zh}</div>
                        </div>
                        <div className='overview-flora-item-body'>
                            {v.summary}
                        </div>
                        <div className='overview-flora-item-result'>
                            {/* <div>结果评价：</div> */}
                            {v.suggestion}
                        </div>
                    </div>
                ))}
            </div>
            <div className='overview-title'><span>具体检测结果</span></div>
            <div className='overview-result'>
                <div className='overview-result-info'>* 红色表示该菌含量异常，对健康有影响</div>
                <table>
                    <thead>
                        <tr className='overview-result-table-head'>
                            <th>名称</th><th>受检者检测数值（Lg CFU/g）</th><th>参考范围（Lg CFU/g）</th>
                        </tr>
                    </thead>
                    <tbody className='overview-result-table-body'>
                        {result.map(v => (
                            <tr key={v.name}>
                                <td className={'overview-error'}>{v.name}</td><td {...judgeRange(v.value, v.range_up, v.range_down)}>{v.value}</td><td>{v.range_up} - {v.range_down}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Overview;