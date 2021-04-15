import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text, Checkbox, Label, Button, CheckboxGroup} from '@tarojs/components'
import { AtButton, AtInput, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtToast, AtMessage } from 'taro-ui'
import './index.css'
import * as BIO from '../../actions';
import { host } from '../../config';

const Index = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const guide = useSelector(state => state.guide)

  let [selected, setSelected] = useState(false)
  let [modalOpen, setModalOpen] = useState(false)
  let [inputValue, setInputValue] = useState('')
  let [btnLoading, setLoading] = useState(false)

  let [toastText, setToast] = useState('')

  const handleInputChange = (value) => {
    setInputValue(value)
    return value
  }

  const handleSubmit = () => {
    if(!user.token && !guide.add.code){
      setToast('请先登录');
      setTimeout(() => {
        Taro.navigateTo({
          url : '/pages/login/login'
        })
      }, 2000)
      return false;
    }
    else{
      let regExp = /^\d{9}$/;
      if(!selected) setToast('请勾选检测须知');
      else if(!regExp.test(inputValue)) setToast('请输入9位数字组成的采样管编号');
      else{
        setLoading(true)
        Taro.request({
          url : host() + '/validate/verify',
          method : 'POST',
          data : {
            barcode : inputValue
          },
          header : {
            'Content-Type' : 'application/json; charset=UTF-8'
          }
        }).then(_data => {
          const {data} = _data;
          if(data.code === 'error') setToast(data.info);
          else if(data.code === 'success'){
              let { barcode = '', sample_id = '' } = data.data;
              dispatch({
                  type : BIO.ADD_CHECK_SUCCESS,
                  data : {
                      barCode : barcode,
                      sampleId : sample_id
                  }
              })
              // Taro.navigateTo({
              //   url : '/pages/add/add'
              // })
              Taro.navigateTo({
                url : '/pages/questionnaire/questionnaire'
              })
          }
          setLoading(false)
        }).catch(error => {
          console.log(error)
          setLoading(false)
        });
      }
    }
  }

  useDidShow(() => {
    // 处理 guide._use
    let { add, report } = guide;
    if(add.code) Taro.atMessage({ type : 'info', message : '请进行绑定采样操作', duration : 2500 });
    if(report.code) dispatch({ type : BIO.GUIDE_REPORT_OVER });
  })

  return (<>
    <AtMessage />
    <AtToast isOpened={toastText.length} text={toastText} duration={2000} onClose={() => setToast('')}></AtToast>
    <View className='home-container'>
      <View className='home-textContainer'>
        <View className='home-title'>— 人体微生态监测报告 —</View>
        <View className='home-info'>
          <Text>肠道是人体消化与吸收的主要器官，吸收了90%以上的营养物质。
          同时，肠道又是人体最大的免疫器官，人体70%以上的免疫细胞位于肠粘膜内。
          肠道里的迷走神经与大脑相连，与大脑的神经系统构成 “脑肠轴”，因此肠道又被称为人体的 “第二大脑”。</Text>
          <Text>通过肠道菌群检测获得肠道菌落构成，并依据大数据和统计分析进行肠道健康评分和肠龄预测，可为个性化营养和健康管理提供依据。</Text>
        </View>
      </View>
      <View className='home-other'>
        <AtInput placeholder='请输入采样管编号' type='number' adjustPosition
          maxlength='9' confirmType='done'
          onChange={handleInputChange} value={inputValue}
        />
        <View className='home-selectContainer'>
          <CheckboxGroup onChange={(e) => e.detail.value.length ? setSelected(true) : setSelected(false)}>
            <Label>
              <Checkbox className='home-checkbox' value='agree' checked={selected} />我已知悉人体微生态
            </Label>
            <Text className='home-select-modal' onClick={() => setModalOpen(true)}>检测须知</Text>
          </CheckboxGroup>
        </View>
        <AtModal
          isOpened={modalOpen}
          onClose={() => setModalOpen(false)}
        >
          <AtModalHeader>知情同意书</AtModalHeader>
          <AtModalContent>
            <View className='home-agree-title'>请您仔细阅读下述信息后勾选此栏目，以代表您同意并自愿参加此项检测：</View>
            <View className='home-agree-content'>
              <View className='items'>本检测通过分析肠道菌群的具体组成，可以了解人体阶段性的身体健康状况，同时还可以有针对性地进行饮食调整和益生菌/益生原的干预，以维持肠道菌群的微生态环境平衡，使人体保持健康状态。</View>
              <View className='items'>本检测的流程为：收取采样盒 » 样品采集 » 样品回邮 » 实验处理 » 检测报告 » 个性化营养方案。</View>
            </View> 
          </AtModalContent>
          <AtModalAction><Button onClick={() => { setModalOpen(false); setSelected(true) }}>同意</Button></AtModalAction>
        </AtModal>
        <AtButton type='primary' circle onClick={handleSubmit} loading={btnLoading} disabled={btnLoading}>绑定采样</AtButton>
      </View>
    </View>
  </>);
}

export default Index;
