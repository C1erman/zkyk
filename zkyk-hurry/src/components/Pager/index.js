import React, { useState } from 'react';

import './page.css';

const Pager = ({
    total = 10,
    current = 1,
    prevText = '前一页',
    nextText = '后一页',
    prevClick,
    nextClick
}) => {
    let [currentPage, setCurrent] = useState(current);
    
    const prevHandler = () => {
        if()
    }
    return (
        <div className='pager'>
            <button className={'pager-btn' + currentPage === 1 ? 'disabled' : ''} onClick={() => typeof nextClick === 'function' ? prevClick() : null}>{prevText}</button>
            <div>
                <span className='pager-current'>{currentPage}</span>/<span className='pager-current'>{total}</span>
            </div>
            <button className={'pager-btn' + currentPage === total ? 'disabled' : ''} onClick={() => typeof nextClick === 'function' ? nextClick() : null}>{nextText}</button>
        </div>
    );
}

export default Pager;