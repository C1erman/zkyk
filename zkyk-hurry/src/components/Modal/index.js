import React from 'react';
import './modal.css';

const Modal = ({
    visible = false,
    title,
    content,
    footer,
    onClose
}) => {
    return !visible ? null : (
        <div className='modal' onClick={onClose}>
            <div className='modal-dialog' onClick={(e) => e.stopPropagation()}>
                <div className='modal-header'>
                    <h3 className='modal-title'>{title}</h3>
                    <span className='modal-close' onClick={onClose}>×</span>
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