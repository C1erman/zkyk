import React, { useState } from 'react'
import { AtButton, AtInput, AtToast, AtMessage } from 'taro-ui'
import { useDispatch } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { host } from '../../config'
import './login.css';
import * as BIO from '../../actions'
import { checkEmpty } from '../../utils/BIOObject'



const Login = () => {
    const dispatch = useDispatch()

    let [btnLoading, setLoading] = useState(false)
    let [toastText, setToastText] = useState('')

    const handleGetUserInfo = (e) => {
        if(e.detail.userInfo){
            setLoading(true)
            Taro.login().then(res => {
                let code = res.code;
                Taro.request({
                    url : host + '/user/wx/signup',
                    method : 'POST',
                    data : { code : code },
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
                                setLoading(false)
                                Taro.navigateBack();
                            }, 2500)
                        }
                        else{
                            // 补充个人信息
                            dispatch({
                                type : BIO.LOGIN_BY_WECHAT,
                                data : data.data.username
                            })
                            Taro.navigateTo({
                                url : '/pages/infoadd/infoadd'
                            })
                            setLoading(false)
                        }
                    }
                })
                .catch(error => console.log(error))
            })
        }
        else Taro.atMessage({
            type : 'warning',
            message : '授权失败',
            duration : 2500
        })
    }

    return (
        <View className='login-container'>
            <AtButton className='login-btn-wechat' type='primary' circle loading={btnLoading} disabled={btnLoading}
              openType='getUserInfo' onGetUserInfo={(e) => handleGetUserInfo(e)}
            >微信账号快捷登录</AtButton>
            <AtButton className='login-btn-cancle' type='primary' circle loading={btnLoading} disabled={btnLoading}
              onClick={() => Taro.navigateBack()}
            >暂不登录</AtButton>
            <AtToast duration={2500} isOpened={toastText.length} text={toastText} onClose={() => setToastText('')} />
            <AtMessage />
        </View>
    );
}

export default Login;