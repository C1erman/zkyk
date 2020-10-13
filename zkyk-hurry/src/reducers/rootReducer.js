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
        case BIO.ADD_SUCCESS : {
            const add = clone(initState.add);
            return {
                ...state,
                add
            }
        }
        // 报告列表
        case BIO.REPORT_SELECT : {
            const { current } = action.data;
            const report = clone(state['report']);
            report.current = current;
            return {
                ...state,
                report
            }
        }
        // 违规操作，清空状态
        case BIO.DENY_UNAUTHORIZED : {
            return {
                ...state,
                initState
            }
        }
        default : {
            return state
        }
    }
}

export default rootReducer;