import React, { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import './modal.css';

const Modal = ({
    visible = false,
    slave = false,
    title,
    content,
    footer,
    onClose
}) => {
    let [modalVisible, setVisible] = useState(visible);

    const handleClose = () => {
        if(!slave){
            typeof onClose === 'function' ? onClose() : null;
            setVisible(false);
        }
        else return false;
    }

    useEffect(() => {
        setVisible(visible);
    }, [visible])

    return !modalVisible ? null : (
        <View className='modal' onClick={handleClose}>
            <View className='modal-dialog' onClick={e => e.stopPropagation()}>
                <View className='modal-header'>
                    <View className='modal-title'>{title}</View>
                    {!slave ? (<Text className='modal-close' onClick={handleClose}>×</Text>) : null}
                </View>
                <View className='modal-body'>
                    <View className='modal-content'>
                        {content}
                    </View>
                </View>
                {footer ? <View className='modal-footer'>{footer}</View> : null}
            </View>
        </View>
    );
    
}

export default Modal;