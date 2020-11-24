import React, { useEffect, useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { useSelector } from 'react-redux';
import Taro from '@tarojs/taro';
import { AtButton, AtPagination, AtFloatLayout } from 'taro-ui';
import './reportlist.css';
import { host } from '../../config';


const ReportList = () => {
    const user = useSelector(state => state.user)

    let [list, setList] = useState([])
    let [listTotal, setTotal] = useState(1)
    let [listCurrent, setCurrent] = useState(1)
    let listNumPerPage = 7
    let [status, setStatus] = useState([])


    useEffect(() => {
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
                setTotal(data.data.pagination.pageSize);
            }
        })
        .catch(e => console.log(e))
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
                setTotal(data.data.pagination.pageSize);
            }
        })
        .catch(e => console.log(e))
    }
    const mapStatusIcon = (status) => {
        return {
            untreated : '../../icons/list/untreated_active.svg',
            registered : '../../icons/list/registered_active.svg',
            received : '../../icons/list/received_active.svg',
            experimenting : '../../icons/list/experimenting_active.svg',
            succeeded : '../../icons/list/succeeded_active.svg',
            completed : '../../icons/list/completed_active.svg',
            failed : '../../icons/list/failed.svg'
        }[status]
    }

    return (
        <View className='reportList-container'>
            <View className='reportList-title'><Text className='text'>选择报告以进行后续操作</Text></View>
            <View className='reportList-info'>
                在实验结束、生成报告之前，您都有机会对您填写的信息进行修改；报告生成之后，您只能查看而不能修改相关信息。<br />点击报告的当前状态以查看状态详情。
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
                                <View className='td'><AtButton size='small' circle disabled={mapButtonStatus(v.status_en)} onClick={() => console.log('sd')}>{v.operate}</AtButton></View>
                            </View>)}
                        </View>
                    </View>
                    <AtPagination customStyle={{marginTop : '1.5rem'}} icon total={73}
                      current={listCurrent} pageSize={listNumPerPage} onPageChange={(action) => getCurrentList(action.current)}
                    ></AtPagination>
                    <AtFloatLayout isOpened={status.length > 0} title='状态详情' onClose={() => setStatus([])}>
                        <View className='reportList-status'>
                            { status.map((v, i) => (<View key={i} className={'reportList-status-item ' + v.status_en}>
                                <View className='reportList-status-time'>
                                    <Text>{v.year}</Text>
                                    <Text>{v.month}</Text>
                                    <Text>{v.date}</Text>
                                </View>
                                <View className='reportList-status-icon'>
                                    <Image src={mapStatusIcon(v.status_en)} />
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