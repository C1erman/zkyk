import React, { useState, useEffect } from 'react';
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
        <div className='pager'>
            <a className={'pager-btn' + (currentPage === 1 ? ' pager-disabled' : '')} onClick={throttle(prevHandler, 400)}>{prevText}</a>
            <div>
                <span className='pager-current'>{currentPage}</span> / <span className='pager-total'>{total}</span>
            </div>
            <a className={'pager-btn' + (currentPage === total ? ' pager-disabled' : '')} onClick={throttle(nextHandler, 400)}>{nextText}</a>
        </div>
    );
}

export default Pager;