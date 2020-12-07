import React, { useState, useEffect } from 'react';
import { View, Image, Text } from '@tarojs/components';
import { useSelector } from 'react-redux';
import Taro from '@tarojs/taro';
import { AtButton, AtRadio } from 'taro-ui';

import './share.css';
import { host } from '../../config';

const Share = () => {
    const user = useSelector(state => state.user)
    const share = useSelector(state => state.share)

    let [bindSrc, setBindSrc] = useState('')
    let [expire, setExpire] = useState('')
    let [radioValue, setRadioValue] = useState('')
    let [shareList, setShareList] = useState()
    
    useEffect(() => {
        let type = 'add'
        if(share[type].code){
            setExpire(share[type].expire)
            setBindSrc(host + '/ds/q/' + share[type].code);
        }
        Taro.request({
            url : host + '/user/wx/share',
            method : 'GET',
            data : {
                'access-token' : user.token
            },
            header : {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let { data } = res;
            if(data.code === 'success') setShareList(data.data);
        })
        .catch(e => console.log(e))
    }, [share])

    const handleShowQrCode = (id) => {
        console.log(id)
    }

    return (
        <View className='share-container'>
            <View className='share-code-container'>
                <View className='title'>向受测人分享</View>
                <View className='time'>过期时间为：{expire}</View>
                <Image className='img' src={bindSrc} />
            </View>
            <View className='share-title'><Text className='text'>创建分享二维码</Text></View>
            <View className='share-generate'>
                <View>选择过期时间</View>
                <AtRadio
                  options={[
                      {label : '一天', value : 'day'},
                      {label : '一周', value : 'week'},
                      {label : '一月', value : 'month'},
                      {label : '永久有效', value : 'forever'}
                  ]}
                  value={radioValue}
                  onClick={(value) => setRadioValue(value)}
                />
            </View>
            <View className='share-title'><Text className='text'>过往分享</Text></View>
            { shareList ? (
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
                                    <Text className='td link'>{v.data}</Text>
                                    <Text className='td'>{v.expire_at}</Text>
                                    <View className='td'><AtButton type='secondary' size='small' circle onClick={() => handleShowQrCode(v.id)}>查看</AtButton></View>
                                </View>
                            ))
                        }
                    </View>
                </View>
            </View>
            ) : (
                <View className='share-empty'>你还没有生成过分享二维码</View>
            )}
        </View>
    );

}

export default Share;