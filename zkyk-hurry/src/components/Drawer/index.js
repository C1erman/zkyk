import React, { useRef, useEffect, useState } from 'react';
import './drawer.css';

const Drawer = ({
    defaultVisible = false,
    content,
    controller
}) => {
    let [visible, setVisible] = useState(defaultVisible);
    const ref = useRef();
    const maskRef = useRef();

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
        document.body.style.overflow = visible ? 'hidden' : '';
    }, [visible]);
    return (
        <div className='drawer-container'>
            <div className={ 'drawer' + ( visible ? ' drawer-open' : '' )}>
                <div className='drawer-mask' ref={maskRef} onClick={() => visible ? setVisible(false) : null}></div>
                <div className='drawer-content-container' ref={ref}>
                    <div className='drawer-entry' onClick={() => {
                        handleVisible('toggle');
                    }}>
                        <span className='drawer-entry-icon'></span>
                        <span className='drawer-entry-icon'></span>
                        <span className='drawer-entry-icon'></span>
                    </div>
                    {visible ? (
                        <div className='drawer-content'>
                            {content}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
        
    );
}

export default Drawer;