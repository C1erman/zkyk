import React, { useState, useEffect } from 'react';
import './button.css';

const Button = ({
    text = '按钮',
    click,
    errorText = '',
    hollow = false,
    loading = false,
    loadingText = '请稍候',
    loadingTime = 2500
}) => {
    let [btnText, setBtnText] = useState(text);
    let [btnLoading, setLoading] = useState(false);
    let className = hollow ? 'hollow' : '';
    
    return (
        <div className='button'>
            <button className={btnLoading ? className + ' disabled' : className}
            onClick={() => {
                if(loading){
                    if(btnText !== text) return false;
                    else {
                        typeof click === 'function' ? click() : undefined;
                        setBtnText(loadingText)
                        setLoading(true);
                        setTimeout(() => {
                            setBtnText(btnText);
                            setLoading(false);
                        }, loadingTime);
                    }
                }
                else typeof click === 'function' ? click() : undefined;
            }}>{btnText}</button>
            <p className='button-error'>{errorText}</p>
        </div>
    );
}

export default Button;