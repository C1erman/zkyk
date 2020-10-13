import React, { useState, useEffect } from 'react';

import './reportList.css';
import Axios from 'axios';
import * as BIO from '../../actions';
import { useSelector, useDispatch } from 'react-redux';
import { host } from '../../_config';
import Pager from '../Pager';
import { useHistory } from 'react-router-dom';

const ReportList = () => {
    let user = useSelector(state => state.user);
    const history = useHistory();
    const dispatch = useDispatch();
    let [list, setList] = useState([]);
    let [total, setTotal] = useState(10);

    useEffect(() => {
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
    const selectHandler = (current) => {
        dispatch({
            type : BIO.REPORT_SELECT,
            data : { current : current }
        })
        history.push('/report/overview');
    }

    return (
        <div className='reportList-container'>
            <div className='reportList-title'>
                <span>选择你要查看的报告</span>
            </div>
            <div className='reportList-content'>
                <div className='reportList-info'>
                    报告从上到下按照时间先后了排序。同时，为了方便你了解每份报告当前所处的状态，我们在下方列出了报告状态对照表。
                </div>
                {!list.length ? (<div className='reportList-empty'>
                    抱歉，暂时无可操作报告。
                </div>) : (
                    <>
                        <table className='reportList-table'>
                            <thead>
                                <tr className='reportList-table-header'>
                                    <th>受测人</th><th>样本编号</th><th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((v, i) => <tr key={i} className='reportList-table-body'>
                                    <td>{v.person_name}</td>
                                    <td>{v.sample_barcode}</td>
                                    <td><a className='reportList-btn' onClick={() => selectHandler(v.report_id)}>查看</a></td>
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