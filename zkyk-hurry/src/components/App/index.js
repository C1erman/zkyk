import React, { useEffect } from  'react';
import { HashRouter as Router,  Switch, Route, Redirect } from 'react-router-dom';
// redux
import * as BIO from '../../actions';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from '../../reducers';

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

const SecureRoute = () => {
    const state = useSelector(state => state);
    const { add, user, report, edit } = state;

    const R_Home = (<Route path='/' exact component={Home}></Route>);
    const R_Add = (<Route path='/add' component={Add}></Route>);

    const R_Login = (<Route path='/user/login' component={Login}></Route>);
    const R_Signup = (<Route path='/user/signup' component={Signup}></Route>);
    const R_UserInfo = (<Route path='/user/info' component={UserInfo}></Route>);
    const R_ResetPass = (<Route path='/user/reset' component={ResetPass}></Route>);

    const R_ReportList = (<Route path='/report/list' component={ReportList}></Route>);
    const R_Edit = (<Route path='/report/edit' component={Edit}></Route>);
    const R_Overview = (<Route path='/report/overview' component={Overview}></Route>);
    const R_Assess = (<Route path='/report/assess' component={Assess}></Route>);
    const R_Suggest = (<Route path='/report/suggestion' component={Suggestion}></Route>);
    const R_Knowledge = (<Route path='/report/knowledge' component={Knowledge}></Route>);

    const R_Backend = (<Route path='/backend' component={Backend}></Route>);

    const BioRoute = user.id ? (
        <Switch>
            {R_Home}
            {R_Login}{R_Signup}{R_UserInfo}{R_ResetPass}
            {add.barCode ? R_Add : null}{edit.current ? R_Edit : null}
            {R_ReportList}
            {report.current ? R_Overview : null}
            {report.current ? R_Assess : null}
            {report.current ? R_Assess : null}
            {report.current ? R_Suggest : null}
            {R_Knowledge}
            {user.role !== 'user' ? R_Backend : null}
            <Redirect to='/' />
        </Switch>
    ) : (
        <Switch>
            {R_Home}
            {R_Login}{R_Signup}{R_ResetPass}
            {add.barCode ? R_Add : null}
            <Redirect to='/' />
        </Switch>
    )
    return BioRoute;
}
const Data = () => {
    const dispatch = useDispatch();
    dispatch({
        type : BIO.DATA_LOAD
    });
    return (<></>);
}
const App = () => {
    return (
        <Provider store={store}>
            <Data />
            <Router>
                <Nav />
                <SecureRoute />
            </Router>
            <Footer />
        </Provider>
    );
}

export default App;