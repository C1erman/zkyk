import React from 'react';
import './progress.css';

const Progress = ({
    label = '标题',
    percent,
    ...rest
}) => {
    return (
        <div className='progress' {...rest}>
            <span className='progress-label'>{label}</span>
            <span className='progress-container'><span style={{width : percent }}></span></span>
        </div>
    );
}

export default Progress;