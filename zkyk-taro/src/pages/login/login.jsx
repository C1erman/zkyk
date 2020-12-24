import React, { useState, useEffect } from 'react'
import { AtButton, AtToast, AtMessage } from 'taro-ui'
import { useDispatch, useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { host } from '../../config'
import './login.css';
import * as BIO from '../../actions'


const Login = () => {
    const dispatch = useDispatch()
    
    const guide = useSelector(state => state.guide)

    let [btnLoading, setLoading] = useState(false)
    let [toastText, setToastText] = useState('')

    let [userInvitation, setUserInvitation] = useState('')

    const handleGuideUserSignup = (username, invitation) => {
        Taro.request({
            url : host() + '/user/wx/login',
            method : 'POST',
            data : { username, invitation },
            header : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let {data} = res;
            if(data.code === 'success'){
                Taro.atMessage({
                    type : 'success',
                    message : '受邀注册成功，已登录',
                    duration : 2500
                })
                dispatch({
                    type : BIO.LOGIN_SUCCESS,
                    data : data.data
                });
                dispatch({ type : BIO.GUIDE_SIGN_UP_SUCCESS });
                setTimeout(() => {
                    setLoading(false);
                    Taro.reLaunch({
                        url : '/pages/userinfo/userinfo'
                    });
                }, 2500)
            }
            else Taro.atMessage({
                type : 'error',
                message : data.info,
                duration : 2500
            })
        })
        .catch(e => console.log(e))
    }
    const handleGetUserInfo = (e) => {
        if(e.detail.userInfo){
            setLoading(true);
            Taro.login().then(res => {
                let code = res.code;
                Taro.request({
                    url : host() + '/user/wx/signup',
                    method : 'POST',
                    data : { code },
                    header : {
                        'Content-Type' : 'application/json; charset=UTF-8'
                    }
                })
                .then(re => {
                    let {data} = re;
                    if(data.code === 'success'){
                        if(data.data.token){
                            // 正常登录
                            dispatch({
                                type : BIO.LOGIN_SUCCESS,
                                data : data.data
                            })
                            Taro.atMessage({
                                type : 'success',
                                message : '登录成功',
                                duration : 2500
                            })
                            setTimeout(() => {
                                setLoading(false);
                                Taro.navigateBack();
                            }, 2500)
                        }
                        else{
                            // 补充个人信息
                            if(userInvitation) handleGuideUserSignup(data.data.username, userInvitation);
                            else{
                                dispatch({
                                    type : BIO.LOGIN_BY_WECHAT,
                                    data : data.data.username
                                });
                                setLoading(false);
                                Taro.navigateTo({
                                    url : '/pages/infoadd/infoadd'
                                })
                            }
                        }
                    }
                })
                .catch(error => console.log(error));
            })
        }
        else Taro.atMessage({
            type : 'warning',
            message : '授权失败',
            duration : 2500
        })
    }
    useEffect(() => {
        let { userId, code, password } = guide.signup;
        if(userId){
            Taro.request({
                url : host() + '/ds/parse/signup',
                method : 'POST',
                data : {
                    id : userId,
                    password,
                    'access-code' : code
                },
                header : {
                    'Content-Type' : 'application/json; charset=UTF-8'
                }
            })
            .then(res => {
                let { data } = res;
                if(data.code === 'success'){
                    let { invitation } = data.data;
                    setUserInvitation(invitation);
                }
                else Taro.atMessage({
                    type : 'error',
                    message : data.info,
                    duration : 2500
                })
            })
            .catch(e => console.log(e));
        }
    }, [guide.signup])

    return (
        <>
            <AtMessage />
            <View className='login-container'>
                <View className='login-guide'>
                    { guide.signup?.code ? '您正通过扫描二维码方式注册，请点击微信账号快捷登录按钮完成注册及登录。' : '' }
                </View>
                <AtButton className='login-btn-wechat' type='primary' circle loading={btnLoading} disabled={btnLoading}
                  openType='getUserInfo' onGetUserInfo={(e) => handleGetUserInfo(e)}
                >微信账号快捷登录</AtButton>
                <AtButton className='login-btn-cancle' type='primary' circle loading={btnLoading} disabled={btnLoading}
                  onClick={() => Taro.navigateBack()}
                >暂不登录</AtButton>
                <AtToast duration={2500} isOpened={toastText.length} text={toastText} onClose={() => setToastText('')} />
            </View>
        </>
    );
}

export default Login;