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
import Alert from '../Alert';

const Home = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    let [error, setError] = useState('');
    let [inputs, setInputs] = useState({
        barCode : ''
    });
    let controller = {};

    let user = useSelector(state => state.user);

    const checkCode = () => {
        if(!user.id) {
            controller.on('open');
            return false;
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
                    <div className='home-info'>
                        <p>肠道是人体消化与吸收的主要器官，吸收了90%以上的营养物质。同时，肠道又是人体最大的免疫器官，人体70%以上的免疫细胞位于肠粘膜内。
                    肠道里的迷走神经与大脑相连，与大脑的神经系统构成“脑肠轴”，因此肠道又被称为人体的“第二大脑”。</p>
                        <p>通过肠道菌群检测获得肠道菌落构成，
                    并依据大数据和统计分析进行肠道健康评分和肠龄预测，可为个性化营养和健康管理提供依据。</p>
                    </div>
                </div>
                <div className='home-other'>
                    <Input type='number' withLabel={false} placeholder='请输入采样管编号' form={inputs} dataName='barCode' validateType={/^\d{9}$/} errorMsg='请输入由9位数字组成的采样管编号。' />
                    <div className='home-btnContainer'>
                        <Button text='绑定采样' click={debounce(checkCode, 300)} errorText={error} hollow={true} loading={true} />
                    </div>
                </div>
                
            </div>
            <Alert controller={controller} content='抱歉，请先登录' beforeClose={() => history.push('/user/login')} />
        </>
    );
    
}

export default Home;