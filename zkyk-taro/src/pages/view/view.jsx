import React, { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { useSelector } from 'react-redux';
import Taro from '@tarojs/taro'
import { AtGrid, AtButton, AtMessage, AtIcon, AtFloatLayout, AtRadio} from 'taro-ui';

import './view.css'
import { host, imgSrc } from '../../config';

const ReportView = () => {

    const user = useSelector(state => state.user)
    const report = useSelector(state => state.report)
    const guide = useSelector(state => state.guide)

    let [downloadLoading, setDownloadLoading] = useState(false)

    let [reportInfo, setReportInfo] = useState({
        name : '',
        barcode : '',
        version : '1'
    })

    let [floatGenOpen, setFloatGenOpen] = useState(false)
    let [floatShareOpen, setFloatShareOpen] = useState(false)
    let [genRadioVal, setGenRadioVal] = useState('month')
    let [shareContent, setShareContent] = useState({
        expire : '',
        src : '',
        password : ''
    })
    
    const handleItemClick = (name) => {
        let module = {
            '整体情况' : '/pages/moduleA/moduleA',
            '菌群状态分析' : '/pages/moduleB/moduleB',
            '具体检测结果' : '/pages/moduleC/moduleC',
            '健康评估' : '/pages/moduleD/moduleD',
            '菌群改善建议' : '/pages/moduleE/moduleE',
            '菌群知识科普' : '/pages/moduleF/moduleF'
        }
        Taro.navigateTo({
            url : module[name]
        })
    }
    const handleDownLoad = () => {
        setDownloadLoading(true);
        Taro.request({
            url : host() + '/admin/wx/pdf?access-token=' + user.token,
            method : 'POST',
            data : {
                id : report.current
            },
            header : {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let {data} = res;
            if(data.code === 'success'){
                Taro.downloadFile({
                    url : data.data.url,
                    success : (response) => {
                        setDownloadLoading(false);
                        let {tempFilePath} = response;
                        let fileName = data.data.filename;
                        Taro.saveFile({
                            tempFilePath : tempFilePath,
                            filePath : wx.env.USER_DATA_PATH + '/' + fileName + '.pdf',
                            success : (xxx) => {
                                Taro.openDocument({
                                    filePath : wx.env.USER_DATA_PATH + '/' + fileName + '.pdf',
                                    fileType : 'pdf',
                                    showMenu : true,
                                    success : (xxx) => {
                                        Taro.atMessage({
                                            type : 'success',
                                            message : '报告生成成功',
                                            duration : 2500
                                        });
                                        console.log('报告下载成功')
                                    }
                                })
                            }
                        });
                    }
                });
            }
            else{
                Taro.atMessage({
                    type : 'error',
                    message : data.info,
                    duration : 2500
                })
                setTimeout(() => setDownloadLoading(false), 2500)
            }
        })
        .catch(e => console.log(e))
    }
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
                report_id : report.current,
                expire : mapExpire(genRadioVal)
            },
            header : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let { data } = res;
            if(data.code === 'success'){
                let { expire_at, code, password } = data.data;
                // 设置查看内容
                setShareContent({
                    src : host() + '/ds/q/' + code,
                    expire : expire_at,
                    password
                });
                setFloatGenOpen(false);
                setFloatShareOpen(true);
            }
        })
    }

    useEffect(() => {
        let { code, password } = guide.report;
        Taro.request({
            url : host() + '/sample/codename',
            method : 'GET',
            data : {
                'access-token' : user.token,
                'access-code' : code,
                id : report.current,
                password
            },
            header : {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let {data} = res;
            if(data.code === 'success') setReportInfo(data.data);
            else Taro.atMessage({
                type : 'error',
                message : data.info,
                duration : 2500
            });
        })
        .catch(e => console.log(e));
    }, [report, user, guide])

    return (
        <>
            <AtMessage />
            <View className='view-container'>
                <View className='view-info'>
                    <View className='name'><View className='at-icon at-icon-user'>{reportInfo.name}</View></View>
                    <View className='code'><View className='at-icon at-icon-bookmark'>{reportInfo.barcode}</View></View>
                    <View className='version'><View className='at-icon at-icon-tag'>{'V' + reportInfo.version}</View></View>
                </View>
                <View className='view-title'><Text className='text'>报告模块</Text></View>
                <View className='view-list'>
                    <AtGrid mode='square' data={[
                        {value : '整体情况', image : imgSrc + '/icons/view/a.png' },
                        {value : '菌群状态分析', image : imgSrc + '/icons/view/b.png' },
                        {value : '具体检测结果', image : imgSrc + '/icons/view/c.png' },
                        {value : '健康评估',  image : imgSrc + '/icons/view/d.png' },
                        {value : '菌群改善建议', image : imgSrc + '/icons/view/e.png' },
                        {value : '菌群知识科普', image : imgSrc + '/icons/view/f.png'}
                    ]} onClick={(item) => handleItemClick(item.value)}
                    />
                </View>
                {
                    user.token ? (
                    <>
                        <View className='view-title'><Text className='text'>其他功能</Text></View>
                        <View className='view-overview'>
                            <View className='view-overview-item'>
                                <View className='info'>预览这份报告的PDF版本，同时也支持报告下载：</View>
                                <AtButton loading={downloadLoading} disabled={downloadLoading} type='secondary' circle onClick={handleDownLoad}>预览报告</AtButton>
                            </View>
                            <View className='view-overview-item'>
                                <View className='info'>分享这份报告的在线版本供其他人浏览：</View>
                                <AtButton type='secondary' circle onClick={() => setFloatGenOpen(true)}>分享报告</AtButton>
                            </View>
                        </View>
                        <AtFloatLayout isOpened={floatGenOpen} title='选择过期时间' onClose={() => setFloatGenOpen(false)}>
                            <View className='view-generate'>
                                <AtRadio className='radio'
                                  options={[
                                        {label : '一天', value : 'day'},
                                        {label : '一周', value : 'week'},
                                        {label : '一月', value : 'month'},
                                        {label : '永久有效', value : 'forever'}
                                    ]}
                                  value={genRadioVal}
                                  onClick={(value) => setGenRadioVal(value)}
                                />
                                <AtButton type='secondary' circle onClick={handleGenerate}>查看</AtButton>
                            </View>
                        </AtFloatLayout>
                        <AtFloatLayout isOpened={floatShareOpen} onClose={() => setFloatShareOpen(false)} title='分享二维码'>
                            <View className='view-share'>
                                <Image className='img' src={shareContent.src} showMenuByLongpress />
                                <View className='time'>过期时间为：<Text className='time-detail'>{shareContent.expire}</Text></View>
                                { shareContent.password ? (<View className='pass'>使用二维码时，对方需输入分享码：<Text className='code' selectable>{shareContent.password}</Text></View>) : null }
                            </View>
                        </AtFloatLayout>
                    </>
                    ) : null
                }
            </View>
        </>
    );
}

export default ReportView;