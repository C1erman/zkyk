import React, { useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtActivityIndicator } from 'taro-ui';
import { useSelector } from 'react-redux';
import './guide.css';
import { host } from '../../config';


const Guide = () => {
    const router = useRouter()
    const guide = useSelector(state => state.guide)

    useEffect(() => {
        console.log()
        // 去向要做区分
        Taro.request({
            url : host + '/ds/' + guide.add,
            method : 'GET',
            data : {
                code : ''
            }
        })
    }, [guide])
    return (
        <View className='guide-container'>
            <AtActivityIndicator content='加载中...'></AtActivityIndicator>
        </View>
    );
}

export default Guide;