import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import { throttle } from '../../utils/BIOFunc';
import './pager.css';

const Pager = ({
    total = 10,
    current = 1,
    prevText = '前一页',
    nextText = '后一页',
    prevClick,
    nextClick
}) => {
    let [currentPage, setCurrent] = useState(current);
    useEffect(() => {
        setCurrent(current);
    }, [current]);
    
    const prevHandler = () => {
        if(currentPage > 1){
            typeof prevClick === 'function' ? prevClick(currentPage - 1) : null;
            setCurrent(currentPage - 1);
        }
    }
    const nextHandler = () => {
        if(currentPage < total){
            typeof nextClick === 'function' ? nextClick(currentPage + 1) : null;
            setCurrent(currentPage + 1);
        }
    }
    return (
        <View className='pager'>
            <Text className={'pager-btn' + (currentPage === 1 ? ' pager-disabled' : '')} onClick={throttle(prevHandler, 400)}>{prevText}</Text>
            <View>
                <Text className='pager-current'>{currentPage}</Text> / <Text className='pager-total'>{total}</Text>
            </View>
            <Text className={'pager-btn' + (currentPage === total ? ' pager-disabled' : '')} onClick={throttle(nextHandler, 400)}>{nextText}</Text>
        </View>
    );
}

export default Pager;