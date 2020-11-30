import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { useSelector } from 'react-redux';
import Taro from '@tarojs/taro'
import { AtGrid, AtButton } from 'taro-ui';

import './view.css'
import { host, imgSrc } from '../../config';

const ReportView = () => {
    const user = useSelector(state => state.user)
    const report = useSelector(state => state.report)

    let [downloadLoading, setLoading] = useState(false)

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
        setLoading(true);
        Taro.request({
            url : host + '/admin/wx/pdf?access-token=' + user.token,
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
                        setLoading(false);
                        let {tempFilePath} = response;
                        let fileName = data.data.filename;
                        Taro.saveFile({
                            tempFilePath : tempFilePath,
                            filePath : wx.env.USER_DATA_PATH + '/' + fileName + '.pdf',
                            success : (xxx) => {
                                Taro.openDocument({
                                    filePath : wx.env.USER_DATA_PATH + '/' + fileName + '.pdf',
                                    fileType : 'pdf',
                                    success : (xxx) => {
                                        console.log('下载成功');
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
                setTimeout(() => setLoading(false), 2500)
            }
        })
        .catch(e => console.log(e))
    }

    return (
        <View className='view-container'>
            <View className='view-title'><Text className='text'>报告模块</Text></View>
            <View className='view-list'>
                <AtGrid mode='square' data={[
                    {value : '整体情况', image : imgSrc + '/icons/view/a.png' }, {value : '菌群状态分析', image : imgSrc + '/icons/view/b.png' },
                    {value : '具体检测结果', image : imgSrc + '/icons/view/c.png' },
                    {value : '健康评估',  image : imgSrc + '/icons/view/d.png' }, {value : '菌群改善建议', image : imgSrc + '/icons/view/e.png' },
                    {value : '菌群知识科普', image : imgSrc + '/icons/view/f.png'}
                ]} onClick={(item, index) => handleItemClick(item.value)}
                />
            </View>
            <View className='view-title'><Text className='text'>其他功能</Text></View>
            <View className='view-overview'>
                <View className='view-overview-info'>查看这份报告的PDF版本并进行预览或下载，同时也可以将报告分享给其他人：</View>
                <AtButton loading={downloadLoading} disabled={downloadLoading} type='primary' circle onClick={handleDownLoad}>预览报告</AtButton>
            </View>
        </View>
    );
}

export default ReportView;