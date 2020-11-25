import React from 'react';
import { AtGrid } from 'taro-ui';
import { View, Text } from '@tarojs/components';
import './all.css';

const All  = () => {


    const handleClick = (item, index) => {
    }

    return (
        <View className='all-container'>
            <View className='all-title'><Text className='text'>常用功能</Text></View>
            <View className='all-section'>
                <AtGrid mode='rect' data={[
                    {value : '报告列表'}, {value : '报告下载'}, {value : '报告查询'}
                ]} onClick={handleClick}
                />
            </View>
            <View className='all-title'><Text className='text'>更多</Text></View>
            <View className='all-section'>

            </View>
        </View>
    );
}

export default All;