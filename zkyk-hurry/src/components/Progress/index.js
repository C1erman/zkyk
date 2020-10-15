import React from 'react';
import './progress.css';

const Progress = ({
    label = '标题',
    color,
    percent,
    ...rest
}) => {
    return (
        <div className='progress' {...rest}>
            <span>{label}</span>
            <span className='progress-container'><span style={{width : percent, backgroundColor : color}}></span></span>
        </div>
    );
}

export default Progress;