import React, { useState, useEffect } from 'react';
import { View, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { AtActivityIndicator } from 'taro-ui';

import './share.css';

const Share = () => {
    let [bindSrc, setBindSrc] = useState('')

    return (
        <View className='share-container'>
            <View className='share-info'>
                <View className='title'>向受测人分享</View>
                <View className='content'>受测人扫描下方二维码进行自主送样填表。</View>
            </View>
            <View className='share-code-container'>
                <Image src={bindSrc} />
                <AtActivityIndicator mode='center' content='加载中...' isOpened></AtActivityIndicator>
            </View>
        </View>
    );

}

export default Share;