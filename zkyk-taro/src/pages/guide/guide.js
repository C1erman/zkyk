import React, { useEffect } from 'react';
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtActivityIndicator, AtMessage } from 'taro-ui';
import { useDispatch } from 'react-redux';
import * as BIO from '../../actions';
import './guide.css';
import { host } from '../../config';


const Guide = () => {
    const dispatch = useDispatch()

    const TYPE = {
        BIND : 'bind',
        SIGNUP : 'signup',
        REPORT : 'report'
    }
    useDidShow(() => {
        let { q } = getCurrentInstance().router.params;
        if(!q){
            Taro.atMessage({
                type : 'error',
                message : '该二维码已失效。',
                duration : 2500
            });
            setTimeout(() => {
                Taro.reLaunch({
                    url : '/pages/index/index'
                });
            }, 2500)
        }
        else{
            let url = decodeURIComponent(q);
            let regExp = /\/([^\/]+)$/;
            let code = regExp.exec(url);
            // 获取 url 中的最后一位
            Taro.request({
                url : host() + '/ds/' + code[1],
                method : 'GET',
                header : {
                    'Content-Type' : 'application/json; charset=UTF-8'
                }
            })
            .then(res => {
                let { data } = res;
                if(data.code === 'success'){
                    let { type, access_code } = data.data;
                    switch(type){
                        case TYPE.BIND : {
                            dispatch({ type : BIO.GUIDE_REPORT_ADD, data : access_code });
                            Taro.reLaunch({ url : '/pages/index/index' });
                            break;
                        }
                        case TYPE.SIGNUP : {
                            dispatch({ type : BIO.GUIDE_SIGN_UP, data : access_code });
                            Taro.reLaunch({ url : '/pages/login/login' });
                            break;
                        }
                        case TYPE.REPORT : {
                            dispatch({ type : BIO.GUIDE_REPORT, data : access_code });
                            Taro.reLaunch({ url : '/pages/view/view' });
                            break;
                        }
                        default : Taro.atMessage({
                            type : 'error',
                            message : '分享二维码无效',
                            duration : 2500
                        });
                    }
                }
                else{
                    Taro.atMessage({
                        type : 'error',
                        message : data.info,
                        duration : 2500
                    });
                    setTimeout(() => {
                        Taro.reLaunch({
                            url : '/pages/index/index'
                        });
                    }, 2500);
                }
            })
            .catch(e => console.log(e))
        }
    })
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