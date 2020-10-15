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
            localStorage.setItem('id', id);
            return {
                ...state,
                user
            }
        }
        // 用户注销
        case BIO.LOGOUT_SUCCESS : {
            return {
                initState
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
        case BIO.REPORT_EDIT : {
            const { current, personId, testeeId, barCode, sampleId } = action.data;
            const edit = clone(state['report']);
            edit.current = current;
            edit.personId = personId;
            edit.testeeId = testeeId;
            edit.barCode = barCode;
            edit.sampleId = sampleId;
            return {
                ...state,
                edit
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