import React, { useRef, useEffect } from 'react';
import './drawer.css';

const Drawer = ({
    visible = false,
    content,
    onClick
}) => {
    const ref = useRef();
    const maskRef = useRef();

    useEffect(() => {
        document.body.style.overflow = visible ? 'hidden' : '';
    }, [visible]);
    const handleClick = () => {
        // if(visible){
        //     ref.current.style = 'transform: translateX(100%)';
        // }
        // else{
        //     ref.current.style = 'transform: translateX(0)';
        // }
    }
    return (
        <div className='drawer-container'>
            <div className={ 'drawer' + ( visible ? ' drawer-open' : '' )}>
                <div className='drawer-mask' ref={maskRef}></div>
                <div className='drawer-content-container' ref={ref}>
                    <div className='drawer-entry' onClick={() => {
                        handleClick();
                        typeof onClick === 'function' ? onClick() : undefined;
                    }}>
                        <span className='drawer-entry-icon'></span>
                        <span className='drawer-entry-icon'></span>
                        <span className='drawer-entry-icon'></span>
                    </div>
                    {visible ? (
                        <div className='drawer-content'>
                            <div></div>
                        </div>
                    ) : undefined}
                    
                </div>
            </div>
        </div>
        
    );
}

export default Drawer;