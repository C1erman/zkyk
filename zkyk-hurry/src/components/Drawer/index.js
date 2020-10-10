import React, { useRef, useEffect } from 'react';
import './drawer.css';

const Drawer = ({
    visible = false,
    content,
    entryClick
}) => {
    const ref = useRef();
    const maskRef = useRef();

    useEffect(() => {
        document.body.style.overflow = visible ? 'hidden' : '';
    }, [visible]);
    return (
        <div className='drawer-container'>
            <div className={ 'drawer' + ( visible ? ' drawer-open' : '' )}>
                <div className='drawer-mask' ref={maskRef}></div>
                <div className='drawer-content-container' ref={ref}>
                    <div className='drawer-entry' onClick={() => {
                        typeof entryClick === 'function' ? entryClick() : undefined;
                    }}>
                        <span className='drawer-entry-icon'></span>
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