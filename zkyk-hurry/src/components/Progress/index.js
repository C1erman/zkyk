import React from 'react';
import './progress.css';

const Progress = ({
    label = '标题',
    percent,
    total,
    ...rest
}) => {
    return (
        <div className='progress' {...rest}>
            <span className='progress-label'>{label}</span>
            <div className='progress-container' style={{background : 'linear-gradient(to right, #ffe6eb 0%, #ff4f76 ' + total + ', #ffe6eb 100%)'}}>
                <div style={{left : percent }}></div></div>
        </div>
    );
}

export default Progress;