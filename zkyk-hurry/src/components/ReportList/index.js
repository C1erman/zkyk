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

const ReportList = () => {
    let user = useSelector(state => state.user);
    let controller = {};
    let modalController = {};
    const history = useHistory();
    const dispatch = useDispatch();
    let [list, setList] = useState([]);
    let [total, setTotal] = useState(10);
    let [stateList, setStateList] = useState([
        '未处理', '已启用', '已收样', '正在实验', '已完成'
    ]);
    let [activeState, setActive] = useState(1);

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
    const matchState = (current) => {
        return {
            'untreated' : 0,
            'registered' : 1,
            'received' : 2,
            'under_experiment' : 3,
            'succeeded' : 4,
            'failed' : -1
        }[current]
    }
    const openMadal = (currentState) => {
        setActive(matchState(currentState))
        modalController.on('toggle');
    }

    return (
        <div className='reportList-container'>
            <div className='reportList-title'>
                <span>选择报告以进行后续操作</span>
            </div>
            <div className='reportList-content'>
                <div className='reportList-info'>
                    在实验开始前，您都有机会对您填写的信息进行修改；实验状态结束后方可查看报告。<br />
                    点击报告状态可查看状态详情。
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
                                    <td className={v.sample_status} onClick={() => openMadal(v.sample_status)}>{mapReportState(v.sample_status)}</td>
                                    <td><a className='reportList-btn' onClick={() =>{ mapReportSousa(v.sample_status) === '查看' ? selectHandler(v.report_id || 'error') : editHandler(v.sample_id) }}>{mapReportSousa(v.sample_status)}</a></td>
                                </tr>)}
                            </tbody>
                        </table>
                        <Pager total={total} prevClick={(currentPage) => getList(currentPage)} nextClick={(currentPage) => getList(currentPage)}  />
                    </>
                )}
            </div>
            <Alert controller={controller} content='抱歉，此份报告暂时无法查看，请联系厂商' time={2500} />
            <Modal controller={modalController} title='状态详情' content={
                <ul className='reportList-state'>
                    {stateList.map((v, i, arr) => (<li key={i} className={ i <= activeState ? 'active' : ''}>{v}{i < (arr.length - 1) ? (<span>»</span>) : null}</li>))}
                </ul>
            } />
        </div>
    );
}

export default ReportList;