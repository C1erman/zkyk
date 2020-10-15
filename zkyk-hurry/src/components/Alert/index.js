import React, { useState, useEffect } from 'react';
import './alert.css';

const Alert = ({
    defaultVisible = false,
    content,
    controller,
    time = 2000,
    beforeClose
}) => {
    let [visible, setVisible] = useState(defaultVisible);
    const handleVisible = (type) => {
        if(type === 'open'){
            !visible ? setVisible(true) : null;
        }
        else if(type === 'close'){
            visible ? setVisible(false) : null;
        }
        else if(type === 'toggle'){
            setVisible(!visible);
        }
    }
    if(controller instanceof Object){
        controller.on = handleVisible;
    }
    useEffect(() => {
        let timer = visible ? setTimeout(() => {
            setVisible(false);
            typeof beforeClose === 'function' ? beforeClose() : null;
        }, time) : null;
        return () => {
            clearTimeout(timer);
        }
    }, [visible]);
    

    return visible ? (
        <div className='alert'>
            <div className='alert-dialog'>
                    <div className='alert-content'>
                        {content}
                    </div>
            </div>
        </div>
    ) : null;
}

export default Alert;