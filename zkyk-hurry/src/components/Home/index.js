import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
// redux
import { useDispatch } from 'react-redux';
import * as BIO from '../../actions';

import './home.css';
import Modal from '../Modal';
import bioLogo from '../../icons/home-logo-bio.svg';
import zkykLogo from '../../icons/home-logo-zkyk.svg';
import { host } from '../../_config';

const Home = () => {
    // redux
    const dispatch = useDispatch();
    // 页面跳转
    const history = useHistory();
    // 模态框初始显示状态
    const [visible, setVisible] = useState(false);
    const [error, setError] = useState('');
    const [barcode, setBarcode] = useState('');
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
        if(visible) setError('');
    },[visible])
    const checkCode = () => {
        // for test
        dispatch({
            type : BIO.ADD_CHECK_SUCCESS,
            data : {
                barCode : 'sd',
                sampleId : 'id'
            }
        })
        // for test-end
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
                // localStorage.setItem('barcode', data.data?.barcode);
                // localStorage.setItem('sample_id', data.data?.sample_id);
                let { barcode = '', sample_id = '' } = data.data;
                dispatch({
                    type : BIO.ADD_CHECK_SUCCESS,
                    data : {
                        barCode : barcode,
                        sampleId : sample_id
                    }
                })
                setTimeout(() => {
                    history.push('/add');
                }, 500)
            }      
        }).catch(error => {
            console.error(error);
            setError('网络请求出现问题，请稍后再试。');
        });
    }
    return (
        <>
            <div className='home-container'>
                <div className='home-textContainer'>
                    <div className='home-logoContainer'>
                        <img src={bioLogo} alt='博奥汇玖' />
                        <div className='home-logo-divide'></div>
                        <img src={zkykLogo} alt='中科宜康' />
                    </div>
                    <div className='home-title'></div>
                </div>
                <div className='home-btnContainer'>
                    <button className='home-btn' variant="primary" onClick={() => setVisible(true)}>绑定采样</button>
                </div>
            </div>
            <Modal visible={visible} title='绑定采样'
            content={<>
                <input ref={inputRef} onChange={(e) => validate(e)} className='home-input' type='number' placeholder='请输入9位采样管编号' />
                <span className='home-error'>{error}</span>
                <div><button className='home-btn home-btn-sm home-btn-center' onClick={checkCode}>下一步</button></div>
            </>}
            onClose={onClose} />
        </>
    );
    
}

export default Home;