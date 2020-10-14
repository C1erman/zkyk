import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import { debounce } from '../../utils/BIOFunc';
// redux
import { useDispatch, useSelector } from 'react-redux';
import * as BIO from '../../actions';

import './home.css';
import bioLogo from '../../icons/home-logo-bio.svg';
import zkykLogo from '../../icons/home-logo-zkyk.svg';
import { host } from '../../_config';
import Input from '../Input';
import Button from '../Button';

const Home = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    let [error, setError] = useState('');
    let [btnText, setBtnText] = useState('绑定采样');
    let [inputs, setInputs] = useState({
        barCode : ''
    });
    let user = useSelector(state => state.user);

    const checkCode = () => {
        if(!user.id) {
            history.push('/user/login');
        }
        // check empty
        let validated = Object.keys(inputs).filter(v => {
            return !inputs[v].validated;
        });
        if(validated.length){
            setError('请输入正确的采样管编号。');
            setTimeout(() => setError(''), 2500);
        }
        else{
            Axios({
                method : 'POST',
                url : host + '/validate/verify' + '?access-token=' + user.token,
                data : {
                    barcode : inputs.barCode.value
                },
                headers : {
                    'Content-Type' : 'application/json; charset=UTF-8'
                },
                timeout : 5000
            }).then(_data => {
                const {data} = _data;
                if(data.code === 'error'){
                    setError(data.info);
                    setTimeout(() => { setError('') }, 2500)
                }
                else if(data.code === 'success'){
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
                    }, 100)
                }      
            }).catch(error => {
                console.error(error);
                setError('网络请求出现问题，请稍后再试。');
            });
        }
    }
    return (
        <>
            <div className='home-container'>
                <div className='home-textContainer'>
                    <div className='home-logoContainer'>
                        <img src={bioLogo} alt='博奥汇玖' />
                        <div className='home-logo-divide'>×</div>
                        <img src={zkykLogo} alt='中科宜康' />
                    </div>
                    <div className='home-title'>— 肠道菌群健康评估报告 —</div>
                </div>
                <Input withLabel={false} placeholder='请输入采样管编号' form={inputs} dataName='barCode' validateType={/^\d{9}$/} errorMsg='请输入由9位数字组成的采样管编号。' />
                <div className='home-btnContainer'>
                    <Button text='绑定采样' click={debounce(checkCode, 300)} errorText={error} hollow={true} loading={true} />
                </div>
            </div>
        </>
    );
    
}

export default Home;