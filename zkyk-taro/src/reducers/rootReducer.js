import Taro from '@tarojs/taro';
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
                    token : Taro.getStorageSync('token') || ''
                },
                report : Taro.getStorageSync('VIEW_current') || {
                    current : ''
                },
                add : {
                    barCode : Taro.getStorageSync('ADD_barCode') || '',
                    sampleId : Taro.getStorageSync('ADD_sampleId') || '',
                    testeeId : Taro.getStorageSync('ADD_testeeId') || ''
                },
                edit : {
                    current : Taro.getStorageSync('EDIT_current') || ''
                },
                sampleList : {
                    totalPage : 1,
                    currentPage : 1,
                    search : '',
                },
                guide : {
                    add : Taro.getStorageSync('GUIDE_add') || {
                        passwordRequired : false,
                        password : '',
                        code : ''
                    },
                    signup : Taro.getStorageSync('GUIDE_signup') || {
                        passwordRequired : false,
                        password : '',
                        code : '',
                        userId : ''
                    },
                    report : Taro.getStorageSync('GUIDE_report') || {
                        passwordRequired : true,
                        password : '',
                        code : ''
                    },
                    _use : Taro.getStorageSync('GUIDE_use') || false
                }
            }
        }
        // 用户微信登录
        case BIO.LOGIN_BY_WECHAT : {
            const user = clone(state['user']);
            user.username = action.data;
            return {
                ...state,
                user
            }
        }
        // 用户登录
        case BIO.LOGIN_SUCCESS : {
            const user = clone(state['user']);
            const { token } = action.data;
            user.token = token;
            // 保存登录凭证
            Taro.setStorageSync('token', token)
            return {
                ...state,
                user
            }
        }
        // 用户注销
        case BIO.LOGOUT_SUCCESS : {
            Taro.clearStorageSync();
            return clone(initState);
        }
        // 用户登录状态过期
        case BIO.LOGIN_EXPIRED : {
            Taro.clearStorageSync();
            return clone(initState);
        }
        // 绑定采样
        case BIO.ADD_CHECK_SUCCESS : {
            const add = clone(state['add']);
            const { barCode, sampleId } = action.data;
            add.barCode = barCode;
            add.sampleId = sampleId;
            Taro.setStorageSync('ADD_barCode', barCode);
            Taro.setStorageSync('ADD_sampleId', sampleId);
            return {
                ...state,
                add
            }
        }
        case BIO.ADD_SET_TESTEE_CODE : {
            const add = clone(state['add']);
            add.testeeId = action.data;
            Taro.setStorageSync('ADD_testeeId', action.data);
            return {
                ...state,
                add
            }
        }
        case BIO.ADD_SUCCESS : {
            Taro.removeStorageSync('ADD_barCode');
            Taro.removeStorageSync('ADD_sampleId');
            Taro.removeStorageSync('ADD_testeeId');
            Taro.removeStorageSync('SHARE_add');
            const add = clone(initState['add']);
            return {
                ...state,
                add
            }
        }
        case BIO.ADD_SET_ANTIBIOTICS : {
            const antibiotics = clone(state['antibiotics']);
            antibiotics.add = action.data;
            return {
                ...state,
                antibiotics
            }
        }
        // 编辑信息
        case BIO.EDIT_SET_ANTIBIOTICS : {
            const antibiotics = clone(state['antibiotics']);
            antibiotics.edit = action.data;
            return {
                ...state,
                antibiotics
            }
        }
        // 报告列表
        case BIO.REPORT_SELECT : {
            const { current } = action.data;
            const report = clone(state['report']);
            report.current = current;
            // 保存查看报告编号
            Taro.setStorageSync('VIEW_current', report);
            return {
                ...state,
                report
            }
        }
        case BIO.REPORT_LIST_CURRENT_PAGE : {
            const sampleList = clone(state['sampleList']);
            sampleList.currentPage = action.data;
            Taro.setStorageSync('SAMPLELIST_current_page', action.data);
            return {
                ...state,
                sampleList
            }
        }
        case BIO.REPORT_LIST_CURRENT_SEARCH : {
            const sampleList = clone(state['sampleList']);
            sampleList.search = action.data;
            return {
                ...state,
                sampleList
            }
        }
        case BIO.REPORT_EDIT : {
            const { current } = action.data;
            const edit = clone(state['edit']);
            edit.current = current;
            // 保存编辑报告编号
            Taro.setStorageSync('EDIT_current', current);
            return {
                ...state,
                edit
            }
        }
        case BIO.REPORT_EDIT_SUCCESS : {
            Taro.removeStorageSync('EDIT_current');
            const edit = clone(initState['edit']);
            return {
                ...state,
                edit
            }
        }
        // 接受分享
        case BIO.GUIDE_USE : {
            const guide = clone(state['guide']);
            guide._use = true;
            Taro.setStorageSync('GUIDE_use', guide._use);
            return {
                ...state,
                guide
            }
        }
        case BIO.GUIDE_USE_SUCCESS : {
            const guide = clone(state['guide']);
            guide._use = false;
            Taro.removeStorageSync('GUIDE_use');
            return {
                ...state,
                guide
            }
        }
        case BIO.GUIDE_REPORT_ADD : {
            const guide = clone(state['guide']);
            let { code, password, passwordRequired } = action.data;
            guide.add = { code, password, passwordRequired };
            Taro.setStorageSync('GUIDE_add', guide.add);
            return {
                ...state,
                guide
            }
        }
        case BIO.GUIDE_REPORT_ADD_SUCCESS : {
            const guide = clone(state['guide']);
            guide.add = clone(initState['guide']['add']);
            guide._use = false;
            Taro.removeStorageSync('GUIDE_add');
            Taro.removeStorageSync('GUIDE_use');
            return {
                ...state,
                guide
            }
        }
        case BIO.GUIDE_REPORT : {
            const guide = clone(state['guide']);
            const report = clone(state['report']);
            let {code, current, password, passwordRequired } = action.data;
            guide.report = { code, password, passwordRequired };
            report.current = current;
            Taro.setStorageSync('GUIDE_report', guide.report);
            Taro.setStorageSync('VIEW_current', report);
            return {
                ...state,
                report,
                guide
            }
        }
        case BIO.GUIDE_REPORT_OVER : {
            const guide = clone(state['guide']);
            guide.report = clone(initState['guide']['report']);
            guide._use = false;
            Taro.removeStorageSync('GUIDE_report');
            Taro.removeStorageSync('VIEW_current');
            Taro.removeStorageSync('GUIDE_use');
            return {
                ...state,
                guide,
                report : clone(initState['report'])
            }
        }
        case BIO.GUIDE_SIGN_UP : {
            const guide = clone(state['guide']);
            let {code, userId, password, passwordRequired} = action.data;
            guide.signup = { code, userId, password, passwordRequired };
            Taro.setStorageSync('GUIDE_signup', guide.signup);
            return {
                ...state,
                guide
            }
        }
        case BIO.GUIDE_SIGN_UP_SUCCESS : {
            const guide = clone(state['guide']);
            const signup = clone(initState['guide']['signup']);
            Taro.removeStorageSync('GUIDE_signup');
            guide.signup = signup;
            Taro.removeStorageSync('GUIDE_use');
            guide._use = false;
            return {
                ...state,
                guide
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