import React, { useEffect, useState, useRef } from 'react';
import './backend.css';
import Axios from 'axios';
import { host } from '../../_config';
import { useSelector, useDispatch } from 'react-redux';
import { slideUp, slideToDom } from '../../utils/slideUp';
import Pager from '../Pager';
import * as BIO from '../../actions';
import { useHistory } from 'react-router-dom';
import Input from '../Input';
import Button from '../Button';
import Modal from '../Modal';
import Alert from '../Alert';

const Backend = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    let user = useSelector(state => state.user);
    let backendList = useSelector(state => state.backendList);
    let [currentPage, setCurrentPage] = useState(1);
    let [total, setTotal] = useState(1);
    let [list, setList] = useState([]);
    let [backendData, setData] = useState();

    let [editStatusPermission, setEditStatusPerm] = useState(false);
    let [inputs, setInputs] = useState({
        barCode : ''
    });
    let selectStatusRef = useRef();
    let [search, setSearch] = useState({
        barCode : '',
        status : ''
    });

    let modalController = {};
    let editModalController ={};
    let [queryResult, setQueryResult] = useState();
    let selectEditStatusRef = useRef();
    let [alertMessage, setAlertMsg] = useState('');
    let alertController = {};

    const getInitialList = () => {
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
                setCurrentPage(1);
            }
        })
        .catch(error => console.log(error));
    }
    useEffect(() => {
        slideUp();
        document.title = '后台管理';
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
        getInitialList();
        Axios({
            method : 'GET',
            url : host + '/user/permission',
            params : {
                'access-token' : user.token,
                controller : 'admin',
                action : 'modify-status'
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            const {data} = _data;
            if(data.code === 'success') setEditStatusPerm(true);
            else setEditStatusPerm(false);
        }).catch(error => console.log(error));
    }, [])
    const getList = (currentPage) => {
        // dispatch({
        //     type : BIO.BACKEND_LIST_CURRENT_PAGE,
        //     data : currentPage
        // });
        Axios({
            method : 'GET',
            url : host + '/admin/list',
            params : {
                'access-token' : user.token,
                page : currentPage,
                pageNum : 12,
                barCode : search.barCode,
                status : search.status
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            let { data } = _data;
            if(data.code === 'success') {
                setList(data.data.list);
                setTotal(data.data.pagination.pageSize);
                setCurrentPage(currentPage);
                slideToDom(document.querySelector('.backend-list'));
            }
        })
        .catch(error => console.log(error));
    }
    const mapStatus = {
        untreated : '未使用',
        registered : '已启用',
        received : '已收样',
        experimenting : '实验中',
        succeeded : '实验完成',
        pending : '待审核',
        completed : '已完成',
        failed : '实验失败'
    }
    const handleDownload = (sampleId) => {
        dispatch({
            type : BIO.REPORT_DOWNLOAD,
            data : sampleId
        });
        history.push({
            pathname : '/pdf',
            state : {
                sampleId : sampleId
            }
        });
    }
    const handleSearch = () => {
        Axios({
            method : 'GET',
            url : host + '/admin/list',
            params : {
                'access-token' : user.token,
                pageNum : 12,
                barCode : inputs.barCode.value,
                status : selectStatusRef.current.value
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            let { data } = _data;
            if(data.code === 'success') {
                setList(data.data.list);
                setCurrentPage(1);
                setTotal(data.data.pagination.pageSize);
                setSearch({
                    barCode : inputs.barCode.value,
                    status : selectStatusRef.current.value
                })
                
                slideToDom(document.querySelector('.backend-list'));
                modalController.on('toggle');
                setAlertMsg('查询成功');
                alertController.on('toggle');
            }
        }).catch(error => console.log(error))
    }
    const handleKeepSearch = () => {
        Axios({
            method : 'GET',
            url : host + '/admin/list',
            params : {
                'access-token' : user.token,
                pageNum : 12,
                barCode : search.barCode,
                status : search.status
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            let { data } = _data;
            if(data.code === 'success') {
                setList(data.data.list);
                setCurrentPage(1);
                setTotal(data.data.pagination.pageSize);          
                slideToDom(document.querySelector('.backend-list'));
            }
        }).catch(error => console.log(error))
    }
    const handleQueryStatus = (barCode) => {
        editModalController.on('toggle');
        Axios({
            method : 'POST',
            url : host + '/admin/query/status',
            params : {
                'access-token' : user.token,
                barcode : barCode
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            let { data } = _data;
            if(data.code === 'success') {
                setQueryResult(data.data);
            }
        }).catch(error => console.log(error))
    }
    const handleEditStatus = (barCode, currentStatus) => {
        Axios({
            method : 'POST',
            url : host + '/admin/modify/status',
            params : {
                'access-token' : user.token,
            },
            data : {
                barcode : barCode,
                status : selectEditStatusRef.current.value,
                current : currentStatus
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            let { data } = _data;
            if(data.code === 'success') {
                setAlertMsg('更新成功');
                alertController.on('toggle');
                editModalController.on('toggle');
                handleKeepSearch();
            }
            else{
                setAlertMsg('更新失败');
                alertController.on('toggle');
            }
        }).catch(error => console.log(error))
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
                        {search.barCode || search.status ? (<p className='backend-list-search'>
                            查询条件为{search.barCode ? (<span>{search.barCode}</span>) : null}
                            {search.status ? (<span className={search.status}>{mapStatus[search.status]}</span>) : null}
                        </p>) : null}
                        <table>
                            <thead className='backend-list-head'>
                                <tr>
                                    <th>受检人</th><th>报告编号</th><th>报告状态</th><th>操作</th>
                                </tr>
                            </thead>
                            <tbody className='backend-list-body'>{ 
                                list.map((v, i) => (
                                    <tr key={i}>
                                        <td>{v.person_name ? v.person_name : '-'}</td>
                                        <td>{v.barcode + (v.version ? ' V' + v.version : '')}</td>
                                        <td className={v.status_en}>{v.status_zh}</td>
                                        <td>{v.status_en === 'completed' ? (<a className='backend-list-btn' onClick={() => handleDownload(v.report_id)}>下载</a>) 
                                        : editStatusPermission ? (<a className='backend-list-btn' onClick={() => handleQueryStatus(v.barcode)}>更新状态</a>) : '-'}</td>
                                    </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        { list.length ? null : (<div className='backend-empty'>抱歉，暂无数据。</div>) }
                        <Pager total={total} current={currentPage} prevClick={(currentPage) => getList(currentPage)} nextClick={(currentPage) => getList(currentPage)}  />
                        <Button text='报告查询' hollow={true} click={() => modalController.on('toggle')} />
                        <Modal title='查询' controller={modalController} content={
                            <>
                                <Input label='报告编号' placeholder='输入报告编号，可为空' enableEmpty={true} form={inputs} dataName='barCode' />
                                <div className='backend-form-input'>
                                    <label>报告状态</label>
                                    <select className='backend-form-inputs' ref={selectStatusRef}>
                                        <option value=''>无限制</option>
                                        <option value='completed'>已完成</option>
                                        <option value='succeeded'>实验完成</option>
                                        <option value='pending'>待审核</option>
                                        <option value='failed'>实验失败</option>
                                        <option value='experimenting'>实验中</option>
                                        <option value='received'>已收样</option>
                                        <option value='registered'>已启用</option>
                                        <option value='untreated'>未使用</option>
                                    </select>
                                </div>
                                <Button text='查询' withError={false} click={handleSearch} />
                            </>
                        } />
                        <Modal title='更新报告状态' controller={editModalController} content={
                            queryResult ? (
                                <div className='backend-edit-status'>
                                    <p>正在准备更新报告编号为<span>{queryResult.barCode}</span>的报告，当前状态为<span className={queryResult.current}>{mapStatus[queryResult.current]}</span></p>
                                    {
                                        queryResult.operational ? (<>
                                        <div className='backend-form-input'>
                                            <label>报告状态</label>
                                            <select className='backend-form-inputs' ref={selectEditStatusRef}>
                                                {
                                                    queryResult.operational ? queryResult.operational.map((v, i) => (
                                                        <option key={i} value={v}>{mapStatus[v]}</option>
                                                    )) : null
                                                }
                                            </select>
                                        </div>
                                        <Button text='更新' hollow={true} click={() => handleEditStatus(queryResult.barCode, queryResult.current)} />
                                        </>) : (<div className='backend-empty'>当前采样管无法更新状态。</div>)
                                    }
                                </div>
                            ) : (<div className='backend-empty'>当前采样管无法更新状态。</div>)
                        } />
                        <Alert controller={alertController} content={alertMessage} />
                    </div>
                </>
            )}
        </div>
    );
}

export default Backend;