import React, { useEffect, useState } from 'react';
import './modal.css';

const Modal = ({
    defaultVisible = false,
    slave = false,
    title,
    content,
    footer,
    onClose,
    controller
}) => {
    let [visible, setVisible] = useState(defaultVisible);

    useEffect(() => {
        document.body.style.overflow = visible ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        }
    }, [visible]);

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
    return !visible ? null : (
        <div className='modal' onClick={() => {if(!slave) setVisible(false); typeof onClose === 'function' ? onClose() : null}}>
            <div className='modal-dialog' onClick={(e) => e.stopPropagation()}>
                <div className='modal-header'>
                    <h3 className='modal-title'>{title}</h3>
                    {!slave ? (<span className='modal-close' onClick={() => {setVisible(false); typeof onClose === 'function' ? onClose() : null}}>×</span>) : null}
                </div>
                <div className='modal-body'>
                    <div className='modal-content'>
                        {content}
                    </div>
                </div>
                {footer ? <div className='modal-footer'>{footer}</div> : null}
            </div>
        </div>
    );
    
}

export default Modal;