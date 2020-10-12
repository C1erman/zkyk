import React, { useState, useEffect } from 'react';

import './reportList.css';
import Pager from '../Pagination';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { host } from '../../_config';

const ReportList = () => {
    let user = useSelector(state => state.user);
    let [list, setList] = useState([]);

    useEffect(() => {
        Axios({
            method : 'GET',
            url : host + '/sample/list',
            params : {
                'access-token' : user.token
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            let { data } = _data;
            if(data.code === 'success'){
                setList(data.data);
            }
        })
        .catch(error => console.log(error))
    }, [])

    return (
        <div className='reportList-container'>
            <div className='reportList-title'>
                <span>选择你要查看的报告</span>
            </div>
            <div className='reportList-content'>
                <div className='reportList-info'>
                    报告从上到下按照时间先后了排序。同时，为了方便你了解每份报告当前所处的状态，我们在下方列出了报告状态对照表。
                </div>
                <div className='reportList-empty'>
                    抱歉，暂时无可操作报告。
                </div>
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
                            <td>查看</td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ReportList;