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
                'access-token' : user.token,
                id : user.id
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            let { data } = _data;
            if(data.code === 'success') setData(data.data);
        })
        .catch(error => {
            // 后续改成全局消息提醒
            console.info('登录凭证过期，用户需要重新登录。');
            dispatch({
                type : BIO.LOGIN_EXPIRED
            });
            history.push('/user/login');
        })
        Axios({
            method : 'GET',
            url : host + '/admin/list',
            params : {
                'access-token' : user.token,
                id : user.id,
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
        .catch(error => console.log(error))
    }, [])
    const mapReportState = (state) => {
        return {
            '未处理' : 'untreated',
            '已启用' : 'registered',
            '已收样' : 'received',
            '正在实验' : 'under_experiment',
            '已完成' : 'succeeded',
            '实验失败' : 'failed',
            '该机构无采样管' : 'noBarCode'
        }[state]
    }
    const getList = (currentPage) => {
        Axios({
            method : 'GET',
            url : host + '/admin/list',
            params : {
                'access-token' : user.token,
                id : user.id,
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
        .catch(error => console.log(error))
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
                        <div className='backend-total-grow'>较上月增长 : <span className={backendData.positive ? 'backend-grow-postive' : 'backend-grow-negative'}>
                        { (backendData.positive ? '+': '-' ) + backendData.growthRate + '%'}
                        </span></div>
                    </div>
                    <div className='backend-list'>
                        <div className='backend-title'><span>直属机构采样报告情况</span></div>
                        <table>
                            <thead className='backend-list-head'>
                                <tr>
                                    <th>公司名称</th><th>报告编号</th><th>采样日期</th><th>报告状态</th>
                                </tr>
                            </thead>
                            <tbody className='backend-list-body'>
                                {
                                    list.map((v, i) => (
                                        <tr key={i}>
                                            <td>{v.name}</td>
                                            <td>{v.barcode}</td>
                                            <td>{v.date_of_collection}</td>
                                            <td className={mapReportState(v.status)}>{v.status}</td>
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