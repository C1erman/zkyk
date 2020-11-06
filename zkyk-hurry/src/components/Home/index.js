import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
// redux
import { useDispatch, useSelector } from 'react-redux';
import * as BIO from '../../actions';

import './home.css';
import { host } from '../../_config';
import Input from '../Input';
import Button from '../Button';
import Alert from '../Alert';
import Modal from '../Modal';
import { slideUp } from '../../utils/slideUp';

const Home = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    let [error, setError] = useState('');
    let [inputs, setInputs] = useState({
        barCode : ''
    });
    let controller = {};
    let modalController = {};
    let agreeRef = useRef();
    let user = useSelector(state => state.user);
    let share = useSelector(state => state.share)
    // 回到顶部
    useEffect(() => slideUp(), []);
    
    const checkCode = (begin, end) => {
        begin();
        if(!user.token && !share.add) {
            controller.on('open');
            return false;
        }
        // check agreement
        if(agreeRef.current.checked === false){
            setError('请勾选检测须知。');
            setTimeout(() => {
                setError('');
                end();
            }, 2500);
            return false;
        }
        // check empty
        let validated = Object.keys(inputs).filter(v => {
            return !inputs[v].validated;
        });
        if(validated.length){
            setError('请输入正确的采样管编号。');
            setTimeout(() => {
                setError('');
                end();
            }, 2500);
        }
        else{
            Axios({
                method : 'POST',
                url : host + '/validate/verify',
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
                    setTimeout(() => { 
                        setError('');
                        end();
                    }, 2500)
                }
                else if(data.code === 'success'){
                    let { barcode = '', sample_id = '' } = data.data;
                    dispatch({
                        type : BIO.ADD_CHECK_SUCCESS,
                        data : {
                            barCode : barcode,
                            sampleId : sample_id
                        }
                    })
                    end();
                    setTimeout(() => {
                        history.push('/add');
                    }, 100)
                }
            }).catch(error => console.log(error));
        }
    }
    return (
        <>
            <div className='home-container'>
                <div className='home-textContainer'>
                    <div className='home-title'>— 人体微生态监测报告 —</div>
                    <div className='home-info'>
                        <p>肠道是人体消化与吸收的主要器官，吸收了90%以上的营养物质。同时，肠道又是人体最大的免疫器官，人体70%以上的免疫细胞位于肠粘膜内。
                    肠道里的迷走神经与大脑相连，与大脑的神经系统构成 “脑肠轴”，因此肠道又被称为人体的 “第二大脑”。</p>
                        <p>通过肠道菌群检测获得肠道菌落构成，
                    并依据大数据和统计分析进行肠道健康评分和肠龄预测，可为个性化营养和健康管理提供依据。</p>
                    </div>
                </div>
                <div className='home-other'>
                    <Input type='number' withLabel={false} placeholder='请输入采样管编号' form={inputs} dataName='barCode' validateType={/^\d{9}$/} errorMsg='请输入由9位数字组成的采样管编号。' />
                    <div className='home-agree'>
                        <label>
                            <input type='checkbox' value='agree' ref={agreeRef} />我已知悉肠道菌群
                        </label>
                        <a className='home-agree-link' onClick={() => modalController.on('toggle')}>检测须知</a>
                    </div> 
                    <div className='home-btnContainer'>
                        <Button text='绑定采样' click={checkCode} errorText={error} hollow={true} loading={true} controlledByFunc={true} />
                    </div>
                </div>
                
            </div>
            <Alert controller={controller} content='抱歉，请先登录' beforeClose={() => history.push('/user/login')} />
            <Modal controller={modalController} title='知情同意书' content={
                <div>
                    <p className='home-agree-title'>请您仔细阅读下述信息后勾选此栏目，以代表您同意并自愿参加此项检测：</p>
                    <div className='home-agree-content'>
                        <p>本检测通过分析肠道菌群的具体组成，可以了解人体阶段性的身体健康状况，同时还可以有针对性地进行饮食调整和益生菌/益生原的干预，以维持肠道菌群的微生态环境平衡，使人体保持健康状态。</p>
                        <p>本检测的流程为：收取采样工具盒 » 样品采集 » 样品回邮 » 实验处理 » 精准检测报告 » 个性化营养方案。</p>
                    </div>
                </div>
            }  />
        </>
    );
    
}

export default Home;