import React, { useState, useEffect } from 'react';

import './reportList.css';
import Axios from 'axios';
import * as BIO from '../../actions';
import { useSelector, useDispatch } from 'react-redux';
import { host } from '../../_config';
import Pager from '../Pager';
import { useHistory, Link } from 'react-router-dom';

const ReportList = () => {
    let user = useSelector(state => state.user);
    const history = useHistory();
    const dispatch = useDispatch();
    let [list, setList] = useState([]);
    let [total, setTotal] = useState(10);

    useEffect(() => {
        if(user.token){
            Axios({
                method : 'GET',
                url : host + '/sample/list',
                params : {
                    'access-token' : user.token,
                    pageNum : 5
                },
                headers : {
                    'Content-Type' : 'application/json; charset=UTF-8'
                }
            }).then(_data => {
                let { data } = _data;
                if(data.code === 'success'){
                    setList(data.data.list);
                    setTotal(data.data.pagination.pageSize);
                }
            })
            .catch(error => {
                dispatch({
                    type : BIO.DENY_UNAUTHORIZED
                })
                history.push('/user/login');
            })
        }
    }, [])
    const getList = (currentPage) => {
        Axios({
            method : 'GET',
            url : host + '/sample/list',
            params : {
                'access-token' : user.token,
                page : currentPage,
                pageNum : 5
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            let { data } = _data;
            if(data.code === 'success'){
                setList(data.data.list);
            }
        })
        .catch(error => console.log(error))
    }
    const mapReportState = (state) => {
        return {
            'untreated' : '未处理',
            'registered' : '已启用',
            'received' : '已收样',
            'under-experiment' : '正在实验',
            'succeeded' : '已完成',
            'failed' : '实验失败',
        }[state]
    }
    const selectHandler = (current) => {
        dispatch({
            type : BIO.REPORT_SELECT,
            data : { current : current }
        })
        history.push('/report/overview');
    }
    const editHandler = (sampleId) => {
        dispatch({
            type : BIO.REPORT_EDIT,
            data : { current : sampleId }
        })
        history.push({
            pathname : '/add',
            state : {
                current : sampleId
            }
        });
    }

    return (
        <div className='reportList-container'>
            <div className='reportList-title'>
                <span>请选择你要查看的报告</span>
            </div>
            <div className='reportList-content'>
                <div className='reportList-info'>
                    报告从上到下按照时间先后了排序。为了保证您的权益，我们秉持流程透明的原则，列出检测流程如下：
                    <div className='reportList-status'>
                        填写知情同意书 » 收取采样工具盒 » 样品采集 » 样品回邮 » 实验处理 » 精准检测报告 » 个性化营养方案
                    </div>
                </div>
                
                {!list.length ? (<div className='reportList-empty'>
                    抱歉，暂时无可操作报告。
                </div>) : (
                    <>
                        <table className='reportList-table'>
                            <thead>
                                <tr className='reportList-table-header'>
                                    <th>受测人</th><th>样本编号</th><th>当前状态</th><th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((v, i) => <tr key={i} className='reportList-table-body'>
                                    <td>{v.person_name}</td>
                                    <td>{v.sample_barcode}</td>
                                    <td>{mapReportState(v.sample_status)}</td>
                                    {/* <td><a className='reportList-btn' onClick={() => selectHandler(v.report_id)}>查看</a></td> */}
                                    <td><a className='reportList-btn' onClick={() => editHandler(v.sample_id)}>编辑</a></td>
                                </tr>)}
                            </tbody>
                        </table>
                        <Pager total={total} prevClick={(currentPage) => getList(currentPage)} nextClick={(currentPage) => getList(currentPage)}  />
                    </>
                )}
            </div>
        </div>
    );
}

export default ReportList;