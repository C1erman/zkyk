import React, { useState } from 'react'
import { AtButton, AtInput, AtToast, AtMessage } from 'taro-ui'
import { useDispatch } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
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

    return (
        <View className='login-container'>
            <AtInput name='account' title='账号' type='text' placeholder='请输入账号' value={acc} onChange={(value) => setAcc(value)} />
            <AtInput name='password' title='密码' type='password' placeholder='请输入密码' value={pass} onChange={(value) => setPass(value)} />
            <AtButton type='primary' circle customStyle={{marginTop : '2rem'}} onClick={handleLogin} loading={btnLoading} disabled={btnLoading}>登录</AtButton>
            <AtToast duration={2500} isOpened={toastText.length} text={toastText} onClose={() => setToastText('')} />
            <AtMessage />
        </View>
    );
}

export default Login;