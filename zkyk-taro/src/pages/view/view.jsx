import React, { useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import { useSelector } from 'react-redux';
import Taro from '@tarojs/taro'
import { AtGrid, AtButton } from 'taro-ui';

import './view.css'

const ReportView = () => {

    const user = useSelector(state => state.user)
    const report = useSelector(state => state.report)

    useEffect(() => {
        
    }, [])

    const handleFabClick = () => {
        
    }
    const handleItemClick = (name) => {
        let module = {
            '整体情况' : '/pages/moduleA/moduleA',
            '菌群状态分析' : '/pages/moduleB/moduleB',
            '具体检测结果' : '/pages/moduleC/moduleC',
            '健康评估' : '/pages/moduleD/moduleD',
            '菌群改善建议' : '/pages/moduleE/moduleE'
        }
        Taro.navigateTo({
            url : module[name]
        })
    }
    const handleDownLoad = (reportId) => {

    }

    return (
        <View className='view-container'>
            <View className='view-title'><Text className='text'>报告模块</Text></View>
            <View className='view-list'>
                <AtGrid mode='rect' data={[
                    {value : '整体情况'}, {value : '菌群状态分析'}, {value : '具体检测结果'},
                    {value : '健康评估'}, {value : '菌群改善建议'}
                ]} onClick={(item, index) => handleItemClick(item.value)}
                />
            </View>
            <View className='view-title'><Text className='text'>其他功能</Text></View>
            <View className='view-overview'>
                <View className='view-overview-info'>下载这份报告的PDF版本并进行预览：</View>
                <AtButton type='secondary' circle onClick={handleDownLoad}>下载报告</AtButton>
            </View>
        </View>
    );
}

export default ReportView;