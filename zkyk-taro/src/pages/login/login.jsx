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

    let [acc, setAcc] = useState('')
    let [pass, setPass] = useState('')
    let [btnLoading, setLoading] = useState(false)
    let [toastText, setToastText] = useState('')

    const handleLogin = () => {
        if(checkEmpty({
            username : acc,
            password : pass
        })) Taro.atMessage({
            type : 'error',
            message : '填写格式不规范',
            duration : 2500
        })
        else{
            setLoading(true)
            Taro.request({
                url : host + '/user/login',
                method : 'POST',
                data : {
                    username : acc,
                    password : pass
                },
                header : {
                    'Content-Type' : 'application/json; charset=UTF-8'
                }
            }).then(res => {
                let {data} = res;
                if(data.code === 'success'){
                    Taro.atMessage({
                        message : '登陆成功',
                        type : 'success',
                        duration : 2500
                    })
                    setTimeout(() => {
                        setLoading(false)
                        dispatch({
                            type : BIO.LOGIN_SUCCESS,
                            data : data.data
                        })
                        Taro.navigateBack();
                    }, 2500)
                }
                else{
                    Taro.atMessage({
                        message : data.info,
                        type : 'error',
                        duration : 2500
                    })
                    setTimeout(() => setLoading(false), 2500)
                }
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
        }
    }
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
                                message : '登陆成功',
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
            <View className='login-title'><Text className='text'>请登录</Text></View>
            <View className='login-info'>

            </View>
            {/* <AtInput name='account' title='账号' type='text' placeholder='请输入账号' value={acc} onChange={(value) => setAcc(value)} />
            <AtInput name='password' title='密码' type='password' placeholder='请输入密码' value={pass} onChange={(value) => setPass(value)} />
            <AtButton className='login-btn' type='primary' circle onClick={handleLogin} loading={btnLoading} disabled={btnLoading}>登录</AtButton> */}
            <AtButton className='login-btn-wechat' type='primary' circle loading={btnLoading} disabled={btnLoading}
              openType='getUserInfo' onGetUserInfo={(e) => handleGetUserInfo(e)}
            >微信账号快捷登录</AtButton>
            <AtButton className='login-btn-cancle' type='primary' circle onClick={() => Taro.navigateBack()}>暂不登录</AtButton>
            <AtToast duration={2500} isOpened={toastText.length} text={toastText} onClose={() => setToastText('')} />
            <AtMessage />
        </View>
    );
}

export default Login;