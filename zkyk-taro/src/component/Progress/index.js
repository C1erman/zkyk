import React from 'react';
import { View, Text } from '@tarojs/components';
import './progress.css';

const Progress = ({
    label = '标题',
    percent,
    total,
    ...rest
}) => {
    return (
        <View className='progress' {...rest}>
            <Text className='progress-label'>{label}</Text>
            <View className='progress-container' style={{background : 'linear-gradient(to right, #ffe6eb 0%, #ff4f76 ' + total + ', #ffe6eb 100%)'}}>
                <View className='item' style={{left : percent }}></View></View>
        </View>
    );
}

export default Progress;