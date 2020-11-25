import React, { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Picker } from '@tarojs/components';
import { useSelector, useDispatch } from 'react-redux';
import { AtInput, AtList, AtListItem, AtButton, AtFloatLayout, AtMessage, AtCurtain } from 'taro-ui';
import { clone, checkEmpty } from '../../utils/BIOObject';
import './add.css';
import * as BIO from '../../actions';
import { host } from '../../config';
import { getNow, getPreviousDay } from '../../utils/BIODate';

const Add = () => {
    const dispatch = useDispatch()

    let user = useSelector(state => state.user)
    let add = useSelector(state => state.add)

    let [curtainOpen, setCurtainOpen] = useState(true)
    let [testee, setTestee] = useState({
        isFirst : true,
        testeeCode : ''
    })
    let [contact, setContact] = useState('')
    let [addBasicInfo, setAddBasicInfo] = useState({
        last_name : '',
        first_name : ''
    })
    let [addOtherInfo, setAddOtherInfo] = useState({
        height : '',
        weight : '',
        antibiotics : ''
    })
    let [addPicker, setAddPicker] = useState({
        gender : {
            selector : ['男', '女'],
            selectorChecked : '男'
        },
        bloodType : {
            selector : ['O型', 'A型', 'B型', 'AB型', '其他'],
            selectorChecked : 'O型'
        },
        birthday : getPreviousDay(),
        meatEgetable : {
            selector : ['0% - 20%', '20% - 40%', '40% - 60%', '60% - 80%', '80% - 100%'],
            selectorChecked : '0% - 20%'
        },
    })
    let [layoutOpened, setLayoutOpened] = useState(false)
    let [searchResult, setSearchResult] = useState([])
    let [submitBtnLoading, setSubmitBtnLoading] = useState(false)

    useEffect(() => {
        Taro.request({
            url : host + '/user/operator/info',
            method : 'GET',
            data : {
                'access-token' : user.token
            },
            header : { 
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let { data } = res;
            if(data.code === 'success') setContact(data.data);
            else console.log(data.info)
        })
        .catch(e => console.log(e))
    }, [])

    const handleSetTesteeValue = (value, dataName) => {
        let _testee = clone(testee);
        _testee[dataName] = value;
        setTestee(_testee);
    }
    const handleSetBasicValue = (value, dataName) => {
        let basicInfo = clone(addBasicInfo);
        basicInfo[dataName] = value;
        setAddBasicInfo(basicInfo);
    }
    const handleSetOtherValue = (value, dataName) => {
        let otherInfo = clone(addOtherInfo);
        otherInfo[dataName] = value;
        setAddOtherInfo(otherInfo);
    }
    const handleSetPickerValue = (e, type) => {
        let value = e.detail.value;
        let picker = clone(addPicker);
        if(type === 'birthday') picker[type] = value;
        else picker[type].selectorChecked = picker[type].selector[value];
        setAddPicker(picker);
    }
    const handleGoNext = () => {
        let data = {
            ...addBasicInfo,
            ...addOtherInfo,
            gender : addPicker.gender.selectorChecked,
            bloodType : addPicker.bloodType.selectorChecked,
            birthday : addPicker.birthday
        }
        console.log(data)
        if(checkEmpty(data)) Taro.atMessage({
            type : 'error',
            message : '请确认信息是否填写完整',
            duration : 2500
        })
        else setLayoutOpened(true);
    }
    const handleSearch = (name) => {
        Taro.request({
            url : host + '/validate/antibiotics',
            method : 'GET',
            data : name,
            header : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let {data} = res;
            if(data.code === 'success'){}
        })
    }
    const handleSubmit = () => {
        let data = {
            ...addBasicInfo,
            ...addOtherInfo,
            gender : addPicker.gender.selectorChecked,
            bloodType : addPicker.bloodType.selectorChecked,
            birthday : addPicker.birthday
        }
        Taro.request({
            url : host + '/sample/bind?access-token=' + user.token,
            method : 'POST',
            data : data,
            header : {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let {data} = res;
            if(data.code === 'success'){
                Taro.atMessage({
                    type : 'success',
                    message : '绑定成功',
                    duration : 2500
                })
                setTimeout(() => {
                    // Taro.navigateBack();
                }, 2500)
                dispatch({
                    type : BIO.ADD_SUCCESS
                })
            }
            else Taro.atMessage({
                type : 'error',
                message : data.info,
                duration : 2500
            })
        })
    }


    return (
        <View className='add-container'>
            <AtCurtain isOpened={curtainOpen} onClose={() => setCurtainOpen(false)}>
                <View className='add-check'>
                    <View className='add-check-info'>请在下方输入受测人编码。如果受测人首次送样，则请关闭该弹窗。</View>
                    <View className='add-check-input'>
                        <AtInput name='first' title='受测人编码' type='number' placeholder='请输入编码' value={testee.testeeCode} onChange={(value) => handleSetTesteeValue(value, 'testeeCode')} />
                        <AtButton customStyle={{marginTop : '1rem'}} type='primary' circle onClick={() => console.log('sd')}>下一步</AtButton>
                    </View>
                </View>
            </AtCurtain>
            <AtMessage />
            <View className='add-noti'>
                <View>为了更加准确、合理地为受测人提供建议，请受测人如实填写下述信息。</View>
                <View>您本次送检的采样管编号为：<Text className='add-noti-barcode'>{add.barCode}</Text></View>
                { contact ? (<View>业务员名称：<Text className='add-noti-username'>{contact?.username}</Text>，联系方式为：<Text className='add-noti-email'>{contact?.contact}</Text></View>) : null}
            </View>
            <View className='add-title'><Text className='text'>受测人基本信息</Text></View>
            <AtInput name='last_name' required title='姓' maxlength='3' placeholder='请输入姓氏' value={addBasicInfo.last_name} onChange={(value) => handleSetBasicValue(value, 'last_name')} />
            <AtInput name='first_name' required title='名' maxlength='3' placeholder='请输入名字' value={addBasicInfo.first_name} onChange={(value) => handleSetBasicValue(value, 'first_name')} />
            <Picker mode='selector' range={addPicker.gender.selector}
              className='add-picker' onChange={(e) => handleSetPickerValue(e, 'gender')}
            >
                <AtList className='add-picker-list'>
                    <AtListItem 
                      title='性别'
                      extraText={addPicker.gender.selectorChecked}
                    />
                </AtList>
            </Picker>
            <Picker mode='selector' range={addPicker.bloodType.selector}
              className='add-picker' onChange={(e) => handleSetPickerValue(e, 'bloodType')}
            >
                <AtList className='add-picker-list'>
                    <AtListItem 
                      title='血型'
                      extraText={addPicker.bloodType.selectorChecked}
                    />
                </AtList>
            </Picker>
            <Picker mode='date' className='add-picker'
              onChange={(e) => handleSetPickerValue(e, 'birthday')}
              end={getNow()}
            >
                <AtList className='add-picker-list'>
                    <AtListItem 
                      title='生日'
                      extraText={addPicker.birthday}
                    />
                </AtList>
            </Picker>
            <View className='add-title'><Text className='text'>受测人近期状况</Text></View>
            <AtInput name='height' required title='身高' placeholder='请输入身高' type='digit' value={addOtherInfo.height} onChange={(value) => handleSetOtherValue(value, 'height')} />
            <AtInput name='weight' required title='体重' placeholder='请输入体重' type='digit' value={addOtherInfo.weight} onChange={(value) => handleSetOtherValue(value, 'weight')} />
            <Picker mode='selector' range={addPicker.meatEgetable.selector}
              className='add-picker' onChange={(e) => handleSetPickerValue(e, 'meatEgetable')}
            >
                <AtList className='add-picker-list'>
                    <AtListItem 
                      title='饮食中肉食占比'
                      extraText={addPicker.meatEgetable.selectorChecked}
                    />
                </AtList>
            </Picker>
            <AtInput name='antibiotics' required title='服用过的抗生素' placeholder='一周内服用过的抗生素' value={addOtherInfo.antibiotics} onChange={(value) => handleSetOtherValue(value, 'antibiotics')} />
            <AtButton customStyle={{margin : '1rem 0'}} circle type='secondary' onClick={handleGoNext}>下一步</AtButton>
            <AtFloatLayout isOpened={layoutOpened} title='受测人信息确认' onClose={() => setLayoutOpened(false)}>
                <View className='add-info-check'>
                    <View className='add-info-name'>
                        <View>{addBasicInfo.last_name + addBasicInfo.first_name}</View>
                        <View>{addPicker.gender.selectorChecked}</View>
                    </View>
                    <View>生日：{addPicker.birthday}</View>
                    <View>血型：{addPicker.bloodType.selectorChecked}</View>
                    <View className='add-info-other'><Text>身高：{addOtherInfo.height}厘米</Text><Text>体重：{addOtherInfo.weight}公斤</Text></View>
                    <View>饮食中肉食占比：{addPicker.meatEgetable.selectorChecked}</View>
                    {addOtherInfo.antibiotics ? (<View>一周内服用过的抗生素：{addOtherInfo.antibiotics}</View>) : null}
                </View>
                <AtButton className='add-submit-btn' circle type='primary' onClick={handleSubmit} loading={submitBtnLoading} disabled={submitBtnLoading}>提交</AtButton>
            </AtFloatLayout>
        </View>
    );
}

export default Add;