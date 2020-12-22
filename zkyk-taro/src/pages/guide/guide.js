import React, { useEffect, useState } from 'react';
import Taro, { useDidShow, getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtActivityIndicator, AtMessage, AtInput, AtButton } from 'taro-ui';
import { useDispatch } from 'react-redux';
import * as BIO from '../../actions';
import './guide.css';
import { host } from '../../config';
import Modal from '../../component/Modal';


const Guide = () => {
    const dispatch = useDispatch() 

    let [guideData, setGuideData] = useState({})
    let [visible, setVisible] = useState(false)
    let [codePassword, setPassword] = useState('')

    let [submitLoading, setSubmitLoading] = useState(false)

    const TYPE = {
        BIND : 'bind',
        SIGNUP : 'signup',
        REPORT : 'report'
    }
    const handleGuide = (data) => {
        let { type, access_code, password, password_required } = data;
        switch(type){
            case TYPE.BIND : {
                dispatch({ type : BIO.GUIDE_REPORT_ADD, data : {
                    code : access_code,
                    password,
                    passwordRequired : password_required
                }});
                Taro.reLaunch({ url : '/pages/index/index' });
                break;
            }
            case TYPE.SIGNUP : {
                let { user_id } = data;

                dispatch({ type : BIO.GUIDE_SIGN_UP, data : {
                    code : access_code,
                    userId : user_id,
                    password,
                    passwordRequired : password_required
                }});
                Taro.reLaunch({ url : '/pages/login/login' });
                break;
            }
            case TYPE.REPORT : {
                let { report_id } = data;
                dispatch({ type : BIO.GUIDE_REPORT, data : {
                    code : access_code,
                    current : report_id,
                    password,
                    passwordRequired : password_required
                }});
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
    const handleSubmitPassword = () => {
        if(!codePassword.length) Taro.atMessage({
            type : 'error',
            message : '请输入密码或使用凭证'
        })
        else{
            setSubmitLoading(true);
            let { user_id, type, access_code } = guideData;
            Taro.request({
                url : host() + '/ds/check/password',
                method : 'GET',
                data : {
                    id : user_id,
                    type,
                    'access-code' : access_code,
                    password : codePassword
                },
                header : {
                    'Content-Type' : 'application/json; charset=UTF-8'
                }
            })
            .then(res => {
                let { data } = res;
                if(data.code === 'success'){
                    if(data.data) handleGuide({
                        ...guideData,
                        password : codePassword
                    })
                    else Taro.atMessage({
                        type : 'error',
                        message : '请输入正确的密码或凭证',
                        duration : 2500
                    });
                }
                else Taro.atMessage({
                    type : 'error',
                    message : data.info,
                    duration : 2500
                });
                setTimeout(() => setSubmitLoading(false), 2500);
            })
            .catch(e => {
                console.log(e);
                setTimeout(() => setSubmitLoading(false), 2500);
            });
        }
    }

    useDidShow(() => {
        let { q } = getCurrentInstance().router.params;
        // let q = 'http://p.biohuge.cn/q/yuex53vno'; // 送样填表 dev
        // let q = 'http://p.biohuge.cn/q/yhh1j1x4f'; // 分享报告 dev
        // let q = 'http://p.biohuge.cn/q/4xabtvhyzs'; // 下级注册 dev

        // let q = 'http://p.biohuge.cn/q/yuex53vno'; // 送样填表 109
        // let q = 'http://p.biohuge.cn/q/yhh1j1x4f'; // 分享报告 109
        // let q = 'http://p.biohuge.cn/q/cbk0j3b'; // 下级注册 109
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
                    setGuideData(data.data);
                    dispatch({
                        type : BIO.GUIDE_USE
                    })
                    // 统一处理是否需要密码进行后续操作
                    let { password_required } = data.data;
                    if(password_required) setVisible(true);
                    else handleGuide(data.data);
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
            <Modal visible={visible} slave title='请输入密码' onClose={() => setVisible(false)} content={
                <View className='guide-modal'>
                    <View className='info'>本次操作需要输入密码或使用凭证：</View>
                    <View className='input'>
                        <AtInput name='password' type='password' value={codePassword} onChange={(value) => setPassword(value)} placeholder='请输入密码' />
                    </View>
                    <AtButton loading={submitLoading} disabled={submitLoading} className='button' circle type='secondary' onClick={handleSubmitPassword}>下一步</AtButton>
                </View>
            }
            />
        </>
    );
}

export default Guide;