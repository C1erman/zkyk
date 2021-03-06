import React, { useEffect, useState } from 'react';
import { AtMessage } from 'taro-ui';
import { View, Text } from '@tarojs/components';
import { useSelector } from 'react-redux';
import Taro from '@tarojs/taro';
import './moduleC.css';
import { host } from '../../config';

const ModuleC = () => {
    const _user = useSelector(state => state.user)
    const report = useSelector(state => state.report)
    const guide = useSelector(state => state.guide)

    let [result, setResult] = useState([])
    let br = '\n'

    useEffect(() => {
        Taro.request({
            url : host() + '/sample/bacteria',
            method : 'GET',
            data : {
                id : report.current,
                'access-token' : _user.token,
                'access-code' : guide.report.code,
                password : guide.report.password
            },
            header : {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let {data} = res;
            if(data.code === 'success') setResult(data.data);
        })
        .catch(e => console.log(e))
    }, [report, guide, _user])

    const mapBacterialType = (type) => {
        return {
            beneficial: '有益菌',
            general: '中性菌',
            harmful: '有害菌'
        }[type]
    }
    const judgeRange = (value, min, max, type) => {
        switch (type) {
            case 'beneficial':
                if (value < min) {
                    return { className: 'td overview-result-below' }
                }
                else if (value > max) {
                    return { className: 'td overview-result-bene-above'}
                }
                else return { className: 'td' }
            case 'general': {
                if (value < min) {
                    return { className: 'td overview-result-below' }
                }
                else if (value > max) {
                    return { className: 'td overview-result-above' }
                }
            }
            case 'harmful': {
                if (value > max) {
                    return { className: 'td overview-result-above' }
                }
                else if (value < min) {
                    return { className: 'td overview-result-harm-below' }
                }
            }
            default: return { className: 'td' };
        }
    }
    
    return (
        <>
            <AtMessage />
            <View className='M-container'>
                <View className='overview-result'>
                    <View className='overview-result-info'>* 红色表示该菌含量异常，对健康有影响</View>
                    <View className='table'>
                        <View className='thead'>
                            <View className='tr overview-result-table-head'>
                                <View className='th'>名称</View><View className='th'>分类</View><View className='th'>受检者检测数值<Text className='br'>{br}（Lg CFU/g）</Text></View><View className='th'>参考范围<Text className='br'>{br}（Lg CFU/g）</Text></View>
                            </View>
                        </View>
                        <View className='tbody overview-result-table-body'>
                            {result.length ? result.map(v => (
                                <View key={v.name} className='tr'>
                                    <View className='td overview-result-table-name'>{v.name}</View><View className='td'>{mapBacterialType(v.type)}</View><View {...judgeRange(+ v.value, + v.range_down, + v.range_up, v.type)}>{v.value}</View>{v.range_down == 0 && v.range_up == 0 ? (<View className='td'>{v.range_down}</View>) : (<View className='td'>{v.range_down} - {v.range_up}</View>)}
                                </View>
                            )) : null}
                        </View>
                    </View>
                </View>
            </View>
        </>
    );
}

export default ModuleC;