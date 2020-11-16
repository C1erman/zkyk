import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Switch, Route, Redirect, useHistory } from 'react-router-dom';
// redux
import * as BIO from '../../actions';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from '../../reducers';
import Axios from 'axios';
import md5 from 'blueimp-md5';
import { host } from '../../_config';

import Footer from '../Footer';
import Home from '../Home';
import Add from '../Add';
import Nav from '../Nav';
import Login from '../Login';
import Signup from '../Signup';
import ReportList from '../ReportList';
import Overview from '../Overview';
import Assess from '../Assess';
import Suggestion from '../Suggestion';
import Backend from '../Backend';
import UserInfo from '../UserInfo';
import ResetPass from '../RestPass';
import Edit from '../Edit';
import Knowledge from '../Knowledge';
import ResetEmail from '../ResetEmail';
import Verify from '../Verify';
import Share from '../Share';
import Guide from '../Guide';
import Alert from '../Alert';
import PDF from '../PDF';


const SecureRoute = () => {
    const state = useSelector(state => state);
    const { add, user, report, edit, share } = state;

    const R_Home = (<Route path='/' exact component={Home}></Route>);
    const R_Add = (<Route path='/add' component={Add}></Route>);

    const R_Login = (<Route path='/user/login' component={Login}></Route>);
    const R_Signup = (<Route path='/user/signup' component={Signup}></Route>);
    const R_UserInfo = (<Route path='/user/info' component={UserInfo}></Route>);
    const R_Share = (<Route path='/share' component={Share}></Route>);
    const R_ResetPass = (<Route path='/user/reset/pass' component={ResetPass}></Route>);
    const R_ResetEmail = (<Route path='/user/reset/email' component={ResetEmail}></Route>);
    const R_Verify = (<Route path='/user/verify' component={Verify}></Route>);

    const R_ReportList = (<Route path='/report/list' component={ReportList}></Route>);
    const R_Edit = (<Route path='/report/edit' component={Edit}></Route>);
    const R_Overview = (<Route path='/report/overview' component={Overview}></Route>);
    const R_Assess = (<Route path='/report/assess' component={Assess}></Route>);
    const R_Suggest = (<Route path='/report/suggestion' component={Suggestion}></Route>);
    const R_Knowledge = (<Route path='/report/knowledge' component={Knowledge}></Route>);

    const R_Backend = (<Route path='/backend' component={Backend}></Route>);
    const R_Pdf = (<Route path='/pdf' component={PDF}></Route>);

    const R_Guide = (<Route path='/guide/:to/:key' component={Guide}></Route>);

    const BioRoute = user.token ? (
        <Switch>
            {R_Home}{R_Login}
            {R_UserInfo}{R_ResetPass}{R_ResetEmail}{R_Verify}{R_Share}
            {add.barCode || share.add ? R_Add : null}{edit.current ? R_Edit : null}
            {R_ReportList}
            {report.current ? R_Overview : null}
            {report.current ? R_Assess : null}
            {report.current ? R_Assess : null}
            {report.current ? R_Suggest : null}
            {R_Knowledge}
            {user.permission ? R_Backend : null}
            {user.permission ? R_Pdf : null}
            {R_Guide}
            <Redirect to='/' />
        </Switch>
    ) : (
            <Switch>
                {R_Home}
                {R_Login}{R_Signup}{R_ResetPass}{R_ResetEmail}{R_Verify}
                {add.barCode || share.add ? R_Add : null}
                {R_Guide}
                <Redirect to='/' />
            </Switch>
        )
    return BioRoute;
}
const GlobalInfo = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const info = useSelector(state => state.globalInfo);
    let [alertMessage, setMsg] = useState(info);
    let controller = {};
    useEffect(() => {
        if (info) {
            setMsg(info);
            controller.on('toggle');
        }
    }, [info]);

    return (<Alert controller={controller} content={alertMessage} time={2500} beforeClose={() => {
        const toLoginRegExp = /登录/;
        if(toLoginRegExp.test(alertMessage)) {
            dispatch({
                type: BIO.LOGIN_EXPIRED
            });
            history.push('/user/login');
        }
        dispatch({
            type : BIO.GLOBAL_INFO_CLEAN
        });
    }} />);
}
const AxiosConfig = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        Axios.defaults.timeout = 10000;
        Axios.interceptors.response.use(
            response => response,
            error => {
                if(error.response?.status){
                    switch(error.response.status){
                        case 401 : {
                            dispatch({
                                type: BIO.GLOBAL_INFO,
                                data: '本地信息与服务器不一致或登录凭证过期，请重新登录'
                            });
                            break;
                        }
                        case 500 : {
                            dispatch({
                                type : BIO.GLOBAL_INFO,
                                data : '网络请求出现问题，请稍后再试'
                            });
                            break;
                        }
                        default : {
                            dispatch({
                                type : BIO.GLOBAL_INFO,
                                data : '系统错误，请联系管理员'
                            })
                        }
                    }
                }
                else {
                    dispatch({
                        type : BIO.GLOBAL_INFO,
                        data : '系统错误，请稍后再试，或联系管理员'
                    })
                }
            }
        )
    }, []);
    return (<></>)
}
const Data = () => {
    const dispatch = useDispatch();
    dispatch({
        type: BIO.DATA_LOAD
    })
    return (<></>);
}
const DataValidate = () => {
    const dispatch = useDispatch();
    const state = useSelector(state => state);
    let { user, share } = state;
    useEffect(() => {
        if (user.token && !share.add) {
            let hash = md5(user.role + user.permission);
            Axios({
                method: 'GET',
                url: host + '/user/verify/info',
                params: {
                    'access-token': user.token,
                    hash
                },
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
            .then(_data => {
                let { data } = _data;
                if (data.code === 'error') {
                    dispatch({
                        type: BIO.GLOBAL_INFO,
                        data: '本地信息与服务器不一致，请重新登录'
                    });
                }
            }).catch(error => console.log(error));
        }
    }, [])
    return (<></>);
}
const App = () => {
    return (
        <Provider store={store}>
            <AxiosConfig />
            <Data />
            <Router>
                <GlobalInfo />
                <DataValidate />
                <Nav />
                <SecureRoute />
            </Router>
            <Footer />
        </Provider>
    );
}

export default App;