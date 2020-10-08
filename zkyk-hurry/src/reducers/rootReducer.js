import * as BIO from '../actions';
import initState from './initState';
import { clone } from '../utils/BIOObject';

const rootReducer = (state = initState, action) => {
    switch(action.type){
        // 用户登录
        case BIO.LOGIN_SUCCESS : {
            const user = clone(state['user']);
            const { id, role, token } = action.data;
            user.id = id;
            user.role = role;
            user.token = token;
            return {
                ...state,
                user
            }
        }
        // 绑定采样
        case BIO.ADD_CHECK_SUCCESS : {
            const add = clone(state['add']);
            const { barCode, sampleId } = action.data;
            add.barCode = barCode;
            add.sampleId = sampleId;
            return {
                ...state,
                add
            }
        }
        default : {
            return state
        }
    }
}

export default rootReducer;