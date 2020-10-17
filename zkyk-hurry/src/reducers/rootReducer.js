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
            // 保存登录凭证
            localStorage.setItem('id', id);
            localStorage.setItem('role', role);
            localStorage.setItem('token', token);
            return {
                ...state,
                user
            }
        }
        // 用户注销
        case BIO.LOGOUT_SUCCESS : {
            // 消除登陆凭证
            localStorage.clear();
            return {
                ...state,
                user : {
                    id : '',
                    role : '',
                    token : ''
                }
            };
        }
        // 绑定采样
        case BIO.ADD_CHECK_SUCCESS : {
            const add = clone(state['add']);
            const { barCode, sampleId } = action.data;
            add.barCode = barCode;
            add.sampleId = sampleId;
            localStorage.setItem('barCode', barCode);
            localStorage.setItem('sampleId', sampleId);
            return {
                ...state,
                add
            }
        }
        case BIO.ADD_SUCCESS : {
            localStorage.removeItem('barCode');
            localStorage.removeItem('sampleId');
            return {
                ...state,
                add : {
                    barCode : '',
                    sampleId : ''
                }
            }
        }
        // 报告列表
        case BIO.REPORT_SELECT : {
            const { current } = action.data;
            const report = clone(state['report']);
            report.current = current;
            // 保存查看报告编号
            localStorage.setItem('current', current);
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
            return clone(initState)
        }
        default : {
            return state
        }
    }
}

export default rootReducer;