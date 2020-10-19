import React, { useState, useEffect } from 'react';

import './reportList.css';
import Axios from 'axios';
import * as BIO from '../../actions';
import { useSelector, useDispatch } from 'react-redux';
import { host } from '../../_config';
import Pager from '../Pager';
import { useHistory, Link } from 'react-router-dom';
import { slideUp } from '../../utils/slideUp';
import Alert from '../Alert';

const ReportList = () => {
    let user = useSelector(state => state.user);
    let controller = {};
    const history = useHistory();
    const dispatch = useDispatch();
    let [list, setList] = useState([]);
    let [total, setTotal] = useState(10);

    useEffect(() => {
        slideUp();
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
                console.log(error);
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
        .catch(error => {
            console.log(error);
            history.push('/user/login');
        })
    }
    const mapReportState = (state) => {
        return {
            'untreated' : '未处理',
            'registered' : '已启用',
            'received' : '已收样',
            'under_experiment' : '正在实验',
            'succeeded' : '已完成',
            'failed' : '实验失败'
        }[state]
    }
    const mapReportSousa = (state) => {
        return {
            'untreated' : '编辑',
            'registered' : '编辑',
            'received' : '编辑',
            'under_experiment' : '查看',
            'succeeded' : '查看',
            'failed' : '查看'
        }[state]
    }
    const selectHandler = (current) => {
        if(current === 'error') controller.on('open');
        else {
            dispatch({
                type : BIO.REPORT_SELECT,
                data : { current : current }
            })
            history.push('/report/overview');
        }
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
                <span>选择报告以进行后续操作</span>
            </div>
            <div className='reportList-content'>
                <div className='reportList-info'>
                    报告从上到下按照时间先后了排序。为了保证您的权益，我们秉持流程透明的原则，列出报告流程如下：
                    <div className='reportList-status'>
                        未处理 » 已启用 » 已收样 » 正在试验 » 已完成 （或） 实验失败
                    </div>
                    注：在实验开始前，您都机会对您填写的信息进行修改；实验状态结束后方可查看报告。
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
                                    <td className={v.sample_status}>{mapReportState(v.sample_status)}</td>
                                    <td><a className='reportList-btn' onClick={() =>{ mapReportSousa(v.sample_status) === '查看' ? selectHandler(v.report_id || 'error') : editHandler(v.sample_id) }}>{mapReportSousa(v.sample_status)}</a></td>
                                </tr>)}
                            </tbody>
                        </table>
                        <Pager total={total} prevClick={(currentPage) => getList(currentPage)} nextClick={(currentPage) => getList(currentPage)}  />
                    </>
                )}
            </div>
            <Alert controller={controller} content='抱歉，报告暂时无法查看，请联系管理员' time={3000} />
        </div>
    );
}

export default ReportList;