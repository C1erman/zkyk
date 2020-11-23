import React, { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Picker } from '@tarojs/components';
import { useSelector } from 'react-redux';
import { AtInput, AtList, AtListItem } from 'taro-ui';
import { clone } from '../../utils/BIOObject';
import './add.css';
import { host } from '../../config';
import { getPreviousDay } from '../../utils/BIODate';

const Add = () => {
    let user = useSelector(state => state.user)
    let add = useSelector(state => state.add)

    let [contact, setContact] = useState('')
    let [addBasicInfo, setAddBasicInfo] = useState({
        last_name : '',
        first_name : '',
        gender : '',
        blood_type : '',
        birthday : ''
    })
    let [addOtherInfo, setAddOtherInfo] = useState({
        height : '',
        weight : '',
        meat_egetables : '',
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
        date : '',
        meatEgetable : {
            selector : ['0% - 20%', '20% - 40%', '40% - 60%', '60% - 80%', '80% - 100%'],
            selectorChecked : '0% - 20%'
        },
    })

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

    }, [])

    const handleSetBasicValue = (value, dataName) => {
        let basicInfo = clone(addBasicInfo);
        basicInfo[dataName] = value;
        setAddBasicInfo(basicInfo);
    }
    const handleSetOtherValue = (value, dataName) => {
        let otherInfo = clone(addOtherInfo);
        addOtherInfo[dataName] = value;
        setAddOtherInfo(otherInfo);
    }
    const handleSetPickerValue = (e, type) => {
        let value = e.detail.value;
        let picker = clone(addPicker);
        if(type === 'date') picker[type] = value;
        else picker[type].selectorChecked = picker[type].selector[value];
        setAddPicker(picker);
    }
    const handleSubmit = () => {

    }


    return (
        <View className='add-container'>
            <View className='add-noti'>
                <View>为了更加准确、合理地为受测人提供建议，请受测人如实填写下述信息。</View>
                <View>您本次送检的采样管编号为：<Text className='add-noti-barcode'>{add.barCode}</Text></View>
                { contact ? (<View>业务员名称：<Text className='add-noti-username'>{contact?.username}</Text>，联系方式为：<Text className='add-noti-email'>{contact?.contact}</Text></View>) : null}
            </View>
            <View className='add-title'><Text className='text'>受测人基本信息</Text></View>
            <AtInput required title='姓' maxlength='3' placeholder='请输入姓氏' value={addBasicInfo.last_name} onChange={(value) => handleSetBasicValue(value, 'last_name')} />
            <AtInput required title='名' maxlength='3' placeholder='请输入名字' value={addBasicInfo.first_name} onChange={(value) => handleSetBasicValue(value, 'first_name')} />
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
              onChange={(e) => handleSetPickerValue(e, 'date')}
              end={getPreviousDay()}
            >
                <AtList className='add-picker-list'>
                    <AtListItem 
                      title='生日'
                      extraText={addPicker.date}
                    />
                </AtList>
            </Picker>
            <View className='add-title'><Text className='text'>受测人近期状况</Text></View>
            <AtInput required title='身高' placeholder='请输入身高' type='digit' value={addOtherInfo.height} onChange={(value) => handleSetOtherValue(value, 'height')} />
            <AtInput required title='体重' placeholder='请输入体重' type='digit' value={addOtherInfo.weight} onChange={(value) => handleSetOtherValue(value, 'weight')} />
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
        </View>
    );
}

export default Add;