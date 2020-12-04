import React, { useEffect, useState } from 'react';
import { View, Text, Picker } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { AtMessage, AtInput, AtButton, AtList, AtListItem, AtFloatLayout } from 'taro-ui';
import { useDispatch, useSelector } from 'react-redux';
import * as BIO from '../../actions';
import { getPreviousDay, getNow } from '../../utils/BIODate';
import { host } from '../../config';
import { clone } from '../../utils/BIOObject';
import './edit.css';
import { BIOValidate } from '../../utils/BIOValidate';

const Edit = () => {
    const dispatch = useDispatch()

    let user = useSelector(state => state.user)
    let edit = useSelector(state => state.edit)
    let _antibiotics = useSelector(state => state.antibiotics)

    let [editData, setEditData] = useState({
        barcode : '',
        code : '',
        testee_id : '',
        date_of_collection : '',
        person_id : ''
    })
    let [editBasicInfo, setEditBasicInfo] = useState({
        last_name : '',
        first_name : ''
    })
    let [editOtherInfo, setEditOtherInfo] = useState({
        height : '',
        weight : '',
        antibiotics : ''
    })
    let [editPicker, setEditPicker] = useState({
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
    let [readOnly, setReadOnly] = useState({
        last_name : true,
        first_name : true,
        gender : true,
        bloodType : true,
        birthday : true
    })
    let [_editBasicInfo, _setEditBasicInfo] = useState({
        last_name : '',
        first_name : ''
    })
    let [_editPicker, _setEditPicker] = useState({
        gender : {
            selector : ['男', '女'],
            selectorChecked : '男'
        },
        bloodType : {
            selector : ['O型', 'A型', 'B型', 'AB型', '其他'],
            selectorChecked : 'O型'
        },
        birthday : getPreviousDay()
    })

    let [layoutOpened, setLayoutOpened] = useState(false)
    let [submitBtnLoading, setSubmitBtnLoading] = useState(false)

    const mapPickerKey = {
        '男' : 'M',
        '女' : 'F',
        'O型' : 'O',
        'A型' : 'A',
        'B型' : 'B',
        'AB型' : 'AB',
        '其他' : 'OTHER',
        '0% - 20%' : '0',
        '20% - 40%' : '1',
        '40% - 60%' : '2',
        '60% - 80%' : '3',
        '80% - 100%' : '4'
    }
    const mapPickerValue = {
        'M' : '男',
        'F' : '女',
        'O' : 'O型',
        'A' : 'A型',
        'B' : 'B型',
        'AB' : 'AB型',
        'OTHER' : '其他',
        '0' : '0% - 20%',
        '1' : '20% - 40%',
        '2' : '40% - 60%',
        '3' : '60% - 80%',
        '4' : '80% - 100%'
    }

    useEffect(() => {
        Taro.request({
            url : host + '/sample/update/bind',
            method : 'GET',
            data : {
                id : edit.current,
                'access-token' : user.token
            },
            header : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let {data} = res;
            if(data.code === 'success'){
                let {last_name, first_name, height, weight, birthday, antibiotics,
                    gender, blood_type, meat_egetables,
                    sample_id, barcode, testee_id, code, person_id, date_of_collection} = data.data;
                // 必要信息
                setEditData({
                    sample_id, barcode, testee_id, code, person_id, date_of_collection 
                });
                // 赋默认值
                setEditBasicInfo({last_name, first_name});
                setEditOtherInfo({height, weight, antibiotics});
                setEditPicker({
                    gender : {
                        selector : ['男', '女'],
                        selectorChecked : mapPickerValue[gender]
                    },
                    bloodType : {
                        selector : ['O型', 'A型', 'B型', 'AB型', '其他'],
                        selectorChecked : mapPickerValue[blood_type]
                    },
                    birthday : birthday,
                    meatEgetable : {
                        selector : ['0% - 20%', '20% - 40%', '40% - 60%', '60% - 80%', '80% - 100%'],
                        selectorChecked : mapPickerValue[meat_egetables]
                    }
                });
                // 赋修改默认值
                _setEditBasicInfo({last_name, first_name});
                _setEditPicker({
                    gender : {
                        selector : ['男', '女'],
                        selectorChecked : mapPickerValue[gender]
                    },
                    bloodType : {
                        selector : ['O型', 'A型', 'B型', 'AB型', '其他'],
                        selectorChecked : mapPickerValue[blood_type]
                    },
                    birthday : birthday
                });
            }
        })
        .catch(e => console.log(e))
    }, [user])

    const handleSetPickerValue = (e, type) => {
        let value = e.detail.value;
        let picker = clone(editPicker);
        if(type === 'birthday') picker[type] = value;
        else picker[type].selectorChecked = picker[type].selector[value];
        setEditPicker(picker);
    }
    const handleSetOtherValue = (value, dataName) => {
        let otherInfo = clone(editOtherInfo);
        otherInfo[dataName] = value;
        setEditOtherInfo(otherInfo);
    }
    const _handleSetPickerValue = (e, type) => {
        let value = e.detail.value;
        let picker = clone(_editPicker);
        if(type === 'birthday') picker[type] = value;
        else picker[type].selectorChecked = picker[type].selector[value];
        _setEditPicker(picker);
    }
    const _handleSetBasicValue = (value, dataName) => {
        let basicInfo = clone(_editBasicInfo);
        basicInfo[dataName] = value;
        _setEditBasicInfo(basicInfo);
    }
    const handleEdit = () => {
        let data = {
            last_name : _editBasicInfo.last_name,
            first_name : _editBasicInfo.first_name,
            gender : mapPickerKey[_editPicker.gender.selectorChecked],
            blood_type : mapPickerKey[_editPicker.bloodType.selectorChecked],
            birthday : _editPicker.birthday
        }
        let validateData = [
            {data : _editBasicInfo.last_name, type : BIOValidate.TYPE.NAME, info : '请输入一到三个汉字组成的姓氏'},
            {data : _editBasicInfo.first_name, type : BIOValidate.TYPE.NAME, info : '请输入一到三个汉字组成的名字'}
        ]
        let validated = BIOValidate.validate(validateData);

        if(!validated.validated) Taro.atMessage({
            type : 'error',
            message : validated.info,
            duration : 2500
        })
        else{
            setSubmitBtnLoading(true)
            Taro.request({
                url : host + '/sample/alter/person?access-token=' + user.token,
                method : 'POST',
                data : {
                    ...data,
                    person_id : editData.person_id
                },
                header : {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
            .then(res => {
                let {data} = res;
                if(data.code === 'success'){
                    Taro.atMessage({
                        type : 'success',
                        message : '信息更新成功',
                        duration : 2500
                    });
                    setEditBasicInfo({
                        last_name : _editBasicInfo.last_name,
                        first_name : _editBasicInfo.first_name
                    });
                    let picker = clone(editPicker);
                    picker = {
                        ...picker,
                        gender : {
                            selector : ['男', '女'],
                            selectorChecked : _editPicker.gender.selectorChecked
                        },
                        bloodType : {
                            selector : ['O型', 'A型', 'B型', 'AB型', '其他'],
                            selectorChecked : _editPicker.bloodType.selectorChecked
                        },
                        birthday : _editPicker.birthday
                    }
                    setEditPicker(picker);
                    setLayoutOpened(false)
                }
                else Taro.atMessage({
                    type : 'error',
                    message : data.info,
                    duration : 2500
                })
                setSubmitBtnLoading(false)
            })
            .catch(e => console.log(e))
        }
    }
    const handleSubmit = () => {
        let data = {
            height : editOtherInfo.height,
            weight : editOtherInfo.weight,
            meat_egetables : mapPickerKey[editPicker.meatEgetable.selectorChecked]
        }
        let validateData = [
            {data : editOtherInfo.height, type : BIOValidate.TYPE.HEIGHT},
            {data : editOtherInfo.weight, type : BIOValidate.TYPE.WEIGHT}
        ]
        let validated = BIOValidate.validate(validateData);
        if(!validated.validated) Taro.atMessage({
            type : 'error',
            message : validated.info,
            duration : 2500
        })
        else{
            setSubmitBtnLoading(true);
            Taro.request({
                url : host + '/sample/modify?access-token=' + user.token,
                method : 'POST',
                data : {
                    ...data,
                    antibiotics : editOtherInfo.antibiotics,
                    testee_id : editData.testee_id, sample_id : editData.sample_id, person_id : editData.person_id
                },
                header : {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
            .then(res => {
                let { data } = res;
                if(data.code === 'success'){
                    Taro.atMessage({
                        type : 'success',
                        message : '信息修改成功',
                        duration : 2500
                    })
                    setTimeout(() => {
                        Taro.navigateBack();
                        setSubmitBtnLoading(false);
                    }, 2500)
                    dispatch({
                        type : BIO.REPORT_EDIT_SUCCESS
                    });
                    dispatch({
                        type : BIO.EDIT_SET_ANTIBIOTICS,
                        data : ''
                    });
                }
                else{
                    Taro.atMessage({
                        type : 'error',
                        message : data.info,
                        duration : 2500
                    });
                    setSubmitBtnLoading(false);
                }
            })
            .catch(e => console.log(e))
        }
    }
    const handleAntibiotics = () => {
        Taro.navigateTo({
            url : '/pages/antibiotics/antibiotics?from=edit',
        })
    }
    
    useDidShow(() => {
        if(_antibiotics.edit){
            handleSetOtherValue(_antibiotics.edit, 'antibiotics')
        }
    });


    return (
        <>
            <AtMessage />
            <View className='edit-container'>
                <View className='edit-noti'>
                    <View>您当前正在预览采样管编号为<Text className='edit-noti-barcode'>{editData.barcode}</Text>
                    的绑定信息，受测人编码为<Text className='edit-noti-testeeCode'>{editData.code}</Text>
                    ，此份信息的送样时间为<Text className='edit-noti-time'>{editData.date_of_collection}</Text>。</View>
                </View>
                <View className='edit-title'><Text className='text'>受测人基本信息</Text></View>
                <View className='edit-name-group'>
                    <AtInput className='name' name='last_name' required disabled={readOnly.last_name} title='姓' maxlength='3' placeholder='姓氏' value={editBasicInfo.last_name} />
                    <AtInput className='name' name='first_name' required disabled={readOnly.first_name} title='名' maxlength='3' placeholder='名字' value={editBasicInfo.first_name} />
                </View>
                <Picker mode='selector' range={editPicker.gender.selector} disabled={readOnly.gender}
                  className='edit-picker'
                >
                    <AtList className='edit-picker-list'>
                        <AtListItem 
                          title='性别'
                          extraText={editPicker.gender.selectorChecked}
                        />
                    </AtList>
                </Picker>
                <Picker mode='selector' range={editPicker.bloodType.selector} disabled={readOnly.bloodType}
                  className='edit-picker'
                >
                    <AtList className='edit-picker-list'>
                        <AtListItem 
                          title='血型'
                          extraText={editPicker.bloodType.selectorChecked}
                        />
                    </AtList>
                </Picker>
                <Picker mode='date' className='edit-picker' disabled={readOnly.birthday}
                  end={getNow()}
                >
                    <AtList className='edit-picker-list'>
                        <AtListItem 
                          title='生日'
                          extraText={editPicker.birthday}
                        />
                    </AtList>
                </Picker>
                <View className='edit-for-testee'>上述信息为受测人基本信息。
                    <AtButton className='btn' size='small' circle type='secondary' onClick={() => setLayoutOpened(true)}>点击修改</AtButton>
                </View>
                <View className='edit-title'><Text className='text'>受测人近期状况</Text></View>
                <AtInput name='height' required title='身高' placeholder='请输入身高' type='digit' value={editOtherInfo.height} onChange={(value) => handleSetOtherValue(value, 'height')} />
                <AtInput name='weight' required title='体重' placeholder='请输入体重' type='digit' value={editOtherInfo.weight} onChange={(value) => handleSetOtherValue(value, 'weight')} />
                <Picker mode='selector' range={editPicker.meatEgetable.selector}
                  className='edit-picker' onChange={(e) => handleSetPickerValue(e, 'meatEgetable')}
                >
                    <AtList className='edit-picker-list'>
                        <AtListItem 
                          title='饮食中肉食占比'
                          extraText={editPicker.meatEgetable.selectorChecked}
                        />
                    </AtList>
                </Picker>
                <View className='edit-indexes'>
                    <AtInput name='antibiotics' title='服用过的抗生素' placeholder='一周内服用过的抗生素' value={editOtherInfo.antibiotics} onChange={(value) => handleSetOtherValue(value, 'antibiotics')} />
                    <AtButton type='primary' size='small' onClick={handleAntibiotics}>搜索</AtButton>
                </View>
                <AtButton customStyle={{margin : '1rem 0'}} circle type='secondary' onClick={handleSubmit}>修改</AtButton>
                <AtFloatLayout isOpened={layoutOpened} title='受测人信息修改' onClose={() => setLayoutOpened(false)}>
                    <View className='edit-info-check'>修改受测人基本信息将会引起所有相关联绑定信息的修改，请谨慎修改。</View>
                    <View className='edit-info-form'>
                        <View className='edit-name-group'>
                            <AtInput className='name' name='last_name' required title='姓' maxlength='3' placeholder='姓氏' value={_editBasicInfo.last_name} onChange={(value) => _handleSetBasicValue(value, 'last_name')} />
                            <AtInput className='name' name='first_name' required title='名' maxlength='3' placeholder='名字' value={_editBasicInfo.first_name} onChange={(value) => _handleSetBasicValue(value, 'first_name')} />
                        </View>
                        <Picker mode='selector' range={editPicker.gender.selector}
                          className='edit-picker' onChange={(e) => _handleSetPickerValue(e, 'gender')}
                        >
                            <AtList className='edit-picker-list'>
                                <AtListItem 
                                  title='性别'
                                  extraText={_editPicker.gender.selectorChecked}
                                />
                            </AtList>
                        </Picker>
                        <Picker mode='selector' range={_editPicker.bloodType.selector}
                          className='add-picker' onChange={(e) => _handleSetPickerValue(e, 'bloodType')}
                        >
                            <AtList className='edit-picker-list'>
                                <AtListItem 
                                  title='血型'
                                  extraText={_editPicker.bloodType.selectorChecked}
                                />
                            </AtList>
                        </Picker>
                        <Picker mode='date' className='add-picker'
                          onChange={(e) => _handleSetPickerValue(e, 'birthday')}
                          end={getNow()}
                        >
                            <AtList className='edit-picker-list'>
                                <AtListItem 
                                  title='生日'
                                  extraText={_editPicker.birthday}
                                />
                            </AtList>
                        </Picker>
                    </View>
                    <AtButton className='edit-submit-btn' circle type='primary' onClick={handleEdit} loading={submitBtnLoading} disabled={submitBtnLoading}>确认修改</AtButton>
                </AtFloatLayout>
            </View>
        </>
    );
}

export default Edit;