import React, { useRef, useState, useEffect } from 'react';
import Axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';

import './add.css';
import { host } from '../../_config';

import { slideUp } from '../../utils/slideUp';
import { getPreviousDay } from '../../utils/BIODate';
import { useSelector, useDispatch } from 'react-redux';
import * as BIO from '../../actions';

import Input from '../Input';
import AutoInput from '../AutoInput';
import Modal from '../Modal';
import Button from '../Button';

const Add = () => {
    // 路由
    const history = useHistory();
    // 提交反馈信息
    const [error, setError] = useState('');
    const [submit, setSubmit] = useState('提交');
    let [inputs, setInputs] = useState({
        first_name : '',
        last_name : '',
        email : '',
        height : '',
        weight : '',
        birthday : '',
        antibiotics : '',
        code : ''
    });
    let [defaultVal, setDefault] = useState();
    let [first, setFirst] = useState(true);
    let [testeeCode, setCode] = useState();
    let [codeError, setCodeErr] = useState('');
    // redux
    let sampleId = useSelector(state => state.add.sampleId);
    let user_id = useSelector(state => state.user.id);
    let token = useSelector(state => state.user.token);

    const dispatch = useDispatch();
    // ref
    const selectGenderRef = useRef();
    const selectBloodRef = useRef();
    const selectFoodRef = useRef();
    
    let controller = {};
    useEffect(() => slideUp(), []);

    const handleFirst = (begin, end) => {
        begin();
        Axios({
            method : 'GET',
            url : host + '/sample/person',
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            const { data } = _data;
            if(data.code === 'success'){
                dispatch({
                    type : BIO.ADD_SET_TESTEE_CODE,
                    data : data.data
                });
                setCode(data.data);
                end();
                controller.on('toggle');
            }
            else console.log(data.info);
        })
        .catch(error => end());
    }
    const handleAlready = (begin, end) => {
        begin();
        if(!inputs['code'].validated){
            setCodeErr('受测人编码不能为空。');
            setTimeout(() => {
                setCodeErr('');
                end();
            }, 2500);
            return false;
        }
        else{
            setCode(inputs.code.value);
            Axios({
                method : 'GET',
                url : host + '/sample/person',
                params : {
                    code : inputs.code.value
                },
                headers : {
                    'Content-Type' : 'application/json; charset=UTF-8'
                }
            }).then(_data => {
                const { data } = _data;
                if(data.code === 'success'){
                    dispatch({
                        type : BIO.ADD_SET_TESTEE_CODE,
                        data : data.data
                    });
                    setDefault(data.data);
                    end();
                    controller.on('toggle');
                }
                else console.log(data.info);
            })
            .catch(error => end());
        }
    }
    const handleSubmit = () => {
        if(submit !== '提交') return false;
        else setSubmit('请稍候');
        // 下拉框是一定有值的
        let gender = selectGenderRef.current.value,
            blood_type = selectBloodRef.current.value,
            meat_egetables = selectFoodRef.current.value;
        // check empty
        let validated = Object.keys(inputs).filter(v => {
            return !inputs[v].validated;
        });
        if(validated.length){
            setError('表单内容不合规范，请检查修改后再做提交。');
            setTimeout(() => {
                setError('');
                setSubmit('提交');
            }, 2500);
            return false;
        }
        else{
            let {last_name, first_name, birthday, height, weight, antibiotics, email} = inputs;
            let data = {
                last_name : last_name.value, first_name : first_name.value, birthday : birthday.value, height : height.value, 
                weight : weight.value, antibiotics : antibiotics.value, email : email.value,
                sample_id : sampleId,
                blood_type, meat_egetables, gender,
                isFirst : first, code : testeeCode
                // user_id,
            }
            Axios({
                method : 'POST',
                url : host + '/sample/bind',
                data : data,
                headers : {
                    'Content-Type' : 'application/json; charset=UTF-8'
                }
            }).then(_data => {
                const { data } = _data;
                if(data.code === 'error'){
                    setError(data.info);
                    setSubmit('失败');
                    setTimeout(() => {
                        setError('');
                        setSubmit('提交');
                    }, 3000)
                }
                else if(data.code === 'success'){
                    setSubmit('绑定成功');
                    setTimeout(() => {
                        history.push('/report/list');
                        dispatch({
                            type : BIO.ADD_SUCCESS
                        })
                    },3000)
                }
            })
            .catch(error => {
                setSubmit('提交');
                console.log(error)
            })
        }
    }
    return (
        <div className='add-container'>
            <div className='add-noti'>
                <p>为了更加准确、合理地为您提供建议，我们需要您如实填写下述信息。</p>
                <p>您本次送检的采样管编号为：<span className='add-noti-barcode'>{useSelector(state => state.add.barCode)}</span></p>
            </div>
            <div className='add-divide'></div>
            <div className='add-form'>
                <p className='add-label-container'><span className='add-label'>联系方式</span></p>
                <Input placeholder='请输入姓氏' label='姓' validateType='name' dataName='last_name' form={inputs} defaultValue={defaultVal} />
                <Input placeholder='请输入名字' label='名' validateType='name' dataName='first_name' form={inputs} defaultValue={defaultVal} />
                <Input type='email' placeholder='请输入电子邮箱' label='邮箱' validateType='email' dataName='email' form={inputs} defaultValue={defaultVal} />
                <p className='add-label-container'><span className='add-label'>基本信息</span></p>
                <div className='add-form-input'>
                    <label>性别</label>
                    <select className='add-form-inputs' ref={selectGenderRef}>
                        <option value='M'>男</option>
                        <option value='F'>女</option>
                    </select>
                </div>
                <Input type='number' placeholder='请输入身高' label='身高 / 厘米' validateType='height' dataName='height' form={inputs} defaultValue={defaultVal} />
                <Input type='number' placeholder='请输入体重' label='体重 / 公斤' validateType='weight' dataName='weight' form={inputs} defaultValue={defaultVal} />
                <Input type='date' label='生日' max={getPreviousDay()} dataName='birthday' form={inputs} defaultValue={defaultVal} />
                <div className='add-form-input'>
                    <label>血型</label>
                    <select className='add-form-inputs' ref={selectBloodRef}>
                        <option value='O'>O 型</option>
                        <option value='A'>A 型</option>
                        <option value='B'>B 型</option>
                        <option value='AB'>AB 型</option>
                        <option value='OTHER'>其他型 / 不详</option>
                    </select>
                </div>
                <p className='add-label-container'><span className='add-label'>近期状况</span></p>
                <div className='add-form-input'>
                    <label>饮食中肉食占比</label>
                    <select className='add-form-inputs' ref={selectFoodRef}>
                        <option value='0'>0% - 20%</option>
                        <option value='1'>20% - 40%</option>
                        <option value='2'>40% - 60%</option>
                        <option value='3'>60% - 80%</option>
                        <option value='4'>80% - 100%</option>
                    </select>
                </div>
                <AutoInput label='一周内服用过的抗生素' placeholder='如果不填写则代表没有服用' 
                    headers={{'Content-Type' : 'application/json; charset=UTF-8'}}
                    url={host + '/validate/antibiotics'}
                    keyName='name'
                    dataName='antibiotics' form={inputs} defaultValue={defaultVal} />
                <button className={submit !== '提交' ? 'add-form-btn disabled' : 'add-form-btn'} onClick={handleSubmit}>{submit}</button>
                <p className='add-form-error'>{error}</p>
            </div>
            <Modal controller={controller} slave={true} defaultVisible={true} title='受测人送样历史' content={
                <>
                    {first ? (<div className='add-checkCode'>
                        <span>受测试者是否首次送样？</span>
                        <Button withError={false} text='初次送样' click={handleFirst} controlledByFunc={true} />
                        <Button hollow={true} withError={false} text='不是初次送样' click={() => setFirst(false)} />
                    </div>) : (
                        <>
                            <Input type='number' label='受测人编码' placeholder='请输入受测人的编码' dataName='code' form={inputs} />
                            <Button text='下一步' click={handleAlready} errorText={codeError} controlledByFunc={true} />
                        </>
                    )}
                </>
            } />
        </div>
    );
}

export default Add;