import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useSelector, useDispatch } from 'react-redux';
import { AtInput, AtButton, AtMessage } from 'taro-ui';
import { clone, checkEmpty } from '../../utils/BIOObject';
import { host } from '../../config';
import * as BIO from '../../actions';
import './infoadd.css';

const InfoAdd = () => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    let [userData, setUserData] = useState({
        invitation : ''
    })
    let [submitLoading, setLoading] = useState(false)

    const handleSetValue = (value, dataName) => {
        let data = clone(userData);
        data[dataName] = value;
        setUserData(data);
    }
    const handleSubmit = () => {
        if(checkEmpty(userData)) Taro.atMessage({
            type : 'error',
            message : '请确认信息是否填写完整',
            duration : 2500
        })
        else{
            setLoading(true)
            Taro.request({
                url : host + '/user/wx/login',
                method : 'POST',
                data : {
                    username : user.username,
                    invitation : userData.invitation
                },
                header : {
                    'Content-Type' : 'application/json; charset=UTF-8'
                }
            })
            .then(res => {
                let {data} = res;
                if(data.code === 'success') {
                    dispatch({
                        type : BIO.LOGIN_SUCCESS,
                        data : data.data
                    })
                }
                else Taro.atMessage({
                    type : 'error',
                    message : data.info,
                    duration : 2500
                })
                setLoading(false)
            })
            .catch(e => console.log(e))
        }
    }

    return (
        <>
            <AtMessage />
            
            <View className='infoadd-container'>
                <View className='infoadd-title'><Text className='text'>个人信息补充</Text></View>
                <View className='infoadd-info'>
                    请补充填写下述必要信息以完成登录：
                </View>
                <AtInput name='invitation' placeholder='请输入企业邀请码'
                  title='邀请码' type='number' required value={userData.invitation}
                  onChange={(value) => handleSetValue(value, 'invitation')}
                />
                <AtButton className='infoadd-button' type='secondary' circle disabled={submitLoading} loading={submitLoading} onClick={handleSubmit}>完成</AtButton>
            </View>
        </>
    );
}

export default InfoAdd;