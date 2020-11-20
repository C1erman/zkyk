import React, { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import { useSelector } from 'react-redux';
import { AtInput, AtButton, AtMessage } from 'taro-ui';
import Taro from '@tarojs/taro';
import './userinfo.css';
import { host } from '../../config';
import { checkEmpty } from '../../utils/BIOObject';

const UserInfo = () => {
    let user = useSelector(state => state.user)

    let [btnLoading, setLoading] = useState(false)
    let [userInfo, setUserInfo] = useState({
        username : '',
        emial : '',
        tel : '',
        org : ''
    })
    useEffect(() => {
        Taro.request({
            url : host + '/user/personal/info',
            method : 'GET',
            data : {
                'access-token' : user.token
            }
        })
        .then(res => {
            let { data } = res;
            if(data.code === 'success'){
                let { username, email, organization, tel} = data.data;
                setUserInfo({
                    username,
                    email,
                    tel,
                    org : organization
                });
            }
        })
    }, [])

    const handleUpdate = () => {
        // check empty
        Taro.atMessage
        if(checkEmpty(userInfo)) Taro.atMessage({
            type : 'error',
            message : '填写格式不合规范',
            duration : 2500
        })
        else {
            setLoading(true)
            Taro.request({
                url : host + '/user/personal?access-token=' + user.token,
                method : 'POST',
                data : {
                    username : userInfo.username,
                    tel : userInfo.tel
                },
                header : {
                    'Content-Type' : 'application/json; charset=UTF-8'
                }
            })
            .then(res => {
                let {data} = res;
                if(data.code === 'success') Taro.atMessage({
                    type : 'success',
                    message : '信息更新成功'
                })
                else Taro.atMessage({
                    type : 'error',
                    message : data.info,
                    duration : 2500
                })
                setLoading(false)
            })
            .catch(error => console.log(error))
        }
    }
    const handleSetValue = (value, name) => {
        switch(name){
            case 'username' : {
                setUserInfo({
                    ...userInfo,
                    username : value
                })
                break;
            }
            case 'tel' : {
                setUserInfo({
                    ...userInfo,
                    tel : value
                })
                break;
            }
        }
    }
    return (
        <View className='userinfo-container'>
            <AtMessage />
            <View className='userinfo-title'><Text className='text'>基本信息</Text></View>
            <AtInput name='username' title='用户名' value={userInfo.username} onChange={(value) => handleSetValue(value, 'username')} />
            <AtInput name='tel' title='电话号码' value={userInfo.tel} />
            <AtInput name='org' title='所属机构' value={userInfo.org} disabled />
            <View className='userinfo-btn-container'>
                <AtButton customStyle={{marginTop : '2rem'}} circle type='secondary'
                  disabled={btnLoading} loading={btnLoading} onClick={handleUpdate}
                >更新</AtButton>
            </View>
            <View className='userinfo-set'>
                <View className='userinfo-title'><Text className='text'>设置</Text></View>
                <View className></View>
            </View>
        </View>
    );
}

export default UserInfo;