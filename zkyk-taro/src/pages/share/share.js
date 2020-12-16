import React, { useState, useEffect } from 'react';
import { View, Image, Text } from '@tarojs/components';
import { useSelector } from 'react-redux';
import Taro from '@tarojs/taro';
import { AtButton, AtRadio, AtFloatLayout, AtMessage } from 'taro-ui';

import './share.css';
import { host } from '../../config';
import Pager from '../../component/Pager';

const Share = () => {
    const user = useSelector(state => state.user)
    const share = useSelector(state => state.share)

    let pageNum = 5;

    let [showSrc, setShowSrc] = useState('')
    let [listUpdate, setListUpdate] = useState('')
    let [expire, setExpire] = useState('')
    let [radioValue, setRadioValue] = useState('month')
    let [shareList, setShareList] = useState([])
    let [genFloatOpen, setGenFloatOpen] = useState(false)

    let [listCurrent, setCurrent] = useState(1)
    let [listPagination, setPagination] = useState({
        pageSize : 1
    })

    let [showFloatOpen, setShowFloatOpen] = useState(false)
    
    useEffect(() => {
        let type = 'add'
        if(share[type].code){
            setExpire(share[type].expire)
            setShowSrc(host + '/ds/q/' + share[type].code);
        }
    }, [share])
    useEffect(() => {
        Taro.request({
            url : host + '/user/wx/share',
            method : 'GET',
            data : {
                'access-token' : user.token,
                page : listCurrent,
                pageNum : pageNum
            },
            header : {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let { data } = res;
            if(data.code === 'success'){
                setShareList(data.data.list);
                setPagination(data.data.pagination);
            }
        })
        .catch(e => console.log(e))
    }, [listUpdate])

    const mapExpire = (type) => {
        return {
            day : 1,
            week : 7,
            month : 30,
            forever : 0
        }[type]
    }
    const handleGenerate = () => {
        Taro.request({
            url : host + '/ds/bind?access-token=' + user.token,
            method : 'POST',
            data : {
                expire : mapExpire(radioValue)
            },
            header : {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let { data } = res;
            if(data.code === 'success'){
                let src = host + '/ds/q/' + data.data.code;
                setListUpdate(src);
                setExpire(data.data.expire_at);
                setShowSrc(src);
                setGenFloatOpen(false);
                setShowFloatOpen(true);
            }
            else if(data.code === 'error') Taro.atMessage({
                type : 'error',
                message : data.info,
                duration : 2500
            })
        })
        .catch(e => console.log(e))
    }
    const handleShowQrCode = (code, expire_at) => {
        setExpire(expire_at);
        setShowSrc(host + '/ds/q/' + code);
        setShowFloatOpen(true);
    }
    const getCurrentList = (currentPage) => {
        setCurrent(currentPage);
        Taro.request({
            url : host + '/user/wx/share',
            method : 'GET',
            data : {
                'access-token' : user.token,
                page : currentPage,
                pageNum : pageNum
            },
            header : {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let { data } = res;
            if(data.code === 'success'){
                setShareList(data.data.list);
                setPagination(data.data.pagination);
            }
        })
        .catch(e => console.log(e))
    }

    return (
        <>
            <AtMessage />
            <View className='share-container'>
                <View className='share-title'><Text className='text'>过往分享记录</Text></View>
                { shareList.length ? (
                <View className='share-list-container'>
                    <View className='share-list'>
                        <View className='table'>
                            <View className='thead '>
                                <View className='tr'>
                                    <View className='td'>链接</View>
                                    <View className='td'>过期时间</View>
                                    <View className='td'>二维码</View>
                                </View>
                            </View>
                            <View className='tbody'>
                                {
                                    shareList.map((v, i) => (
                                        <View className='tr' key={i}>
                                            <Text className='td link' selectable>{v.data}</Text>
                                            <Text className='td'>{v.expire_at}</Text>
                                            <View className='td'><AtButton type='secondary' size='small' circle onClick={() => handleShowQrCode(v.code, v.expire_at)}>查看</AtButton></View>
                                        </View>
                                    ))
                                }
                            </View>
                        </View>
                    </View>
                    <Pager current={listCurrent} total={listPagination.pageSize} prevClick={(currentPage) => getCurrentList(currentPage)} nextClick={(currentPage) => getCurrentList(currentPage)} />
                </View>
                ) : (
                    <View className='share-empty'>你还没有生成过分享二维码。</View>
                )}
                <View className='share-title'><Text className='text'>创建分享二维码</Text></View>
                <View className='share-generate'>
                    <AtButton className='button' type='primary' circle onClick={() => setGenFloatOpen(true)}>创建</AtButton>
                </View>
                <AtFloatLayout isOpened={genFloatOpen} title='创建分享' onClose={() => setGenFloatOpen(false)}>
                    <View className='share-gen'>
                        <View className='title'>选择过期时间：</View>
                        <AtRadio className='radio'
                          options={[
                                {label : '一天', value : 'day'},
                                {label : '一周', value : 'week'},
                                {label : '一月', value : 'month'},
                                {label : '永久有效', value : 'forever'}
                            ]}
                          value={radioValue}
                          onClick={(value) => setRadioValue(value)}
                        />
                        <AtButton type='secondary' circle onClick={handleGenerate}>生成</AtButton>
                    </View>
                </AtFloatLayout>
                <AtFloatLayout isOpened={showFloatOpen} title='二维码' onClose={() => setShowFloatOpen(false)}>
                    <View className='share-show-code'>
                        <View className='title'>向受测人分享</View>
                        <View className='time'>过期时间为：{expire}</View>
                        <Image className='img' src={showSrc} showMenuByLongpress />
                    </View>
                </AtFloatLayout>
            </View>
        </>
    );

}

export default Share;