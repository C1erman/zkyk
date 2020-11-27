import React from 'react';
import { View, Text } from '@tarojs/components';
import './infoProgress.css';

const InfoProgress = ({
    percent,
    labels = [],
    texts = [],
    ...rest
}) => {
    const colorArray = ['#ff4f76','#ff4f76','#ff6470','#ff8e65','#ffb85b','#d8bc5c','#b2c05e','#97c35f','#87c560','#77c761', '#77c761'];
    const countHex = (start, end, per) => {
        let result = [];
        start = start.slice(1); end = end.slice(1);
        for(let i = 0; i < 3; i ++){
            let a = Number('0x' + start.slice(i * 2, i * 2 + 2));
            let b = Number('0x' + end.slice(i * 2, i * 2 + 2));
            let c = (b > a) ? (b - a) * per + a : (a - b) * per + b;
            let d = Math.floor(c).toString(16);
            result.push(d.length ? (d.length == 1 ? '0' + d : d) : '00');
        }
        return '#' + result.join('');
    }
    const handleBackgroundRange = (value) => {
        let linearBackground = '-webkit-linear-gradient(left,';
        let res = {};
        value = + value;
        let integer = Math.floor(value);
        let decimal = value - integer;
        let arr = colorArray.slice(0, integer);
        if(decimal > 0.0001) arr.push(countHex(colorArray[integer], colorArray[integer + 1], decimal));
        arr.forEach((v, i) => res[v] = Math.floor(i / value * 100))
        Object.keys(res).map(v => {
            linearBackground += (v + ' ' + res[v] + '%,')
        })
        linearBackground = linearBackground.slice(0, -1);
        linearBackground += ')';
        return linearBackground;
    }
    return (
        <View className='infoProgress' {...rest}>
            <View className='infoProgress-infos'>
                {labels.map((v, i) => 
                    <Text className='item' key={i} style={{left : v.pos}}>{v.text}</Text>
                )}
            </View>
            <View className='infoProgress-container'>
                <View className='item' style={{width : percent * 10 + '%',background : handleBackgroundRange(percent)}}></View>
            </View>
            <View className='infoProgress-texts'>
                {texts.map((v, i) => 
                    <Text className='item' key={i} style={{left : v.pos}}>{v.text}</Text>
                )}
            </View>
        </View>
    );
}

export default InfoProgress;