import React, { useEffect, useState } from 'react';
import './backend.css';
import Axios from 'axios';
import { host } from '../../_config';
import { useSelector, useDispatch } from 'react-redux';
import { slideUp } from '../../utils/slideUp';
import Pager from '../Pager';
import * as BIO from '../../actions';

const Backend = () => {
    const dispatch = useDispatch();
    let user = useSelector(state => state.user);
    let [total, setTotal] = useState(10);
    let [list, setList] = useState([]);
    let [backendData, setData] = useState();

    useEffect(() => {
        slideUp();
        Axios({
            method : 'GET',
            url : host + '/admin/total',
            params : {
                'access-token' : user.token
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            let { data } = _data;
            if(data.code === 'success') setData(data.data);
        }).catch(error => console.log(error));
        Axios({
            method : 'GET',
            url : host + '/admin/list',
            params : {
                'access-token' : user.token,
                pageNum : 12
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            let { data } = _data;
            if(data.code === 'success') {
                setList(data.data.list);
                setTotal(data.data.pagination.pageSize);
            }
        })
        .catch(error => console.log(error));
    }, [])
    const getList = (currentPage) => {
        Axios({
            method : 'GET',
            url : host + '/admin/list',
            params : {
                'access-token' : user.token,
                page : currentPage,
                pageNum : 12
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            let { data } = _data;
            if(data.code === 'success') {
                setList(data.data.list);
                setTotal(data.data.pagination.pageSize);
            }
        })
        .catch(error => console.log(error));
    }
    return (
        <div className='backend-container'>
            { !backendData ? (
                <div className='backend-empty'>
                    抱歉，暂无数据。
                </div>
            ) : (
                <>
                    <div className='backend-title'><span>数据总览</span></div>
                    <div className='backend-total'>
                        <div>采样管总使用情况（份）</div>
                        <div><span className='backend-total-bind'>{backendData.family.bind}</span>/<span className='backend-total-unbind'>{backendData.family.total}</span></div>
                        <div className='backend-total-grow'>采样管绑定数较上月<span>
                            {backendData.positive ? '增长' : '减少'}</span>: <span className={backendData.positive ? 'backend-grow-postive' : 'backend-grow-negative'}>{backendData.growthValue}</span>，增长率为：<span className={backendData.positive ? 'backend-grow-postive' : 'backend-grow-negative'}>
                        { (backendData.positive ? '+': '-' ) + backendData.growthRate + '%'}
                        </span></div>
                    </div>
                    <div className='backend-list'>
                        <div className='backend-title'><span>直属机构采样报告情况</span></div>
                        <table>
                            <thead className='backend-list-head'>
                                <tr>
                                    <th>公司名称</th><th>报告编号</th><th>更新于</th><th>报告状态</th>
                                </tr>
                            </thead>
                            <tbody className='backend-list-body'>
                                {
                                    list.map((v, i) => (
                                        <tr key={i}>
                                            <td>{v.name}</td>
                                            <td>{v.barcode}</td>
                                            <td>{v.date}<br />{v.time}</td>
                                            <td className={v.status_en}>{v.status_zh}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <Pager total={total} prevClick={(currentPage) => getList(currentPage)} nextClick={(currentPage) => getList(currentPage)}  />
                    </div>
                </>
            )}
        </div>
    );
}

export default Backend;