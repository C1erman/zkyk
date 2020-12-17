import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { AtMessage, AtButton, AtFloatLayout, AtRadio } from 'taro-ui';
import { useSelector } from 'react-redux';

import './shareSign.css';
import { host } from '../../config';

const ShareSign = () => {
    const user = useSelector(state => state.user)

    let pageSize = 5; // 每页栏目显示数量
    
    let [shareList, setShareList] = useState([])
    let [currentPage, setCurrentPage] = useState(1)
    let [floatGenOpen, setFloatGenOpen] = useState(false)
    let [floatShowOpen, setFloatShowOpen] = useState(false)

    let [genRadioVal, setGenRadio] = useState('month')

    let [shareListUpdate, setShareListUpdate] = useState('')
    let [showSrc, setShowSrc] = useState('')
    let [showExpire, setShowExpire] = useState('')



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
            url : host() + '/ds/signup?access-token=' + user.token,
            method : 'POST',
            data : {
                expire : mapExpire(genRadioVal)
            },
            header : {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let { data } = res;
            if(data.code === 'success'){

                let codeSrc = host() + '/ds/q/' + data.data.code;
                setShareListUpdate(codeSrc); // 驱使列表更新
                setShowSrc(codeSrc);
                setShowExpire(data.data.expire_at);
                setFloatGenOpen(false);
                setFloatShowOpen(true);
            }
            else if(data.code === 'error') Taro.atMessage({
                type : 'error',
                message : data.info,
                duration : 2500
            })
        })
        .catch(e => console.log(e))
    }

    useEffect(() => {
        Taro.request({
            url : host() + '/ds/list',
            method : 'GET',
            data : {
                'access-token' : user.token,
                type : 'signup',
                pageNum : currentPage,
                pageSize
            },
            header : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let {data} = res;
            if(data.code === 'success') setShareList(data.data?.list || []);
        })
        .catch(e => console.log(e))
    }, [user, shareListUpdate])

    return (
        <>
            <AtMessage />
            <View className='shareSign-container'>
                <View className='shareSign-title'><Text className='text'>过往分享记录</Text></View>
                {
                    shareList.length ? (
                        <View className='shareSign-list-container'>
                            <View className='shareSign-list'>
                                <View className='table'>
                                    <View className='thead'>
                                        <View className='tr'>
                                            <View className='td'>链接</View>
                                            <View className='td'>过期时间</View>
                                            <View className='td'>二维码</View>
                                        </View>
                                    </View>
                                    <view className='tbody'>
                                    {
                                        shareList.map((v, i) => (
                                            <View className='tr' key={i}>
                                                <Text className='td link' selectable>{v.data}</Text>
                                                <Text className='td'>{v.expire_at}</Text>
                                                <View className='td'><AtButton type='secondary' size='small' circle>查看</AtButton></View>
                                            </View>
                                        ))
                                    }
                                    </view>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View className='shareSign-empty shareSign-list-container'>未查询到分享记录。</View>
                    )
                }
                <View className='shareSign-title'><Text className='text'>创建分享注册二维码</Text></View>
                <View className='shareSign-generate'>
                    <AtButton className='button' type='primary' circle onClick={() => setFloatGenOpen(true)}>创建</AtButton>
                </View>
                <AtFloatLayout isOpened={floatGenOpen} title='创建二维码' onClose={() => setFloatGenOpen(false)}>
                    <View className='shareSign-gen'>
                        <View className='title'>选择过期时间：</View>
                        <AtRadio className='radio'
                          options={[
                                {label : '一天', value : 'day'},
                                {label : '一周', value : 'week'},
                                {label : '一月', value : 'month'},
                                {label : '永久有效', value : 'forever'}
                            ]}
                          value={genRadioVal}
                          onClick={(value) => setGenRadio(value)}
                        />
                        <AtButton type='secondary' circle onClick={handleGenerate}>生成</AtButton>
                    </View>
                </AtFloatLayout>
                <AtFloatLayout isOpened={floatShowOpen} title='二维码' onClose={() => setFloatShowOpen(false)}>
                    <View className='shareSign-show-code'>
                        <View className='title'>向受测人分享</View>
                        <View className='time'>过期时间为：{showExpire}</View>
                        <Image className='img' src={showSrc} showMenuByLongpress />
                    </View>
                </AtFloatLayout>
            </View>
        </>
    );
}

export default ShareSign;