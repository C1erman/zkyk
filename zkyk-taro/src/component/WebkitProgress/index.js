import React from 'react';
import { View, Text } from '@tarojs/components';
import './webkitProgress.css';

const WebkitProgress = ({
    label = '标题',
    percent,
    total,
    ...rest
}) => {
    return (
        <View className='webkit-progress' {...rest}>
            <Text className='webkit-progress-label'>{label}</Text>
            <View className='webkit-progress-container' style={{background : '-webkit-linear-gradient(left, #ffe6eb 0%, #ff4f76 ' + total + ', #ffe6eb 100%)'}}>
                <View className='item' style={{left : percent }}></View></View>
        </View>
    );
}

export default WebkitProgress;