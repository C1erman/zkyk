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

    let initText, setText;
    useEffect(() => {
        initText = () => {
            setBtnText(btnText);
            setLoading(false);
        };
        setText = () => {
            setBtnText(loadingText)
            setLoading(true);
        }
        return () => {
            initText = setText = () => {};
        }
    },[])
    return (
        <div className='button'>
            <button className={btnLoading ? className + ' disabled' : className}
            onClick={() => {
                typeof click === 'function' ? click() : undefined;
                if(loading){
                    if(btnText !== text) return false;
                    else {
                        setText();
                        setTimeout(() => initText(), loadingTime);
                    }
                }
            }}>{btnText}</button>
            <p className='button-error'>{errorText}</p>
        </div>
    );
}

export default Button;