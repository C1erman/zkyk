import 'taro-ui/dist/style/index.scss';
import React, { useEffect } from 'react'
import Taro from '@tarojs/taro';
import { Provider, useDispatch, useSelector } from 'react-redux'
import store from './store';
import * as BIO from './actions';
import './app.css'

// 数据缓存
const Data = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    console.log('数据load' + JSON.stringify(Taro.getStorageInfoSync()))
    dispatch({
      type : BIO.DATA_LOAD
    })
  }, [])
  return <></>;
}
// Taro 响应拦截器
const Interceptor = () => {
  const dispatch = useDispatch();
  const guide = useSelector(state => state.guide);

  const BioInterceptor = (chain) => {
    const requestParams = chain.requestParams;
    return chain.proceed(requestParams).then(response => {
      let code = response.statusCode || response.status;
      switch(code){
        case 401 : {
          // 如果是通过分享浏览报告
          if(guide._use){
            Taro.atMessage({
              type : 'info',
              message : '二维码已过期，请使用新的二维码',
              duration : 2000
            });
            setTimeout(() => Taro.reLaunch({
              url : '/pages/index/index'
            }), 2000)
          }
          else{
            dispatch({
              type : BIO.LOGIN_EXPIRED
            });
            Taro.atMessage({
              type : 'error',
              message : '登录状态过期，请重新登录',
              duration : 2000
            });
            setTimeout(() => Taro.reLaunch({
              url : '/pages/login/login'
            }), 2000)
          }
          break;
        }
        case 403 : {
          Taro.atMessage({
            type : 'error',
            message : '你没有权限查看这份报告',
            duration : 2000
          });
          break;
        }
        case 500 : {
          Taro.atMessage({
            type : 'error',
            message : '服务器出现意外情况，请稍后再试',
            duration : 2000
          });
          break;
        }
        case 200 :
        default : {
          return response;
        }
      }
    });
  }
  useEffect(() => {
    Taro.addInterceptor(BioInterceptor);
    console.log('拦截器更新成功')
  }, [guide._use])
  return <></>;
}

const App = ({children}) => {
  return (
    <Provider store={store}>
      <Interceptor />
      <Data />
      {children}
    </Provider>
  );
}

export default App
