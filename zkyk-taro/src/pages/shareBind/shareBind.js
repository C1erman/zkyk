import React, { useState, useEffect } from 'react';
import { View, Image, Text } from '@tarojs/components';
import { useSelector } from 'react-redux';
import Taro from '@tarojs/taro';
import { AtButton, AtRadio, AtFloatLayout, AtMessage } from 'taro-ui';

import './shareBind.css';
import { host } from '../../config';
import Pager from '../../component/Pager';

const ShareBind = () => {
    const user = useSelector(state => state.user);

    let pageSize = 5; // 每页显示栏目数量

    let [listUpdate, setListUpdate] = useState('')
    let [radioValue, setRadioValue] = useState('month')
    let [shareList, setShareList] = useState([])
    let [genFloatOpen, setGenFloatOpen] = useState(false)

    let [listCurrent, setCurrent] = useState(1)
    let [listPagination, setPagination] = useState({
        pageSize : 1
    })

    let [showFloatOpen, setShowFloatOpen] = useState(false)
    let [showContent, setShowContent] = useState({
        src : '',
        expire : '',
        password : '',
    })
    
    useEffect(() => {
        Taro.request({
            url : host() + '/ds/list',
            method : 'GET',
            data : {
                'access-token' : user.token,
                type : 'bind',
                pageNum : listCurrent,
                pageSize : pageSize
            },
            header : {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let { data } = res;
            if(data.code === 'success'){
                setShareList(data.data?.list || []);
                setPagination(data.data?.pagination || { pageSize : 1 });
            }
        })
        .catch(e => console.log(e))
    }, [user, listUpdate])

    const mapExpire = (type) => {
        return {
            day : 1,
            week : 7,
            month : 30,
            forever : 0
        }[type]
    }
    const handleGenerate = () => {
        Taro.request({
            url : host() + '/ds/bind?access-token=' + user.token,
            method : 'POST',
            data : {
                expire : mapExpire(radioValue)
            },
            header : {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let { data } = res;
            if(data.code === 'success'){
                let { expire_at, code, password } = data.data;
                // 设置查看内容
                setShowContent({
                    src : host() + '/ds/q/' + code,
                    expire : expire_at,
                    password
                });
                // 驱使列表更新
                setListUpdate(code);
                setGenFloatOpen(false);
                setShowFloatOpen(true);
            }
            else if(data.code === 'error') Taro.atMessage({
                type : 'error',
                message : data.info,
                duration : 2500
            })
        })
        .catch(e => console.log(e))
    }
    const handleShowQrCode = (data) => {
        let { expire_at, code, password } = data;
        setShowContent({
            src : host() + '/ds/q/' + code,
            expire : expire_at,
            password
        });
        setShowFloatOpen(true);
    }
    const getCurrentList = (currentPage) => {
        setCurrent(currentPage);
        Taro.request({
            url : host() + '/ds/list',
            method : 'GET',
            data : {
                'access-token' : user.token,
                type : 'bind',
                pageNum : currentPage,
                pageSize : pageSize
            },
            header : {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let { data } = res;
            if(data.code === 'success'){
                setShareList(data.data.list);
                setPagination(data.data.pagination);
            }
        })
        .catch(e => console.log(e))
    }

    return (
        <>
            <AtMessage />
            <View className='shareBind-container'>
                <View className='shareBind-title'><Text className='text'>过往分享记录</Text></View>
                { shareList.length ? (
                <View className='shareBind-list-container'>
                    <View className='shareBind-list'>
                        <View className='table'>
                            <View className='thead'>
                                <View className='tr'>
                                    <View className='td'>链接</View>
                                    <View className='td'>过期时间</View>
                                    <View className='td'>二维码</View>
                                </View>
                            </View>
                            <View className='tbody'>
                                {
                                    shareList.map((v, i) => (
                                        <View className='tr' key={i}>
                                            <Text className='td link' selectable>{v.data}</Text>
                                            <Text className='td'>{v.expire_at}</Text>
                                            <View className='td'><AtButton type='secondary' size='small' circle onClick={() => handleShowQrCode(v)}>查看</AtButton></View>
                                        </View>
                                    ))
                                }
                            </View>
                        </View>
                    </View>
                    <Pager
                      current={listCurrent} 
                      total={listPagination.pageSize} 
                      prevClick={(currentPage) => getCurrentList(currentPage)}
                      nextClick={(currentPage) => getCurrentList(currentPage)}
                    />
                </View>
                ) : (
                    <View className='shareBind-empty shareBind-list-container'>未查询到分享记录。</View>
                )}
                <View className='shareBind-title'><Text className='text'>创建分享绑定二维码</Text></View>
                <View className='shareBind-generate'>
                    <AtButton className='button' type='primary' circle onClick={() => setGenFloatOpen(true)}>创建</AtButton>
                </View>
                <AtFloatLayout isOpened={genFloatOpen} title='选择过期时间' onClose={() => setGenFloatOpen(false)}>
                    <View className='shareBind-gen'>
                        <AtRadio className='radio'
                          options={[
                                {label : '一天', value : 'day'},
                                {label : '一周', value : 'week'},
                                {label : '一月', value : 'month'},
                                {label : '永久有效', value : 'forever'}
                            ]}
                          value={radioValue}
                          onClick={(value) => setRadioValue(value)}
                        />
                        <AtButton type='secondary' circle onClick={handleGenerate}>生成</AtButton>
                    </View>
                </AtFloatLayout>
                <AtFloatLayout isOpened={showFloatOpen} title='向受测人分享' onClose={() => setShowFloatOpen(false)}>
                    <View className='shareBind-show-code'>
                        <Image className='img' src={showContent.src} showMenuByLongpress />
                        <View className='time'>过期时间为：{showContent.expire}</View>
                        { showContent.password ? (<View className='pass'>使用二维码时请对方输入分享码：<Text selectable>{showContent.password}</Text></View>) : null }
                    </View>
                </AtFloatLayout>
            </View>
        </>
    );

}

export default ShareBind;