import React, { useEffect, useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { useSelector, useDispatch } from 'react-redux';
import Taro from '@tarojs/taro';
import { AtButton, AtPagination, AtFloatLayout, AtMessage } from 'taro-ui';
import './reportlist.css';
import { host, imgSrc } from '../../config';
import * as BIO from '../../actions';


const ReportList = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)

    let [list, setList] = useState([])
    let [listCurrent, setCurrent] = useState(1)
    let [listPagination, setPagination] = useState({
        total : 1
    })
    let listNumPerPage = 7
    let [detailStatus, setStatus] = useState([])

    let br = '\n';

    useEffect(() => {
        if(user.token){
            Taro.request({
                url : host + '/sample/list',
                method : 'GET',
                data : {
                    'access-token' : user.token,
                    pageNum : listNumPerPage
                },
                header : {
                    'Content-Type' : 'application/json; charset=UTF-8'
                }
            })
            .then(res => {
                let {data} = res;
                if(data.code === 'success'){
                    setList(data.data.list)
                    setPagination(data.data.pagination);
                }
            })
            .catch(e => console.log(e))
        }
    }, [])

    const mapButtonStatus = (status) => {
        switch(status){
            case 'failed' : return true;
            case 'succeeded' : return true;
            case 'experimenting' : return true;
            default : return false;
        }
    }
    const getStatus = (sampleId) => {
        Taro.request({
            url : host + '/sample/status',
            method : 'GET',
            data : {
                'access-token' : user.token,
                id : sampleId
            },
            header : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let {data} = res;
            if(data.code === 'success'){
                setStatus(data.data);
            }
        })
    }
    const getCurrentList = (currentPage) => {
        setCurrent(currentPage)
        Taro.request({
            url : host + '/sample/list',
            method : 'GET',
            data : {
                'access-token' : user.token,
                page : currentPage,
                pageNum : listNumPerPage
            },
            header : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let {data} = res;
            if(data.code === 'success'){
                setList(data.data.list)
                setPagination(data.data.pagination)
            }
        })
        .catch(e => console.log(e))
    }
    const mapStatusIcon = (status) => {
        return {
            untreated : imgSrc + '/icons/list/untreated_active.svg',
            registered : imgSrc + '/icons/list/registered_active.svg',
            received : imgSrc + '/icons/list/received_active.svg',
            experimenting : imgSrc + '/icons/list/experimenting_active.svg',
            succeeded : imgSrc + '/icons/list/succeeded_active.svg',
            completed : imgSrc + '/icons/list/completed_active.svg',
            failed : imgSrc + '/icons/list/failed.svg'
        }[status]
    }
    const handleViewReport = (reportId) => {
        if(reportId === 'error') Taro.atMessage({
            type : 'error',
            message : '抱歉，此份报告暂时无法查看',
            duration : 2500 
        })
        else{
            dispatch({
                type : BIO.REPORT_SELECT,
                data : { current : reportId }
            })
            Taro.navigateTo({
                url : '/pages/view/view'
            })
        }
    }
    const handleEditSample = (sampleId) => {
        console.log('待开发')
        // dispatch({
        //     type : BIO.REPORT_EDIT,
        //     data : { current : sampleId }
        // })
        // history.push({
        //     pathname : '/report/edit',
        //     state : {
        //         current : sampleId
        //     }
        // });
    }
    const mapOperate = (operate, reportId, sampleId) => {
        if(operate === '查看') return handleViewReport(reportId);
        else if(operate === '编辑') return handleEditSample(sampleId);
        else if(operate === '已锁定') return false;
        else return false;
    }

    return (
        <View className='reportList-container'>
            <AtMessage />
            <View className='reportList-title'><Text className='text'>选择报告以进行后续操作</Text></View>
            <View className='reportList-info'>
                在实验结束、生成报告之前，您都有机会对您填写的信息进行修改；报告生成之后，您只能查看而不能修改相关信息。<Text>{br}点击报告的当前状态以查看状态详情。</Text>
            </View>
            {!list.length ? (
                <View className='reportList-empty'>抱歉，暂时无可以操作的报告。</View>
            ) : (
                <>
                    <View className='reportList-table'>
                        <View className='reportList-table-head'>
                            <View className='tr'>
                                <View className='td'>受测人</View>
                                <View className='td'>样本编号</View>
                                <View className='td'>当前状态</View>
                                <View className='td'>操作</View>
                            </View>
                        </View>
                        <View className='reportList-table-body'>
                            {list.map((v, i) => <View key={i} className='reportList-table-tr tr'>
                                <View className='td'>{v.person_name}</View>
                                <View className='td'>{v.sample_barcode + (v.version ? ' V' + v.version : '')}</View>
                                <View className={'td ' + v.status_en} onClick={() => getStatus(v.sample_id)}>{v.status_zh}</View>
                                <View className='td'><AtButton size='small' circle disabled={mapButtonStatus(v.status_en)} onClick={() => mapOperate(v.operate, v.report_id || 'error', v.sample_id)}>{v.operate}</AtButton></View>
                            </View>)}
                        </View>
                    </View>
                    <AtPagination customStyle={{marginTop : '1.5rem'}} total={listPagination.total} pageSize={listNumPerPage}
                      current={listCurrent} onPageChange={(action) => getCurrentList(action.current)}
                    ></AtPagination>
                    <AtFloatLayout isOpened={detailStatus.length > 0} title='状态详情' onClose={() => setStatus([])}>
                        <View className='reportList-status'>
                            { detailStatus.map((v, i) => (<View key={i} className={'reportList-status-item ' + v.status_en}>
                                <View className='reportList-status-time'>
                                    <Text>{v.year}</Text>
                                    <Text className='important'>{v.month}</Text>
                                    <Text>{v.date}</Text>
                                </View>
                                <View className='reportList-status-icon'>
                                    <Image className='reportList-status-icon-self' src={mapStatusIcon(v.status_en)} />
                                </View>
                                <View className='reportList-status-content'>{v.detail}</View>
                            </View>))}
                        </View>
                    </AtFloatLayout>
                </>
            )}
        </View>
    );
}

export default ReportList;