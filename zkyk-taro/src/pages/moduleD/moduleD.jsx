import React, { useEffect, useState } from 'react';
import { AtMessage } from 'taro-ui';
import { View } from '@tarojs/components';
import { useSelector } from 'react-redux';
import Taro from '@tarojs/taro';
import './moduleD.css';
import { host } from '../../config';

const ModuleD = () => {
    const _user = useSelector(state => state.user)
    const report = useSelector(state => state.report)

    let [assess, setAssess] = useState([])

    useEffect(() => {
        Taro.request({
            url : host() + '/sample/indicator',
            method : 'GET',
            data : {
                id : report.current,
                'access-token' : _user.token
            },
            header : {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let {data} = res;
            if(data.code === 'success') setAssess(data.data);
        })
        .catch(e => console.log(e))
    }, [report])
    
    const mapRisk = {
        'low-risk' : 'low-risk',
        'middle-risk' : 'middle-risk',
        'high-risk' : 'high-risk',
        'weaker' : 'high-risk',
        'normal' : 'low-risk',
        'abnormal_low' : 'middle-risk',
        'abnormal_high' : 'high-risk'
    }

    return (
        <>
            <AtMessage />
            <View className='M-container'>
                {assess.map((v, i) => (
                    <View key={i} className='assess-items'>
                        <View className='assess-item-header'>
                            <View className='first'>{v.type_zh}</View><View className={'last ' + mapRisk[v.conclusion]}>{v.rank_zh}</View>
                        </View>
                        <View className='assess-item-body'>
                            <View>{v.summary}</View>
                        </View>
                        {v.suggestion ? (<View className='assess-item-result'>
                            {v.suggestion}
                        </View>) : null}
                    </View>
                ))}
            </View>
        </>
    );
}

export default ModuleD;