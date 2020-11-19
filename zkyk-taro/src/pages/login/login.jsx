import React, { useState } from 'react'
import { AtButton, AtInput, AtToast } from 'taro-ui'
import { useDispatch } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { host } from '../../config'
import './login.css';
import * as BIO from '../../actions'



const Login = () => {
    const dispatch = useDispatch()

    let [acc, setAcc] = useState('')
    let [pass, setPass] = useState('')
    let [btnLoading, setLoading] = useState(false)
    let [error, setError] = useState('')
    let [toastText, setToastText] = useState('')

    const handleLogin = () => {
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
                setLoading(false)
                setToastText('登陆成功，即将跳转')
                dispatch({
                    type : BIO.LOGIN_SUCCESS,
                    data : data.data
                })
                Taro.navigateBack();
            }
            else{
                setError(data.info);
                setTimeout(() => {
                    setLoading(false)
                    setError('')  
                }, 2500)
            }
        })
        .catch(err => {
            console.log(err)
            setLoading(false)
        })
    }

    return (
        <View className='login-container'>
            <AtInput name='account' title='账号' type='text' placeholder='请输入账号' value={acc} onChange={(value) => setAcc(value)} />
            <AtInput name='password' title='密码' type='password' placeholder='请输入密码' value={pass} onChange={(value) => setPass(value)} />
            <AtButton type='primary' circle customStyle={{marginTop : '2rem'}} onClick={handleLogin} loading={btnLoading} disabled={btnLoading}>登录</AtButton>
            {error ? (<View className='login-input-error'>{error}</View>) : null}
            <AtToast isOpened={toastText.length} text={toastText} onClose={() => setToastText('')} />
        </View>
    );
}

export default Login;