import React, { useState } from 'react';
import { range } from '../../utils/BIOArray';
import './pagination.css';

const Pagination = ({
    btnNum = 9,
    around = 1,
    total = 10,
    currentPage = 1
}) => {
    let [current, setCurrent] = useState(currentPage);
    let result;
    let leftIndex = 1 + 2 + around + 1,
        rightIndex = total - 1 - 2 - around;
    let withOneEllipsisNum = btnNum - 4;

    if(total <= btnNum - 2) result = range(1, total);
    else {
        if(current < leftIndex) result = [].concat(range(1, btnNum - 2 - 2), ['...', total]);
        else if(current > rightIndex) result = [].concat([1, '...'], range(total - withOneEllipsisNum + 1, total));
        else {
            console.log('sd')
            result = [].concat([1, '...'], range(current - around, current + around), ['...', total]);
        }
    }
    console.log(result)

    return (
        <div className='pagination'>
            <ul className='pager'>
                <li>‹</li>
                {result.map((i, v) => <li key={i + v} className={i == current ? 'active' : ''} onClick={() => setCurrent(i)}>
                    <a>{i}</a>
                </li>)}
                <li>›</li>
            </ul>
        </div>
    );
}

export default Pagination;