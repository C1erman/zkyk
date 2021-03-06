import React, { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import { useSelector, useDispatch } from 'react-redux';
import { AtInput, AtButton, AtList, AtListItem, AtFloatLayout, AtToast, AtActionSheet, AtActionSheetItem, AtMessage } from 'taro-ui';
import Taro from '@tarojs/taro';
import * as BIO from '../../actions';
import './userinfo.css';
import { host } from '../../config';
import { clone } from '../../utils/BIOObject';
import { BIOValidate } from '../../utils/BIOValidate';

const UserInfo = () => {
    const dispatch = useDispatch()
    let user = useSelector(state => state.user)

    let [btnLoading, setLoading] = useState(false)
    let [userInfo, setUserInfo] = useState({
        username : '',
        avatar : '',
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
    let [toastText, setToast] = useState('')

    let [shareList, setShareList] = useState([])
    let [shareOpen, setShareOpen] = useState(false)


    const shareUrlMaper = (type) => {
        return {
            bind : '/pages/shareBind/shareBind',
            report : '/pages/shareReport/shareReport',
            signup : '/pages/shareSign/shareSign'
        }[type]
    }
    useEffect(() => {
        if(user.token){
            Taro.request({
                url : host() + '/user/personal/info',
                method : 'GET',
                data : {
                    'access-token' : user.token
                },
                header : {
                    'Content-Type' : 'application/json; charset=UTF-8'
                }
            })
            .then(res => {
                let { data } = res;
                if(data.code === 'success'){
                    let { username, email, organization, tel } = data.data;
                    setUserInfo({
                        username,
                        email,
                        tel,
                        org : organization
                    });
                }
            })
            .catch(e => console.log(e));
            // 获得分享类型
            Taro.request({
                url : host() + '/ds/type',
                method : 'GET',
                data : {
                    'access-token' : user.token
                },
                header : {
                    'Content-Type' : 'application/json; charset=UTF-8'
                }
            })
            .then(res => {
                let { data } = res;
                if(data.code === 'success'){
                    // let types = Object.keys(data.data || {}).filter((v) => v != 'report');
                    let types = Object.keys(data.data || {});
                    if(types.length){
                        let arr = types.map((v) => {
                            return {
                                title : data.data[v],
                                url : shareUrlMaper(v)
                            }
                        })
                        setShareList(arr);
                    }
                }
            })
            .catch(e => console.log(e))
        }
    }, [user])

    const handleUpdate = () => {
        let data = [
            {data : userUpadteInfo.tel, type : BIOValidate.TYPE.TEL, empty : true},
            {data : userUpadteInfo.username, type : BIOValidate.TYPE.USERNAME}
        ]
        let validate = BIOValidate.validate(data);
        if(!validate.validated) setToast(validate.info)
        else {
            setLoading(true)
            Taro.request({
                url : host() + '/user/personal?access-token=' + user.token,
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
                let { data } = res;
                if(data.code === 'success'){
                    setToast('信息更新成功')
                    setUserInfo({
                        ...userInfo,
                        ...userUpadteInfo
                    });
                }
                else{
                    setToast(data.info)
                    setUserUpdateInfo(userInfo);
                }
                setLoading(false);
            })
            .catch(error => console.log(error))
        }
    }
    const handleSetValue = (value, name) => {
        let _userInfo = clone(userUpadteInfo);
        _userInfo[name] = value;
        setUserUpdateInfo(_userInfo);
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
    const handleShare = (url) => {
        Taro.navigateTo({ url });
    }
    const getUserInfo = () => {
        Taro.request({
            url : host() + '/user/personal/info',
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

    return (
        <>
            <AtMessage />
            <AtToast isOpened={toastText.length} text={toastText} duration={2000} onClose={() => setToast('')}></AtToast>
            <View className='userinfo-container'>
                <View className='userinfo-avatar'>
                    {user.token ? (<View className='userinfo-avatar-info'>
                        <View className='name'>{userInfo.username}</View><View className='org'>{userInfo.org}</View>
                    </View>) : (<View className='userinfo-avatar-login' onClick={() => Taro.navigateTo({url : '/pages/login/login'})}>请登录</View>)}
                </View>
                <View className='userinfo-list'>
                    <AtList hasBorder={false}>
                        <AtListItem hasBorder={false} title='个人信息' arrow='right'
                          iconInfo={{size : 25, color : '#ff4f76', value : 'message'}}
                          onClick={() => { handleLayoutOpen('userInfo'); getUserInfo(); }}
                          disabled={!user.token}
                        />
                        <AtListItem hasBorder={false} title='分享' arrow='right'
                          iconInfo={{size : 25, color : '#ff4f76', value : 'share-2'}}
                          onClick={() => setShareOpen(true)}
                          disabled={!user.token || !shareList.length}
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
                            <AtButton circle type='primary' onClick={handleLogout}>登出</AtButton>
                        </View>
                    ) : (
                        <View className='userinfo-login'>
                            <AtButton circle type='secondary' onClick={() => Taro.navigateTo({url : '/pages/login/login'})}>去登录</AtButton>
                        </View>
                    )
                }
                <AtFloatLayout title='基本信息' isOpened={layoutOpen.userInfo} onClose={() => handleLayoutClose('userInfo')}>
                    <AtInput name='username' title='用户名' value={userUpadteInfo.username} onChange={(value) => handleSetValue(value, 'username')} />
                    <AtInput name='tel' title='电话号码' type='phone' value={userUpadteInfo.tel} onChange={(value) => handleSetValue(value, 'tel')} />
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
                <AtActionSheet
                  isOpened={shareOpen}
                  cancelText='取消'
                  title='请选择操作'
                  onClose={() => setShareOpen(false)}
                  onCancel={() => setShareOpen(false)}
                >
                    {
                        shareList.map((v, i) => (
                            <AtActionSheetItem key={i} onClick={() => handleShare(v.url)}>{'分享' + v.title}</AtActionSheetItem>
                        ))
                    }
                </AtActionSheet>
            </View>
        </>
    );
}

export default UserInfo;