import React, { useEffect, useState } from 'react';
import Taro, { atMessage, useDidShow } from '@tarojs/taro';
import { View, Text, Picker } from '@tarojs/components';
import { useSelector, useDispatch } from 'react-redux';
import { AtInput, AtList, AtListItem, AtButton, AtFloatLayout, AtMessage, AtCurtain, AtCheckbox, AtRadio } from 'taro-ui';
import Title from '../../component/Title';

import nationJSON from '../../resource/nation.json';
import cityJSON from '../../resource/pc.json';
import { getNow } from '../../utils/BIODate';
import { clone } from '../../utils/BIOObject';
import { BIOValidate } from '../../utils/BIOValidate';
import { host } from '../../config';
import * as BIO from '../../actions';

import './questionnaire.css';




const CustomCheckbox = ({ name, checkbox, descrition = [], noneValue = 'none', handleUpdateValue }) => {
    const [ isOpened, setOpened ] = useState(false);
    const [ selected, setSelected ] = useState([]);
    const [ desc, setDesc ] = useState([]);
    const [ value, setValue ] = useState('');
    const [ current, setCurrent ] = useState('');

    const handleSetDesc = () => {
        if (!value) Taro.atMessage({
            type: 'warning',
            message: '请填写详细信息'
        })
        else {
            const newDesc = [ ...desc ];
            const newSelected = [ ...selected ];
            newDesc.push({
                type: current,
                desc: value
            });
            newSelected.push(current);
            setSelected(newSelected);
            setDesc(newDesc);

            setValue('');
            setOpened(false);
        }
    }
    const handleUpdateSelect = item => {
        if (item.length > selected.length) {
            const current = item.pop();
            if (current) setCurrent(current);
        }
        else {
            setSelected(item);
            setCurrent('');

            const current = selected.filter(v => item.indexOf(v) === -1);
            const newDesc = [ ...desc ];
            current.forEach(v => {
                const i = newDesc.findIndex(d => d.type === v);
                if (i >= 0) newDesc.splice(i, 1);
                setDesc(newDesc);
            })
        }
    }
    const handleFloatClose = () => {
        setValue('');
        setCurrent('');
        setOpened(false);
    }

    useEffect(() => {
        if (!current) return;
        if (current === noneValue) {
            setSelected([noneValue]);
            setDesc([]);
        }
        else {
            if (selected.find(v => v === noneValue)) setSelected(selected.filter(v => v !== noneValue));

            if (descrition.some(v => v === current) && !desc.some(v => v.type === current)) setOpened(true);
            else {
                const newSelected = [ ...selected ];
                newSelected.push(current);
                setSelected(newSelected);
            }
        }
    }, [current]);
    useEffect(() => {
        const result = selected.map(v => {
            const item = desc.find(i => i.type === v);
            if (item) return item;
            else return { type: v, desc: ''};
        })
        handleUpdateValue(result);
        // console.log(selected, desc, result)
    }, [selected, desc]);

    return (
        <>
            <AtMessage />
            <AtCheckbox options={checkbox} selectedList={selected} onChange={item => handleUpdateSelect(item)} />
            <AtFloatLayout title='请补充详细信息' isOpened={isOpened} onClose={handleFloatClose}>
                <AtInput name={name} value={value} placeholder='请描述具体信息' onChange={value => setValue(value)} />
                <View className='question-float-btn-container'>
                    <AtButton className='question-float-btn' circle type='secondary' onClick={handleFloatClose}>重新选择</AtButton>
                    <AtButton className='question-float-btn' circle type='primary' onClick={handleSetDesc}>确定</AtButton>
                </View>
            </AtFloatLayout>
        </>
    );
}

const CustomRadio = ({ name, radio, descrition = '', handleUpdateValue }) => {
    const [ isOpened, setOpened ] = useState(false);
    const [ selected, setSelected ] = useState('');
    const [ desc, setDesc ] = useState('');
    const [ value, setValue ] = useState('');

    
    const handleSetDesc = () => {
        if (!desc) Taro.atMessage({
            type: 'warning',
            message: '请填写详细信息'
        })
        else {
            const item = radio.find(v => v.value === value);
            // const result = item.label + desc;
            const result = desc;
            setOpened(false);
            setSelected(value);
            setDesc('');
            handleUpdateValue(result);
        }
    }
    
    const handleFloatClose = () => {
        setValue('')
        setDesc('');
        setOpened(false);
    }

    useEffect(() => {
        if (value) {
            if (descrition === value) {
                setOpened(true);
            }
            else {
                const item = radio.find(v => v.value === value);
                const result = item.label;
                setSelected(value);
                handleUpdateValue(result);
            }
        }
    }, [value])
    return (
        <>
            <AtMessage />
            <AtRadio options={radio} value={selected} onClick={value => setValue(value)} />
            <AtFloatLayout title='请补充详细信息' isOpened={isOpened} onClose={handleFloatClose}>
                <AtInput name={name} value={desc} placeholder='请描述具体信息' onChange={text => setDesc(text)} />
                <View className='question-float-btn-container'>
                    <AtButton className='question-float-btn' type='secondary' circle onClick={handleFloatClose}>重新选择</AtButton>
                    <AtButton className='question-float-btn' type='primary' circle onClick={handleSetDesc}>确定</AtButton>
                </View>
            </AtFloatLayout>
        </>
    );
}


const CustomForm = () => {
    const dispatch = useDispatch();

    let user = useSelector(state => state.user);
    let guide = useSelector(state => state.guide);
    let add = useSelector(state => state.add);

    const maper = {
        gender: {
            '男' : 'M',
            '女' : 'F'
        }
    }
    const picker = {
        gender: ['男', '女'],
        nation: nationJSON.map(v => v.name),
    }
    const checkbox = {
        teeth: {
            list: [
                { value: 'none', label: '无' },
                { value: 'sensitive', label: '牙齿敏感（需补充信息）' },
                { value: 'ache', label: '牙痛（需补充信息）' },
                { value: 'periodontal', label: '牙周病（牙龈出血、牙龈炎、牙周炎）' },
                { value: 'odor', label: '口腔异味' },
                { value: 'ulcers', label: '口腔溃疡' },
                { value: 'other', label: '其他口腔问题（需补充信息）' },
            ],
            descrition: ['sensitive', 'ache', 'other']
        },
        food: {
            list: [
                { value: 'vegetarian', label: '素食为主' },
                { value: 'meat', label: '红肉/加工输入摄入频率高' },
                { value: 'balance', label: '均衡饮食' },
                { value: 'other', label: '其他（需补充信息）'  }
            ],
            descrition: ['other']
        },
        habit: {
            list: [
                { value: 'none', label: '无' },
                { value: 'alcohol', label: '饮酒，频率 1 月（__）次' },
                { value: 'smoke', label: '吸烟，1 天（__）根' },
                { value: 'pill', label: '长期服药'  },
                { value: 'drinks', label: '碳酸饮料' },
                { value: 'tea', label: '茶' },
                { value: 'coffee', label: '咖啡' },
            ],
            descrition: ['alcohol', 'smoke']
        }
    }
    const radio = {
        caries: [
            { value: '0', label: '0 颗' },
            { value: '1', label: '1 颗' },
            { value: '2', label: '2 颗' },
            { value: '3', label: '3 颗' },
            { value: '4+', label: '4 颗及以上' },
        ],
        toothbrush: [
            { value: '0', label: '普通牙刷' },
            { value: '1', label: '电动牙刷' },
            { value: '2', label: '其他（需补充信息）' },
        ],
        brushFrequency: [
            { value: '1', label: '1 次' },
            { value: '2', label: '2 次' },
            { value: '3+', label: '3 次及以上' },
        ],
        eatBeforeSleep: [
            { value: 'true', label: '是' },
            { value: 'false', label: '否' },
        ],
        stayUp: [
            { value: 'non', label: '无' },
            { value: 'seldom', label: '很少' },
            { value: 'often', label: '经常' },
        ],
        antibiotic: [
            { value: 'non', label: '无' },
            { value: 'have', label: '有，抗生素类型为（__）' },
        ],
        probiotic: [
            { value: 'non', label: '无' },
            { value: 'have', label: '有，益生菌类型为（__）' },
        ],
        drug: [
            { value: 'non', label: '无' },
            { value: 'have', label: '有，药物种类为（__）' },
        ]
    }
    
    const [testee, setTestee] = useState({
        isFirst : true,
        testeeCode : ''
    });
    const [ cityPicker, setCityPicker ] = useState({
        city_p: Object.keys(cityJSON),
        city_c: []
    });
    const [ form, setForm ] = useState({
        name: '',
        gender: '',
        age: '',
        nation: '',
        height: '',
        weight: '',
        city_p: '北京市',
        city_c: '东城区',
        tel: '',
        org: '',
        // code: '',
        date: '',
        teeth: [],
        caries: '',
        toothbrush: '',
        food: [],
        habit: [],
        eatBeforeSleep: '',
        stayUp: '',
        antibiotic: '',
        probiotic: '',
        drug: ''
    });
    const [ submiting, setSubmiting ] = useState(false);

    const handleValueChange = (value, name) => {
        const newForm = { ...form };
        newForm[name] = value;
        setForm(newForm);
    }
    const handleSetPickerValue = (e, name) => { 
        const index = e.detail.value;
        const newForm = { ...form };
        newForm[name] = picker[name][index];
        setForm(newForm);
    }
    const handleSetDatePickerValue = e => {
        const date = e.detail.value;
        setForm({ ...form, date});
    }
    const handleSetCityPickerValue = e => {
        const [ p_index, c_index ] = e.detail.value;
        const city_p = Object.keys(cityJSON)[p_index];
        const city_c = cityJSON[city_p][c_index];
        setForm({
            ...form,
            city_p,
            city_c,
        })
    }
    const handleSetCityPicker = e => {
        const { column, value } = e.detail;
        if (column === 0) setCityPicker({ ...cityPicker, city_c: cityJSON[cityPicker.city_p[value]] })
    }

    const handleSubmit = form => {
        console.log('表单内容：', form);
        setSubmiting(true);
        Taro.request({
            url : host() + '/sample/bind?access-token=' + user.token + '&access-code=' + guide.add.code,
            method : 'POST',
            data : form,
            header : {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let { data } = res;
            if(data.code === 'success'){
                Taro.atMessage({
                    type : 'success',
                    message : '绑定成功',
                    duration : 2000
                })
                dispatch({
                    type : BIO.ADD_SUCCESS
                });
                setTimeout(() => {
                    setSubmiting(false);
                    Taro.navigateBack();
                }, 2000)
            }
            else {
                Taro.atMessage({
                    type : 'error',
                    message : data.info,
                    duration : 2500
                });
                setSubmiting(false);
            }
        }).catch(e => console.log(e));
    }

    const handleSubmitForm = () => {
        const validateData = [
            {data : form.name, type : BIOValidate.TYPE.NAME, info: '请输入有效的姓名'},
            {data : form.age, type : BIOValidate.TYPE.AGE},
            {data : form.height, type : BIOValidate.TYPE.HEIGHT},
            {data : form.weight, type : BIOValidate.TYPE.WEIGHT},
            {data : form.tel, type : BIOValidate.TYPE.TEL},
            {data : form.org, type : BIOValidate.TYPE.TEXT, info: '请输入有效的送检机构'},
            {data : form.tel, type : BIOValidate.TYPE.TEL},
            // {data : form.code, type: BIOValidate.TYPE.TEXT, info: '请输入有效的样本编号'},
            {data : form.tel, type : BIOValidate.TYPE.TEL},
            {data : form.code, type: BIOValidate.TYPE.TEXT, info: '请输入有效的样本编号'},
        ]
        const validated = BIOValidate.validate(validateData);
        if (!validated.validated) Taro.atMessage({
            type : 'error',
            message : validated.info,
            duration : 2500
        })
        else {
            let select = ['teeth', 'food', 'habit'].filter(v => !form[v].length);
            let radio = ['caries', 'toothbrush', 'eatBeforeSleep', 'stayUp', 'antibiotic', 'probiotic', 'drug'].filter(v => !form[v]);
            let picker = ['gender', 'date', 'nation'].filter(v => !form[v]);
            
            if (select.length) Taro.atMessage({
                type : 'error',
                message : '请检查多选问题是否全部选择',
                duration : 2500
            })
            else if (radio.length) Taro.atMessage({
                type : 'error',
                message : '请检查单选问题是否全部选择',
                duration : 2500
            })
            else if (picker.length) Taro.atMessage({
                type : 'error',
                message : '请检查下拉框是否全部选择',
                duration : 2500
            })
            if (!select.length && !radio.length) {
                handleSubmit({
                    ...form,
                    code : testee.testeeCode,
                    isFirst : testee.isFirst,
                    sample_id : add.sampleId,
                    // 更改映射
                    gender: maper.gender[form.gender]
                });
            }
        }
    }

    useEffect(() => {
        setCityPicker({ ...cityPicker, city_c: cityJSON[form.city_p] });
    }, [form.city_p]);

    return (
        <>
            <CustomCurtain testee={testee} handleUpdateTestee={v => setTestee(v)} form={form} updateForm={v => setForm(v)} />
            <Title text='个人信息' />
            <AtInput name='name' title='姓名' value={form.name} type='text' required placeholder='请输入姓名' maxlength={5} onChange={value => handleValueChange(value, 'name')} />
            <Picker mode='selector' range={picker.gender} onChange={e => handleSetPickerValue(e, 'gender')}>
                <AtList className='add-picker-list'>
                    <AtListItem
                        title='性别'
                        extraText={form.gender}
                    />
                </AtList>
            </Picker>
            <AtInput name='age' title='年龄' value={form.age} type='number' required placeholder='请输入年龄' onChange={value => handleValueChange(value, 'age')} />
            <Picker mode='selector' range={picker.nation} onChange={e => handleSetPickerValue(e, 'nation')}>
                <AtList className='add-picker-list'>
                    <AtListItem
                        title='民族'
                        extraText={form.nation}
                    />
                </AtList>
            </Picker>
            <AtInput name='height' title='身高 CM' value={form.height} type='digit' required placeholder='请输入身高' onChange={value => handleValueChange(value, 'height')} />
            <AtInput name='weight' title='体重 KG' value={form.weight} type='digit' required placeholder='请输入体重' onChange={value => handleValueChange(value, 'weight')} />
            <Picker mode='multiSelector' range={[cityPicker.city_p, cityPicker.city_c]} onColumnChange={handleSetCityPicker} onChange={handleSetCityPickerValue}>
                <AtList className='question-picker-list'>
                    <AtListItem
                        title='长期居住城市'
                        extraText={`${form.city_p}${form.city_c}`}
                    />
                </AtList>
            </Picker>
            <AtInput name='tel' title='电话号码' value={form.tel} type='phone' required placeholder='请输入电话号码' onChange={value => handleValueChange(value, 'tel')} />
            <Title text='样本信息' />
            <AtInput name='org' title='送检机构' value={form.org} type='text' required placeholder='请输入送检机构' onChange={value => handleValueChange(value, 'org')} />
            {/* <AtInput name='code' title='样本编号' value={form.code} type='text' required placeholder='请输入样本编号' onChange={value => handleValueChange(value, 'code')}  /> */}
            <Picker mode='date' onChange={e => handleSetDatePickerValue(e, 'date')} end={getNow()}>
                <AtList>
                    <AtListItem title='采集日期' extraText={form.date} />
                </AtList>
            </Picker>
            <Title text='既往情况' />
            <View>
                <Text className='question-label'>您是否被以下口腔问题所困扰：</Text>
                <CustomCheckbox name='teeth' checkbox={checkbox.teeth.list} descrition={checkbox.teeth.descrition} handleUpdateValue={result => handleValueChange(result, 'teeth')} />
            </View>
            <View>
                <Text className='question-label'>目前有几颗龋齿：</Text>
                <CustomRadio name='caries' radio={radio.caries} handleUpdateValue={result => handleValueChange(result, 'caries')} />
            </View>
            <View>
                <Text className='question-label'>您使用的电动牙刷类型：</Text>
                <CustomRadio name='toothbrush' radio={radio.toothbrush} descrition='2' handleUpdateValue={result => handleValueChange(result, 'toothbrush')} />
            </View>
            <View>
                <Text className='question-label'>您通常一天刷牙的次数：</Text>
                <CustomRadio name='brushFrequency' radio={radio.brushFrequency} handleUpdateValue={result => handleValueChange(result, 'brushFrequency')} />
            </View>
            <View>
                <Text className='question-label'>饮食习惯：</Text>
                <CustomCheckbox name='food' checkbox={checkbox.food.list} descrition={checkbox.food.descrition} handleUpdateValue={result => handleValueChange(result, 'food')} />
            </View>
            <View>
                <Text className='question-label'>频率较高的生活习惯：</Text>
                <CustomCheckbox name='habit' checkbox={checkbox.habit.list} descrition={checkbox.habit.descrition} handleUpdateValue={result => handleValueChange(result, 'habit')} />
            </View>
            <View>
                <Text className='question-label'>您是否喜欢睡前进食：</Text>
                <CustomRadio name='eatBeforeSleep' radio={radio.eatBeforeSleep} handleUpdateValue={result => handleValueChange(result, 'eatBeforeSleep')} />
            </View>
            <View>
                <Text className='question-label'>是否有熬夜、昼夜颠倒等习惯：</Text>
                <CustomRadio name='stayUp' radio={radio.stayUp} handleUpdateValue={result => handleValueChange(result, 'stayUp')} />
            </View>
            <View>
                <Text className='question-label'>近一个月抗生素使用：</Text>
                <CustomRadio name='antibiotic' radio={radio.antibiotic} descrition='have' handleUpdateValue={result => handleValueChange(result, 'antibiotic')} />
            </View>
            <View>
                <Text className='question-label'>近一个月是否服用过益生菌：</Text>
                <CustomRadio name='probiotic' radio={radio.probiotic} descrition='have' handleUpdateValue={result => handleValueChange(result, 'probiotic')} />
            </View>
            <View>
                <Text className='question-label'>近一个月是否服用过药物：</Text>
                <CustomRadio name='drug' radio={radio.drug} descrition='have' handleUpdateValue={result => handleValueChange(result, 'drug')} />
            </View>
            <AtButton loading={submiting} className='question-button' customStyle={{ margin: '1rem 0' }} circle type='primary' onClick={handleSubmitForm}>提交表单</AtButton>
        </>
    );
}

const CustomCurtain = ({ testee, handleUpdateTestee, form, updateForm }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const guide = useSelector(state => state.guide);
    
    const [curtainOpen, setCurtainOpen] = useState(true);
    const [submitBtnLoading, setSubmitBtnLoading] = useState(false)

    const maper = {
        gender: {
            'M' : '男',
            'F' : '女'
        }
    }
    const br = '\n';
    const handleCloseCurtain = () => {
        setCurtainOpen(false);
        Taro.navigateBack();
    }
    const handleFirst = () => {
        setSubmitBtnLoading(true);
        Taro.request({
            url : host() + '/sample/person',
            method : 'GET',
            data : {
                'access-token' : user.token,
                'access-code' : guide.add.code
            },
            header : {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let {data} = res;
            if(data.code === 'success'){
                dispatch({
                    type : BIO.ADD_SET_TESTEE_CODE,
                    data : data.data
                });
                handleUpdateTestee({ ...testee, testeeCode: data.data });
                setCurtainOpen(false);
                Taro.atMessage({
                    type : 'info',
                    message : '正在为新的受测人填写信息',
                    duration : 2500
                });
            }
            else Taro.atMessage({
                type : 'error',
                message : data.info,
                duration : 2500
            })
            setSubmitBtnLoading(false);
        })
        .catch(e => console.log(e))
    }
    const handleAlready = () => {
        Taro.request({
            url : host() + '/sample/person',
            method : 'GET',
            data : {
                'access-token' : user.token,
                'access-code' : guide.add.code,
                code : testee.testeeCode
            },
            header : {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let {data} = res;
            if(data.code === 'success'){
                console.log(data.data)
                // 赋默认值
                const { gender, height, weight } = data.data;
                updateForm({
                    ...form,
                    gender: maper.gender[gender],
                    height, weight,
                });
                // not first
                handleUpdateTestee({ ...testee, isFirst: false });
                Taro.atMessage({
                    type : 'success',
                    message : '受测人信息导入成功',
                    duration : 2500
                })
                setCurtainOpen(false);
            }
            else Taro.atMessage({
                type : 'error',
                message : data.info,
                duration : 2500
            })
        })
        .catch(e => console.log(e))
    }
    const handleSelectClick = () => {
        if(testee.testeeCode && testee.testeeCode.length > 0) handleAlready();
        else handleFirst();
    }

    return (
        <AtCurtain isOpened={curtainOpen} onClose={handleCloseCurtain} closeBtnPosition='top-right'>
            <View className='question-check'>
                <View className='question-check-info'>
                    <Text className='bold'>首次送样</Text>，请直接点击下一步按钮。<Text>{br}</Text>
                    <Text className='bold'>不是首次送样</Text>，请在下方输入受测人编码。<Text>{br}</Text>
                    如需返回上一步，请关闭弹窗。
                </View>
                <View className='question-check-input'>
                    <AtInput name='first' title='受测人编码' type='number' placeholder='请输入编码' value={testee.testeeCode} onChange={(value) => handleUpdateTestee({ ...testee, testeeCode: value })} />
                    <AtButton customStyle={{marginTop : '1rem'}} type='primary' circle
                        onClick={handleSelectClick}
                        loading={submitBtnLoading} disabled={submitBtnLoading}
                    >下一步</AtButton>
                </View>
            </View>
        </AtCurtain>
    );
}

export default () => {
    return (
        <>
            <AtMessage />
            <View className='question-container'>
                <View className='question-noti'>
                    <View>为了更加准确、合理地为受测人提供建议，请受测人如实填写下述信息。</View>
                </View>
                <CustomForm />
            </View>
        </>
    );
}