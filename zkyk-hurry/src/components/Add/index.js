import React, { useRef, useState, useEffect } from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';

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
import { clone } from '../../utils/BIOObject';

const Add = () => {
    // 路由
    const history = useHistory();
    // 提交反馈信息
    const [error, setError] = useState('');
    const [submit, setSubmit] = useState('提交');
    let [inputs, setInputs] = useState({
        first_name: '',
        last_name: '',
        height: '',
        weight: '',
        birthday: '',
        antibiotics: ''
    });
    let [defaultVal, setDefault] = useState({
        person_id: '',
        last_name: '',
        first_name: '',
        birthday: ''
    });
    let [readonly, setReadonly] = useState({
        person_id: false,
        last_name: false,
        first_name: false,
        birthday: false
    })
    let [first, setFirst] = useState(true);
    let [testeeCode, setCode] = useState();
    let [codeError, setCodeErr] = useState('');
    let [contact, setContact] = useState();
    // redux
    let { sampleId } = useSelector(state => state.add);
    let { add } = useSelector(state => state.share);
    let user = useSelector(state => state.user);
    const dispatch = useDispatch();
    // ref
    const selectGenderRef = useRef();
    const selectBloodRef = useRef();
    const selectFoodRef = useRef();

    let controller = {};
    let modalResultController = {};

    useEffect(() => {
        slideUp();
        document.title = '信息填写';
        Axios({
            method: 'GET',
            url: host + '/user/operator/info',
            params: {
                'access-token': user.token,
                'access-code': add
            },
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            const { data } = _data;
            if (data.code === 'success') setContact(data.data);
            else { console.log(data.info); }
        })
        .catch(error => console.log(data.info));
    }, []);

    const handleFirst = (begin, end) => {
        begin();
        Axios({
            method: 'GET',
            url: host + '/sample/person',
            params: {
                'access-token': user.token,
                'access-code': add
            },
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            const { data } = _data;
            if (data.code === 'success') {
                dispatch({
                    type: BIO.ADD_SET_TESTEE_CODE,
                    data: data.data
                });
                setCode(data.data);
                end();
                controller.on('toggle');
            }
            else { end(); console.log(data.info); }
        })
        .catch(error => end());
    }
    const handleAlready = (begin, end) => {
        begin();
        if (!inputs.code || !inputs.code.validated) {
            setCodeErr('受测人编码不能为空。');
            setTimeout(() => {
                setCodeErr('');
                end();
            }, 2500);
            return false;
        }
        else {
            setCode(inputs.code.value);
            Axios({
                method: 'GET',
                url: host + '/sample/person',
                params: {
                    code: inputs.code.value,
                    'access-token': user.token,
                    'access-code': add
                },
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            }).then(_data => {
                const { data } = _data;
                if (data.code === 'success') {
                    setDefault(data.data);
                    // 下拉框
                    selectBloodRef.current.value = data.data.blood_type;
                    selectGenderRef.current.value = data.data.gender;
                    // 设置 readonly
                    setReadonly({
                        person_id: true,
                        last_name: true,
                        first_name: true,
                        birthday: true
                    });
                    selectBloodRef.current.disabled = 'disabled';
                    selectGenderRef.current.disabled = 'disabled';
                    selectBloodRef.current.classList.add('readonly');
                    selectGenderRef.current.classList.add('readonly');
                    end();
                    controller.on('toggle');
                }
                else {
                    setCodeErr(data.info);
                    setTimeout(() => {
                        setCodeErr('');
                        end();
                    }, 2500);
                };
            }).catch(error => end());
        }
    }
    const handleSubmit = () => {
        if (submit !== '提交') return false;
        else setSubmit('请稍候');

        let gender = selectGenderRef.current.value,
            blood_type = selectBloodRef.current.value,
            meat_egetables = selectFoodRef.current.value;
        let { last_name, first_name, birthday, height, weight, antibiotics } = inputs;
        let data = {
            last_name: last_name.value, first_name: first_name.value, birthday: birthday.value, height: height.value,
            weight: weight.value, antibiotics: antibiotics.value,
            sample_id: sampleId,
            blood_type, meat_egetables, gender,
            isFirst: first, code: testeeCode
        }
        Axios({
            method: 'POST',
            url: host + '/sample/bind',
            data: data,
            params: {
                'access-token': user.token,
                'access-code': add
            },
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(_data => {
            const { data } = _data;
            if (data.code === 'error') {
                setError(data.info);
                setSubmit('错误');
                setTimeout(() => {
                    setError('');
                    setSubmit('提交');
                }, 2500)
            }
            else if (data.code === 'success') {
                setSubmit('提交成功，即将跳转');
                setTimeout(() => {
                    add ? history.push('/') : history.push('/report/list');
                    dispatch({
                        type: BIO.ADD_SUCCESS
                    })
                }, 3000)
            }
        }).catch(error => setSubmit('提交'));
    }
    const handleClick = (begin, end) => {
        begin();
        // check empty
        let validated = Object.keys(inputs).filter(v => {
            return !inputs[v].validated;
        });
        if (validated.length) {
            setError('表单内容有缺失或不合规范，请检查修改后再做提交。');
            setTimeout(() => {
                setError('');
                end();
            }, 2500);
            return false;
        }
        else{
            setInputs(clone(inputs));
            modalResultController.on('toggle');
            end();
        } 
    }
    const mapResultInfo = {
        'M' : '男',
        'F' : '女',
        'O' : 'O',
        'A' : 'A',
        'B' : 'B',
        'AB' : 'AB',
        'OTHER' : '其他',
        '0' : '0% - 20%',
        '1' : '20% - 40%',
        '2' : '40% - 60%',
        '3' : '60% - 80%',
        '4' : '80% - 100%'
    }
    return (
        <div className='add-container'>
            <div className='add-noti'>
                <p>为了更加准确、合理地为受测人提供建议，请受测人如实填写下述信息。</p>
                <p>您本次送检的采样管编号为：<span className='add-noti-barcode'>{useSelector(state => state.add.barCode)}</span></p>
                { contact ? (<p>业务员名称：<span className='add-noti-username'>{contact?.username}</span>，联系方式为：<span className='add-noti-email'>{contact?.contact}</span></p>) : null}
            </div>
            <div className='add-divide'></div>
            <div className='add-form'>
                <p className='add-label-container'><span className='add-label'>受测人基本信息</span></p>
                <Input placeholder='请输入姓氏' label='姓' validateType='name' dataName='last_name' form={inputs} defaultValue={defaultVal} readOnly={readonly.last_name} />
                <Input placeholder='请输入名字' label='名' validateType='name' dataName='first_name' form={inputs} defaultValue={defaultVal} readOnly={readonly.first_name} />
                <div className='add-form-input'>
                    <label>性别</label>
                    <select className='add-form-inputs' ref={selectGenderRef}>
                        <option value='M'>男</option>
                        <option value='F'>女</option>
                    </select>
                </div>
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
                <Input type='date' label='生日' max={getPreviousDay()} dataName='birthday' form={inputs} defaultValue={defaultVal} readOnly={readonly.birthday} />
                <p className='add-label-container'><span className='add-label'>受测人近期状况</span></p>
                <Input type='number' placeholder='请输入身高' label='身高 / 厘米' validateType='height' dataName='height' form={inputs} defaultValue={defaultVal} />
                <Input type='number' placeholder='请输入体重' label='体重 / 公斤' validateType='weight' dataName='weight' form={inputs} defaultValue={defaultVal} />
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
                <Button text='下一步' click={handleClick} loading={true} contract={true} errorText={error} controlledByFunc={true} />
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
            <Modal controller={modalResultController} title='信息确认' content={
                inputs.last_name.value ? (<>
                    <div className='add-info-check'>
                        <p className='add-info-name'><span>{inputs.last_name.value + inputs.first_name.value}</span><span>{mapResultInfo[selectGenderRef?.current?.value]}</span></p>
                        <p>生日：{inputs.birthday.value}</p>
                        <p>血型：{mapResultInfo[selectBloodRef?.current?.value]}型</p>
                        <p className='add-info-other'><span>身高：{inputs.height.value}厘米</span><span>体重：{inputs.weight.value}公斤</span></p>
                        <p>饮食中肉食占比：{mapResultInfo[selectFoodRef?.current?.value]}</p>
                        {inputs.antibiotics.value ? (<p>一周内服用过的抗生素：{inputs.antibiotics.value}</p>) : null}
                    </div>
                    <button className={submit !== '提交' ? 'add-form-btn disabled' : 'add-form-btn'} onClick={handleSubmit}>{submit}</button>
                    <p className='add-form-error'>{error}</p>
                </>) : null
            } onClose={() => setSubmit('提交')} />
        </div>
    );
}

export default Add;