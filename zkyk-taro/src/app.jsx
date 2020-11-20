import 'taro-ui/dist/style/index.scss';
import Taro from '@tarojs/taro';
import * as BIO from './actions';
import React, { Component, useEffect } from 'react'
import { Provider, useDispatch } from 'react-redux'
import store from './store';
import './app.css'
import { AtFab } from 'taro-ui';
import { Text } from '@tarojs/components';

const Nav = () => {
  const handleClick = () => {
    console.log('sd')
  }
  useEffect(() => {
    console.log('nav 的 effect')
  }, [])
  return (
      <AtFab onClick={handleClick}>
        <Text className='at-fab__icon at-icon at-icon-menu'></Text>
      </AtFab>
  );
}

const App = ({children}) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}

export default App
