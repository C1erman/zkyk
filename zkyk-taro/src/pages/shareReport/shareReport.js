import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { AtMessage, AtButton, AtFloatLayout, AtRadio } from 'taro-ui';
import { useSelector } from 'react-redux';
import Pager from '../../component/Pager';
import './shareReport.css';
import { host } from '../../config';

const ShareReport = () => {
    const user = useSelector(state => state.user)

    let pageSize = 5; // 每页栏目显示数量
    
    let [shareList, setShareList] = useState([])
    let [listCurrent, setListCurrentPage] = useState(1)
    let [listPagination, setListPagination] = useState({ pageSize : 1 })
    let [floatGenOpen, setFloatGenOpen] = useState(false)
    let [floatShowOpen, setFloatShowOpen] = useState(false)

    let [genRadioVal, setGenRadio] = useState('month')

    let [shareListUpdate, setShareListUpdate] = useState('')
    let [showContent, setShowContent] = useState({
        src : '',
        expire : '',
        password : ''
    })

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
            url : host() + '/ds/report?access-token=' + user.token,
            method : 'POST',
            data : {
                expire : mapExpire(genRadioVal)
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
                setShareListUpdate(code);
                setFloatGenOpen(false);
                setFloatShowOpen(true);
            }
            else if(data.code === 'error') Taro.atMessage({
                type : 'error',
                message : data.info,
                duration : 2500
            })
        })
        .catch(e => console.log(e))
    }
    const getCurrentList = (currentPage) => {
        setListCurrentPage(currentPage);
        Taro.request({
            url : host() + '/ds/list',
            method : 'GET',
            data : {
                'access-token' : user.token,
                type : 'report',
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
                setListPagination(data.data.pagination);
            }
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
        setFloatShowOpen(true);
    }

    useEffect(() => {
        Taro.request({
            url : host() + '/ds/list',
            method : 'GET',
            data : {
                'access-token' : user.token,
                type : 'report',
                pageNum : listCurrent,
                pageSize
            },
            header : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let {data} = res;
            if(data.code === 'success'){
                setShareList(data.data?.list || []);
                setListPagination(data.data?.pagination || { pageSize : 1 });
            }
        })
        .catch(e => console.log(e))
    }, [user, shareListUpdate])

    return (
        <>
            <AtMessage />
            <View className='shareReport-container'>
                <View className='shareReport-title'><Text className='text'>过往分享记录</Text></View>
                {
                    shareList.length ? (
                        <View className='shareReport-list-container'>
                            <View className='shareReport-list'>
                                <View className='table'>
                                    <View className='thead'>
                                        <View className='tr'>
                                            <View className='td'>链接</View>
                                            <View className='td'>过期时间</View>
                                            <View className='td'>二维码</View>
                                        </View>
                                    </View>
                                    <view className='tbody'>
                                    {
                                        shareList.map((v, i) => (
                                            <View className='tr' key={i}>
                                                <Text className='td link' selectable>{v.data}</Text>
                                                <Text className='td'>{v.expire_at}</Text>
                                                <View className='td'><AtButton type='secondary' size='small' circle onClick={() => handleShowQrCode(v)}>查看</AtButton></View>
                                            </View>
                                        ))
                                    }
                                    </view>
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
                        <View className='shareReport-empty shareReport-list-container'>未查询到分享记录。</View>
                    )
                }
                <View className='shareReport-title'><Text className='text'>创建分享报告二维码</Text></View>
                <View className='shareReport-generate'>
                    <AtButton className='button' type='primary' circle onClick={() => setFloatGenOpen(true)}>创建</AtButton>
                </View>
                <AtFloatLayout isOpened={floatGenOpen} title='选择过期时间' onClose={() => setFloatGenOpen(false)}>
                    <View className='shareReport-gen'>
                        <AtRadio className='radio'
                          options={[
                                {label : '一天', value : 'day'},
                                {label : '一周', value : 'week'},
                                {label : '一月', value : 'month'},
                                {label : '永久有效', value : 'forever'}
                            ]}
                          value={genRadioVal}
                          onClick={(value) => setGenRadio(value)}
                        />
                        <AtButton type='secondary' circle onClick={handleGenerate}>生成</AtButton>
                    </View>
                </AtFloatLayout>
                <AtFloatLayout isOpened={floatShowOpen} title='向其他人分享' onClose={() => setFloatShowOpen(false)}>
                    <View className='shareReport-show-code'>
                        <Image className='img' src={showContent.src} showMenuByLongpress />
                        <View className='time'>过期时间为：<Text className='time-detail'>{showContent.expire}</Text></View>
                        { showContent.password ? (<View className='pass'>使用二维码时请对方输入分享码：{showContent.password}</View>) : null }
                    </View>
                </AtFloatLayout>
            </View>
        </>
    );
}

export default ShareReport;