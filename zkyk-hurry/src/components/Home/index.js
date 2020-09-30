import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import './home.css';
import Modal from '../Modal';
import logo from '../../icons/logo.png';
import { host } from '../../_config';

const Home = () => {
    // 路由
    const history = useHistory();
    // 模态框初始显示状态
    const [visible, setVisible] = useState(false);
    const [error, setError] = useState('');
    const [barcode, setBarcode] = useState('');
    const [btnText, setBtnText] = useState('下一步');
    const inputRef = useRef();

    const validate = (e) => {
        e.preventDefault ? e.preventDefault() : undefined;
        let barcode = inputRef.current.value;
        if(!barcode.length) setError('');
        else{
            let regExp = /^\d{9}$/;
            if(!regExp.test(barcode)) setError('请输入由9位数字组成的采样管编号。')
            else{
                setError('');
                setBarcode(barcode);
            }
        }
    }
    const onClose = () => {
        setVisible(false);
        setError('');
        setBarcode('');
    }
    useEffect(() => {
        document.body.style.overflow = visible ? 'hidden' : '';
    },[visible]);

    const checkCode = () => {
        if(!barcode.length){
            setError('请输入正确的采样管编号。');
            return false;
        }
        Axios({
            method : 'POST',
            url : host + '/validate/verify',
            data : {
                barcode : barcode
            },
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            const {data} = _data;
            if(data.code === 'error') setError(data.info);
            else if(data.code === 'success'){
                onClose();
                localStorage.setItem('barcode', data.data?.barcode);
                localStorage.setItem('sample_id', data.data?.sample_id);
                setBtnText('请稍后');
                setTimeout(() => {
                    setBtnText('下一步');
                    history.push('/add');
                }, 500)
            }      
        }).catch(error => {
            console.log(error);
            setError('网络请求出现问题，换个浏览器试试？');
        });
    }
    return (
        <>
            <div className='home-container'>
                <div className='home-textContainer'>
                    <div className='home-logoContainer'>
                        <img src={logo} alt='中科宜康' />
                    </div>
                    <div className='home-title'></div>
                </div>
                <div className='home-btnContainer'>
                    <button className='home-btn' variant="primary" onClick={() => setVisible(true)}>绑定采样</button>
                </div>
            </div>
            <Modal visible={visible} title='绑定采样'
            content={<>
                <input ref={inputRef} onChange={(e) => validate(e)} className='home-input' type='text' placeholder='请输入9位采样管编号' />
                <span className='home-error'>{error}</span>
                <div><button className='home-btn home-btn-sm home-btn-center' onClick={checkCode}>{btnText}</button></div>
            </>}
            onClose={onClose} />
        </>
    );
    
}

export default Home;