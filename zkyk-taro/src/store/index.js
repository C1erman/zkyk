import { createStore } from 'redux';
import reducer from '../reducers/rootReducer';

// 不再需要中间件来提供异步支持
export default createStore(reducer);