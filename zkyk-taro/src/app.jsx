import 'taro-ui/dist/style/index.scss';
import React from 'react'
import { Provider } from 'react-redux'
import store from './store';
import './app.css'

const App = ({children}) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}

export default App
