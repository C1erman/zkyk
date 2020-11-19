import React, { useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import { useSelector } from 'react-redux';
import { AtInput, AtButton } from 'taro-ui';
import Taro from '@tarojs/taro';
import './userinfo.css';
import { host } from '../../config';

const UserInfo = () => {
    let user = useSelector(state => state.user)
    useEffect(() => {
        Taro.request({
            url : host + '/user/personal/info',
            method : 'GET',
            
        })
    }, [])
    // useEffect(() => {
    //     console.log(user)
    //     if(!user.token) Taro.navigateTo({
    //         url : '/pages/login/login'
    //     })
    // }, [])
    return (
        <View className='userinfo-container'>
            <AtInput name='username' title='用户名'  />
            <AtInput name='tel' title='电话号码' />
            <AtInput name='org' title='所属机构' />
            <AtButton customStyle={{marginTop : '1.5rem'}}>更新</AtButton>
            <View className='userinfo-set'>
                <Text>设置个人信息</Text>
            </View>
        </View>
    );
}

export default UserInfo;