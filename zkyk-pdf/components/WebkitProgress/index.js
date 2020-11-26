import React from 'react';
import './webkitProgress.css';

const WebkitProgress = ({
    label = '标题',
    percent,
    total,
    ...rest
}) => {
    return (
        <div className='webkit-progress' {...rest}>
            <span className='webkit-progress-label'>{label}</span>
            <div className='webkit-progress-container' style={{background : '-webkit-linear-gradient(left, #ffe6eb 0%, #ff4f76 ' + total + ', #ffe6eb 100%)'}}>
                <div style={{left : percent }}></div></div>
        </div>
    );
}

export default WebkitProgress;