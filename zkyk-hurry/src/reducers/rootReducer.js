import * as BIO from '../actions';
import initState from './initState';
import { clone } from '../utils/BIOObject';

const rootReducer = (state = initState, action) => {
    switch(action.type){
        // 数据缓存
        case BIO.DATA_LOAD : {
            return {
                ...state,
                user : {
                    role : localStorage.getItem('role') || '',
                    token : localStorage.getItem('token') || '',
                    email : localStorage.getItem('email') || '',
                    permission : localStorage.getItem('permission') || ''
                },
                report : {
                    current : localStorage.getItem('VIEW_current') || ''
                },
                add : {
                    barCode : localStorage.getItem('ADD_barCode') || '',
                    sampleId : localStorage.getItem('ADD_sampleId') || '',
                    testeeId : localStorage.getItem('ADD_testeeId') || ''
                },
                edit : {
                    current : localStorage.getItem('EDIT_current') || ''
                },
                share : {
                    add : sessionStorage.getItem('SHARE_add') || ''
                },
                pdf : sessionStorage.getItem('PDF_id') || ''
            }
        }
        // 用户登录
        case BIO.LOGIN_SUCCESS : {
            const user = clone(state['user']);
            const { role, permission, token, email } = action.data;
            user.role = role;
            user.permission = permission;
            user.token = token;
            user.email = email;
            // 保存登录凭证
            localStorage.setItem('role', role);
            localStorage.setItem('permission', permission);
            localStorage.setItem('token', token);
            localStorage.setItem('email', email);
            return {
                ...state,
                user
            }
        }
        // 用户注销
        case BIO.LOGOUT_SUCCESS : {
            localStorage.clear();
            return clone(initState);
        }
        // 用户登录状态过期
        case BIO.LOGIN_EXPIRED : {
            localStorage.clear();
            return clone(initState);
        }
        // 绑定采样
        case BIO.ADD_CHECK_SUCCESS : {
            const add = clone(state['add']);
            const { barCode, sampleId } = action.data;
            add.barCode = barCode;
            add.sampleId = sampleId;
            localStorage.setItem('ADD_barCode', barCode);
            localStorage.setItem('ADD_sampleId', sampleId);
            return {
                ...state,
                add
            }
        }
        case BIO.ADD_SET_TESTEE_CODE : {
            const add = clone(state['add']);
            add.testeeId = action.data;
            localStorage.setItem('ADD_testeeId', action.data);
            return {
                ...state,
                add
            }
        }
        case BIO.ADD_SUCCESS : {
            localStorage.removeItem('ADD_barCode');
            localStorage.removeItem('ADD_sampleId');
            localStorage.removeItem('ADD_testeeId');
            sessionStorage.removeItem('SHARE_add');
            const add = clone(initState['add']);
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
            // 保存查看报告编号
            localStorage.setItem('VIEW_current', current);
            return {
                ...state,
                report
            }
        }
        case BIO.REPORT_EDIT : {
            const { current } = action.data;
            const edit = clone(state['edit']);
            edit.current = current;
            // 保存编辑报告编号
            localStorage.setItem('EDIT_current', current);
            return {
                ...state,
                edit
            }
        }
        case BIO.REPORT_EDIT_SUCCESS : {
            localStorage.removeItem('EDIT_current');
            const edit = clone(initState['edit']);
            return {
                ...state,
                edit
            }
        }
        // 更新个人信息
        case BIO.USER_EDIT_EMAIL : {
            const user = clone(state['user']);
            user.email = action.data;
            localStorage.setItem('email', action.data);
            return {
                ...state,
                user
            }
        }
        // 分享
        case BIO.SHARE_REPORT_ADD : {
            const share = clone(state['share']);
            share.add = action.data;
            sessionStorage.setItem('SHARE_add', action.data);
            return {
                ...state,
                share
            }
        }
        // 报告下载
        case BIO.REPORT_DOWNLOAD : {
            sessionStorage.setItem('PDF_id', action.data);
            return {
                ...state,
                pdf : action.data
            }
        }
        case BIO.REPORT_DOWNLOAD_SUCCESS : {
            sessionStorage.removeItem('PDF_id');
            return {
                ...state,
                pdf : ''
            }
        }
        // 设置全局消息
        case BIO.GLOBAL_INFO : {
            return {
                ...state,
                globalInfo : action.data
            }
        }
        case BIO.GLOBAL_INFO_CLEAN : {
            return {
                ...state,
                globalInfo : ''
            }
        }
        // 违规操作，清空状态
        case BIO.DENY_UNAUTHORIZED : {
            return clone(initState);
        }
        default : {
            return state
        }
    }
}

export default rootReducer;