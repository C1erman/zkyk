import React, { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import { useSelector, useDispatch } from 'react-redux';
import { AtInput, AtButton, AtMessage, AtList, AtListItem, AtCard, AtModal, AtFloatLayout } from 'taro-ui';
import Taro, { useDidShow } from '@tarojs/taro';
import * as BIO from '../../actions';
import './userinfo.css';
import { host } from '../../config';
import { checkEmpty, clone } from '../../utils/BIOObject';

const UserInfo = () => {
    const dispatch = useDispatch()
    let user = useSelector(state => state.user)

    let [btnLoading, setLoading] = useState(false)
    let [userInfo, setUserInfo] = useState({
        username : '',
        emial : '',
        tel : '',
        org : ''
    })
    let [userUpadteInfo, setUserUpdateInfo] = useState({
        username : '',
        tel : '',
        org : ''
    })
    let [layoutOpen, setLayoutOpen] = useState({
        userInfo : false,
        password : false,
        email : false
    })

    useEffect(() => {
        if(user.token){
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
                    setUserUpdateInfo({
                        username,
                        tel,
                        org : organization
                    })
                }
            })
            .catch(e => console.log(e))
        }
    }, [user])

    const handleUpdate = () => {
        // check empty
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
                    username : userUpadteInfo.username,
                    tel : userUpadteInfo.tel
                },
                header : {
                    'Content-Type' : 'application/json; charset=UTF-8'
                }
            })
            .then(res => {
                let {data} = res;
                if(data.code === 'success'){
                    setUserInfo({
                        ...userInfo,
                        ...userUpadteInfo
                    })
                    Taro.atMessage({
                        type : 'success',
                        message : '信息更新成功'
                    })
                }
                else{
                    setUserUpdateInfo(userInfo);
                    Taro.atMessage({
                        type : 'error',
                        message : data.info,
                        duration : 2500
                    })
                }
                setLoading(false)
            })
            .catch(error => console.log(error))
        }
    }
    const handleSetValue = (value, name) => {
        switch(name){
            case 'username' : {
                setUserUpdateInfo({
                    ...userUpadteInfo,
                    username : value
                })
                break;
            }
            case 'tel' : {
                setUserUpdateInfo({
                    ...userUpadteInfo,
                    tel : value
                })
                break;
            }
        }
    }
    const handleLayoutOpen = (type) => {
        let open = clone(layoutOpen);
        open[type] = true;
        setLayoutOpen(open);
    }
    const handleLayoutClose = (type) => {
        let open = clone(layoutOpen);
        open[type] = false;
        setLayoutOpen(open);
    }
    const handleLogout = () => {
        dispatch({
            type : BIO.LOGOUT_SUCCESS
        })
    }

    return (
        <View className='userinfo-container'>
            <AtMessage />
            <View className='userinfo-avatar'>
                {user.token ? (<View className='userinfo-avatar-info'>
                    <View className='name'>{userInfo.username}</View><View className='org'>{userInfo.org}</View>
                </View>) : (<View className='userinfo-avatar-login' onClick={() => Taro.navigateTo({url : '/pages/login/login'})}>请登录</View>)}
            </View>
            <View className='userinfo-list'>
                <AtList hasBorder={false}>
                    <AtListItem hasBorder={false} title='个人信息' arrow='right'
                      iconInfo={{size : 25, color : '#ff4f76', value : 'message'}}
                      onClick={user.token ? () => handleLayoutOpen('userInfo') : null}
                      disabled={!user.token}
                    />
                    <AtListItem hasBorder={false} title='修改密码' arrow='right'
                      iconInfo={{size : 25, color : '#ff4f76', value : 'lock'}}
                      onClick={user.token ? () => handleLayoutOpen('password') : null}
                      disabled
                    />
                    <AtListItem hasBorder={false} title='修改邮箱' arrow='right'
                      iconInfo={{size : 25, color : '#ff4f76', value : 'mail'}}
                      onClick={user.token ? () => handleLayoutOpen('email') : null}
                      disabled
                    />
                </AtList>
            </View>
            {
                user.token ? (
                    <View className='userinfo-logout'>
                        <AtButton full type='secondary' onClick={handleLogout}>登出</AtButton>
                    </View>
                ) : null
            }
            <AtFloatLayout title='基本信息' isOpened={layoutOpen.userInfo} onClose={() => handleLayoutClose('userInfo')}>
                <AtInput name='username' title='用户名' value={userUpadteInfo.username} onChange={(value) => handleSetValue(value, 'username')} />
                <AtInput name='tel' title='电话号码' value={userUpadteInfo.tel} onChange={(value) => handleSetValue(value, 'tel')} />
                <AtInput name='org' title='所属机构' value={userUpadteInfo.org} disabled />
                <View className='userinfo-btn-container'>
                    <AtButton customStyle={{marginTop : '2rem'}} circle type='secondary'
                      disabled={btnLoading} loading={btnLoading} onClick={handleUpdate}
                    >更新</AtButton>
                </View>
            </AtFloatLayout>
            <AtFloatLayout title='基本信息' isOpened={false} onClose={() => handleLayoutClose('userInfo')}>
                <View className='userinfo-setting'>
                    我们将向您的邮箱<Text className='email'>{userInfo.emial}</Text>发送一封邮件用以重置密码。请确认邮箱地址后选择发送。
                </View>
                <View className='userinfo-btn-container'>
                    <AtButton customStyle={{marginTop : '2rem'}} circle type='secondary'
                      disabled={btnLoading} loading={btnLoading} onClick={handleUpdate}
                    >发送</AtButton>
                </View>
            </AtFloatLayout>
        </View>
    );
}

export default UserInfo;