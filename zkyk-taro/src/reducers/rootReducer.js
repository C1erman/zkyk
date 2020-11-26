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
                report : {
                    current : Taro.getStorageSync('VIEW_current') || ''
                },
                add : {
                    barCode : Taro.getStorageSync('ADD_barCode') || '',
                    sampleId : Taro.getStorageSync('ADD_sampleId') || '',
                    testeeId : Taro.getStorageSync('ADD_testeeId') || ''
                },
                edit : {
                    current : Taro.getStorageSync('EDIT_current') || ''
                }
            }
        }
        // 页面更改
        case BIO.APP_PAGE_CHANGE : {
            const app = clone(state['app']);
            app.currentPage = action.data;
            Taro.setStorageSync('APP_currentPage', action.data);
            return {
                ...state,
                app
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
        // 用户注册
        case BIO.SIGN_SUCCESS : {
            sessionStorage.removeItem('SHARE_signup');
        }
        // 用户注销
        case BIO.LOGOUT_SUCCESS : {
            Taro.clearStorageSync();
            return clone(initState);
        }
        // 用户登录状态过期
        case BIO.LOGIN_EXPIRED : {
            localStorage.clear();
            sessionStorage.clear();
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
        // 报告列表
        case BIO.REPORT_SELECT : {
            const { current } = action.data;
            const report = clone(state['report']);
            report.current = current;
            // 保存查看报告编号
            Taro.setStorageSync('VIEW_current', current);
            return {
                ...state,
                report
            }
        }
        case BIO.REPORT_LIST_CURRENT_PAGE : {
            const sampleList = clone(state['sampleList']);
            sampleList.currentPage = action.data;
            sessionStorage.setItem('SAMPLELIST_current_page', action.data);
            return {
                ...state,
                sampleList
            }
        }
        case BIO.REPORT_READ_OVER : {
            const report = clone(initState['report']);
            localStorage.removeItem('VIEW_current');
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
        // 更新个人信息
        // 后台管理
        case BIO.BACKEND_LIST_CURRENT_PAGE : {
            const backendList = clone(state['backendList']);
            let { currentPage, totalPage } = action.data;
            backendList.currentPage = currentPage;
            backendList.totalPage = totalPage;
            sessionStorage.setItem('BACKENDLIST_current_page', currentPage);
            return {
                ...state,
                backendList
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
        case BIO.SHARE_SIGN_UP : {
            const share = clone(state['share']);
            share.signup = action.data;
            sessionStorage.setItem('SHARE_signup', action.data);
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