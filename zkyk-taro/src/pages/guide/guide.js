import React, { useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtActivityIndicator, AtMessage } from 'taro-ui';
import { useDispatch } from 'react-redux';
import * as BIO from '../../actions';
import './guide.css';
import { host } from '../../config';


const Guide = () => {
    const router = useRouter()
    const dispatch = useDispatch()

    const TYPE = {
        BIND : 'bind',
    }

    useEffect(() => {
        console.log(router);
        let regExp = /\/([^\/]+)$/;
        // url 仅做测试
        // 二维码链接内容会以参数q的形式带给页面，在onLoad事件中提取q参数并自行decodeURIComponent一次，即可获取原二维码的完整内容。
        let url = 'http://p.biohuge.cn/portal/code/twrq55i93';
        let code = regExp.exec(url);
        // 获取 url 中的最后一位
        Taro.request({
            url : host + '/ds/' + code[1],
            method : 'GET',
            header : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let { data } = res;
            if(data.code === 'success'){
                let {type, access_code} = data.data;
                if(type === TYPE.BIND){
                    dispatch({
                        type : BIO.GUIDE_REPORT_ADD,
                        data : access_code
                    });
                    // 直接返回首页
                    Taro.navigateBack({
                        delta : 2
                    });
                }
            }
            else Taro.atMessage({
                type : 'error',
                message : data.info,
                duration : 2500
            });
        })
        .catch(e => console.log(e))
    }, [])
    return (
        <>
            <AtMessage />
            <View className='guide-container'>
                <AtActivityIndicator content='加载中...' mode='center'></AtActivityIndicator>
            </View>
        </>
    );
}

export default Guide;