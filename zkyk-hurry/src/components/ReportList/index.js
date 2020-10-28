import React, { useState, useEffect } from 'react';
import './reportList.css';
import Axios from 'axios';
import * as BIO from '../../actions';
import { useSelector, useDispatch } from 'react-redux';
import { host } from '../../_config';
import Pager from '../Pager';
import { useHistory } from 'react-router-dom';
import { slideUp } from '../../utils/slideUp';
import Alert from '../Alert';
import Modal from '../Modal';

import untreatedSrc from '../../icons/status/untreated_active.svg';
import registeredSrc from '../../icons/status/registered_active.svg';
import receivedSrc from '../../icons/status/received_active.svg';
import experimentingSrc from '../../icons/status/experimenting_active.svg';
import succeededSrc from '../../icons/status/succeeded_active.svg';
import completedSrc from '../../icons/status/completed_active.svg';
import failedSrc from '../../icons/status/failed.svg';

const ReportList = () => {
    let user = useSelector(state => state.user);
    let controller = {};
    let modalController = {};
    const history = useHistory();
    const dispatch = useDispatch();
    let [list, setList] = useState([]);
    let [total, setTotal] = useState(5);
    let [status, setStatus] = useState([]);

    useEffect(() => {
        slideUp();
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
            console.info('登录凭证过期，用户需要重新登录。');
            dispatch({
                type : BIO.LOGIN_EXPIRED
            });
            history.push('/user/login');
        })
    }, [])
    const getList = (currentPage) => {
        Axios({
            method : 'GET',
            url : host + '/sample/list',
            params : {
                'access-token' : user.token,
                page : currentPage,
                pageNum : 7
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
            console.info('登录凭证过期，用户需要重新登录。');
            dispatch({
                type : BIO.LOGIN_EXPIRED
            });
            history.push('/user/login');
        })
    }
    const getStatus = (sampleId) => {
        Axios({
            method : 'GET',
            url : host + '/sample/status',
            params : {
                'access-token' : user.token,
                id : sampleId
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            let { data } = _data;
            if(data.code === 'success') {
                setStatus(data.data);
                modalController.on('toggle');
            }
        })
        .catch(error => {})
    }
    const selectHandler = (reportId) => {
        if(reportId === 'error') controller.on('open');
        else{
            dispatch({
                type : BIO.REPORT_SELECT,
                data : { current : reportId }
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
            pathname : '/report/edit',
            state : {
                current : sampleId
            }
        });
    }
    const mapImageUrl = (status) => {
        return {
            untreated : untreatedSrc,
            registered : registeredSrc,
            received : receivedSrc,
            experimenting : experimentingSrc,
            succeeded : succeededSrc,
            completed : completedSrc,
            failed : failedSrc
        }[status]
    }

    return (
        <div className='reportList-container'>
            <div className='reportList-title'>
                <span>选择报告以进行后续操作</span>
            </div>
            <div className='reportList-content'>
                <div className='reportList-info'>在实验结束、生成报告之前，您都有机会对您填写的信息进行修改；
                报告生成之后，您只能查看而不能修改相关信息。<br />点击报告状态可查看状态详情。
                </div>
                {!list.length ? (<div className='reportList-empty'>
                    抱歉，暂时无可以操作的报告。
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
                                    <td className={v.status_en} onClick={() => getStatus(v.sample_id)}>{v.status_zh}</td>
                                    <td><a className={'reportList-btn' + (v.status_zh === '实验失败' ? ' disabled' : '')} onClick={() =>{ v.operate === '查看' ? selectHandler(v.report_id || 'error') : editHandler(v.sample_id) }}>{v.operate}</a></td>
                                </tr>)}
                            </tbody>
                        </table>
                        <Pager total={total} prevClick={(currentPage) => getList(currentPage)} nextClick={(currentPage) => getList(currentPage)}  />
                    </>
                )}
            </div>
            <Alert controller={controller} content='抱歉，此份报告暂时无法查看，请联系厂商' time={2500} />
            <Modal controller={modalController} title='状态详情' content={
                <ul className='reportList-status'>
                    { status.map((v, i) => (<li key={i} className={v.status_en}>
                        <div className='reportList-status-time'>
                            <span>{v.year}</span>
                            <span>{v.month}</span>
                            <span>{v.date}</span>
                        </div>
                        <div className='reportList-status-icon'>
                            <img src={mapImageUrl(v.status_en)} />
                        </div>
                        <div className='reportList-status-content'>{v.detail}</div>
                    </li>))}
                </ul>
            } onClose={() => setStatus([])} />
        </div>
    );
}

export default ReportList;