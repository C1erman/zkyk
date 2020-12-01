import React, { useEffect, useState } from 'react';
import { AtMessage } from 'taro-ui';
import { View, Text } from '@tarojs/components';
import { useSelector } from 'react-redux';
import Taro from '@tarojs/taro';
import './moduleA.css';
import { host } from '../../config';
import InfoProgress from '../../component/InfoProgress';


const ModuleA = () => {
    const _user = useSelector(state => state.user)
    const report = useSelector(state => state.report)

    let [graph, setGraph] = useState({
        value : '10'
    })
    let [user, setUser] = useState({})
    let [abnormal, setAbnormal] = useState([])

    useEffect(() => {
        Taro.request({
            url : host + '/charts/gauge',
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
            if(data.code === 'success') setGraph(data.data);
        }).catch(e => console.log(e));
        Taro.request({
            url : host + '/sample/personal',
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
            if(data.code === 'success') setUser(data.data);
        })
        .catch(e => console.log(e))
        Taro.request({
            url : host + '/sample/abnormal',
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
            if(data.code === 'success') setAbnormal(data.data);
        })
        .catch(e => console.log(e))
    }, [report])

    return (
        <>
            <AtMessage />
            <View className='M-container'>
                <View className='overview-total-graph'>
                    <InfoProgress percent={+ graph.value} labels={[{text : '20', pos : '12%'},{text : '60', pos : '52%'},{text : '80', pos : '72%'}]}
                      texts={[{text : '重度', pos : '5%'},{text : '中度', pos : '25%'},{text : '轻度', pos : '52%'},{text : '健康', pos : '67%'}]}
                    />
                    <View className='title'>{graph.name}</View>
                </View>
                { user.age && (+ user.age) ? (<View className='overview-age-prediction'>预测年龄：{(+ user.age).toFixed(1)} 岁</View>) : null }
                <View className='overview-total'>
                    <View className='overview-total-item'>
                        <Text className='overview-total-label'>受检者<Text className='overview-total-lable-item'>{user.name}</Text></Text>
                        <Text className='overview-total-label'>性别<Text className='overview-total-lable-item'>{user.gender}</Text></Text>
                    </View>
                    <View className='overview-total-item'>
                        <Text className='overview-total-label'>生日<Text className='overview-total-lable-item'>{user.birthday}</Text></Text>
                        <Text className='overview-total-label'>报告日期<Text className='overview-total-lable-item'>{user.date_of_production}</Text></Text>
                    </View>
                </View>
                <View className='overview-abnormal'>
                    {abnormal ? (
                        <>
                            <View className='overview-abnormal-title'>根据您目前的肠道菌群情况，提示您<Text className='important'>以下指标异常</Text>，需要引起重视，可结合改善建议进行调理。</View>
                            <View>
                                {abnormal.metrics ? (
                                    <View className='overview-abnormal-content'>
                                        <View className='title'>菌群环境</View>
                                        <View className='overview-abnormal-content-item'>
                                            {abnormal.metrics.intestinal_defense ? (<View><Text className='title'>肠道防御力：</Text><Text className='item'>{abnormal.metrics.intestinal_defense}</Text></View>) : null}
                                            {abnormal.metrics.beneficial ? (<View><Text className='title'>有益菌：</Text>{abnormal.metrics.beneficial}<Text className='item'>偏低</Text></View>) : null}
                                            {abnormal.metrics.general ? (<View><Text className='title'>中性菌：</Text>{abnormal.metrics.general.lower ? (<>{abnormal.metrics.general.lower}<Text className='item'>偏低</Text></>) : null }
                                            {abnormal.metrics.general.higher ? (<>{abnormal.metrics.general.higher}<Text className='item'>超标</Text></>) : null}</View>) : null}
                                            {abnormal.metrics.harmful ? (<View><Text className='title'>有害菌：</Text>{abnormal.metrics.harmful}<Text className='item'>超标</Text></View>) : null}
                                        </View>
                                    </View>
                                ) : null}
                                {
                                    abnormal.indicator ? (
                                        <View className='overview-abnormal-content'>
                                            <View className='title'>健康指标</View>
                                            <View className='overview-abnormal-content-item'>{abnormal.indicator.map((v, i) => (
                                                <View key={i}>{v.type_zh}<Text className='item-margin'>{v.rank_zh}</Text></View>
                                            ))}</View>
                                    </View>
                                    ) : null
                                }
                            </View>
                        </>
                    ) : null}
                </View>
            </View>
        </>
    );
}

export default ModuleA;