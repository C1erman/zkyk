import 'taro-ui/dist/style/index.scss';
import Taro from '@tarojs/taro';
import * as BIO from './actions';
import React, { Component, useEffect } from 'react'
import { Provider, useDispatch } from 'react-redux'
import store from './store';
import './app.css'

const Data = () => {
  const dispatch = useDispatch();
  dispatch({
    type : BIO.DATA_LOAD
  })
  return <></>;
}

const App = ({children}) => {
  return (
    <Provider store={store}>
      <Data />
      {children}
    </Provider>
  );
}

export default App
