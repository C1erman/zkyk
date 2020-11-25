import React, { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import { useSelector } from 'react-redux';
import Taro from '@tarojs/taro';
import './moduleB.css';
import { host } from '../../config';
import Progress from '../../component/Progress';

const ModuleB = () => {
    const _user = useSelector(state => state.user)
    const report = useSelector(state => state.report)

    let [flora, setFlora] = useState([])

    useEffect(() => {
        Taro.request({
            url : host + '/sample/metrics',
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
            if(data.code === 'success') setFlora(data.data);
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
    const judgeProgress = (value) => {
        if (value === '偏低') return { className: 'overview-results overview-result-below' };
        else if (value === '超标') return { className: 'overview-results overview-result-above' };
        else return { className: 'overview-results' }
    }

    return (
        <View className='M-container'>
            <View className='overview-flora'>
                {flora.map((v, i) => (
                    <View key={i} className='overview-flora-items'>
                        <View className='overview-flora-item-header'>
                            <View className='first'>{v.type_zh}</View><View className={'last ' + mapRisk[v.conclusion]}>{v.rank_zh}</View>
                        </View>
                        <View className='overview-flora-item-body'>
                            <View>{v.summary}</View>
                            {v.chart ? (
                                <View className='overview-flora-item-progress'>
                                    {v.chart.map((_v, _i) => (
                                        <Progress key={_i} label={<Text>{_v.name + ' '}<Text {...judgeProgress(_v.state)}>{_v.state}</Text></Text>} total={(+ _v.median) + '%'} percent={(+ _v.proportion) + '%'} />
                                    ))}
                                </View>
                            ) : null}
                        </View>
                        {
                            v.suggestion ? (<View className='overview-flora-item-result'>{v.suggestion}</View>) : null
                        }
                    </View>
                ))}
            </View>
        </View>
    );
}

export default ModuleB;