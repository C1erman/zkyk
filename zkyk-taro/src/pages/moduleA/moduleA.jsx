import React, { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import { useSelector } from 'react-redux';
import Taro from '@tarojs/taro';
import './moduleA.css';
import { host } from '../../config';

const showGraphNew = (label = '健康', score = 9) => {
    // 自定义Shape 部分
    G2.registerShape('point', 'pointer', {
        draw(cfg, container) {
            const group = container.addGroup({});
            // 获取极坐标系下画布中心点
            const center = this.parsePoint({ x: 0, y: 0 });
            // 绘制指针
            group.addShape('line', {
                attrs: {
                    x1: center.x,
                    y1: center.y,
                    x2: cfg.x,
                    y2: cfg.y,
                    stroke: cfg.color,
                    lineWidth: 5,
                    lineCap: 'round',
                },
            });
            group.addShape('circle', {
                attrs: {
                    x: center.x,
                    y: center.y,
                    r: 9.75,
                    stroke: cfg.color,
                    lineWidth: 4.5,
                    fill: '#fff',
                },
            });
            return group;
        },
    });
    const data = [{ value: score }];
    const chart = new G2.Chart({
        container: 'graph',
        autoFit: true,
        height: 250,
        padding: [0, 0, 30, 0],
    });
    chart.data(data);
    chart.coordinate('polar', {
        startAngle: (-9 / 8) * Math.PI,
        endAngle: (1 / 8) * Math.PI,
        radius: 0.85,
    });
    chart.scale('value', {
        min: 0,
        max: 10,
        ticks: [2, 4, 5, 6, 7, 8, 9],
    });
    chart.axis('1', false);
    chart.axis('value', {
        line: null,
        label: {
            offset: -35,
            formatter: (val) => {
                if (val === '2') {
                    return '重度';
                } else if (val === '4') {
                    return '40'
                } else if (val === '5') {
                    return '中度';
                } else if (val === '7') {
                    return '轻度';
                } else if (val === '9') {
                    return '健康'
                } else if (val === '6') {
                    return '60'
                } else if (val === '8') {
                    return '80'
                }
                return '';
            },
            style: {
                fill: '#666',
                fontSize: 15,
                textAlign: 'center',
            },
        },
        tickLine: null,
        grid: null,
    });
    chart.legend(false);
    chart
        .point()
        .position('value*1')
        .shape('pointer')
        .color('#ff4f76');
    // 绘制仪表盘刻度线
    chart.annotation().line({
        start: [4, 0.96],
        end: [4, 0.89],
        style: {
            stroke: '#ff4f76', // 线的颜色
            lineDash: null, // 虚线的设置
            lineWidth: 2,
        },
    });
    chart.annotation().line({
        start: [6, 0.96],
        end: [6, 0.89],
        style: {
            stroke: '#ff4f76', // 线的颜色
            lineDash: null, // 虚线的设置
            lineWidth: 2,
        },
    });
    chart.annotation().line({
        start: [8, 0.96],
        end: [8, 0.89],
        style: {
            stroke: '#ff4f76', // 线的颜色
            lineDash: null, // 虚线的设置
            lineWidth: 2,
        },
    });
    // 绘制仪表盘背景
    chart.annotation().arc({
        top: false,
        start: [0, 1],
        end: [10, 1],
        style: {
            stroke: '#ffe6eb',
            lineWidth: 13,
            lineDash: null,
        },
    });
    // 绘制指标
    chart.annotation().arc({
        start: [0, 1],
        end: [data[0].value, 1],
        style: {
            stroke: '#ff4f76',
            lineWidth: 13,
            lineDash: null,
        },
    });
    // 绘制指标数字
    chart.annotation().text({
        position: ['50%', '94%'],
        content: label,
        style: {
            fontSize: 20,
            fill: '#ff4f76',
            textAlign: 'center',
        },
    });
    chart.render();
}

const ModuleA = () => {
    const _user = useSelector(state => state.user)
    const report = useSelector(state => state.report)

    let [user, setUser] = useState({})
    let [abnormal, setAbnormal] = useState([])

    useEffect(() => {
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
        <View className='M-container'>
            <View className='overview-total-graph'>
                <View id='graph' />
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
    );
}

export default ModuleA;