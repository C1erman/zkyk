import React, { useState, useEffect } from 'react';
import './button.css';
import { debounce } from '../../utils/BIOFunc';

const Button = ({
    text = '按钮',
    click,
    errorText = '',
    withError = true,
    hollow = false,
    loading = false,
    loadingText = '请稍候',
    loadingTime = 2500,
    listenEnter = false,
    controlledByFunc = false
}) => {
    let [btnText, setBtnText] = useState(text);
    let [btnLoading, setLoading] = useState(false);
    let className = hollow ? 'hollow' : ''; 

    const beginLoading = () => {
        setBtnText(loadingText);
        setLoading(true);
    }
    const endLoading = () => {
        setBtnText(btnText);
        setLoading(false);
    }
    const handleClick = () => {
        if(typeof click !== 'function') return false;
        else{
            if(controlledByFunc) return click(beginLoading, endLoading);
            else return click();
        }
    }
    const handleOriginalClick = () => {
        if(loading){
            if(btnLoading) return false;
            else{
                if(controlledByFunc) handleClick();
                else{
                    beginLoading();
                    handleClick();
                    setTimeout(() => endLoading(), loadingTime);
                }
            }
        }
        else debounce(handleClick, 500)();
    }
    const handleEnter = (event) => {
        event = event || window.event;
        if(!listenEnter) return false;
        else{
            let keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
            if(keyCode == 13) handleOriginalClick();
        }
    }
    useEffect(() => {
        if(listenEnter) window.addEventListener('keydown', handleEnter);
        return () => {
            window.removeEventListener('keydown', handleEnter);
        }
    }, [])
    
    return (
        <div className='button'>
            <button className={btnLoading ? className + ' disabled' : className}
            onClick={handleOriginalClick} onKeyDown={handleEnter}>{btnText}</button>
            {withError ? (<p className='button-error'>{errorText}</p>) : null}
        </div>
    );
}

export default Button;