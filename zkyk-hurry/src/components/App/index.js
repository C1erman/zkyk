import React, { useEffect, useState } from  'react';
import { HashRouter as Router,  Switch, Route, Redirect, useLocation} from 'react-router-dom';
// redux
import { Provider, useSelector } from 'react-redux';
import store from '../../reducers';

import Footer from '../Footer';
import Home from '../Home';
import Add from '../Add';
import Nav from '../Nav';
import Login from '../Login';
import Signup from '../Signup';

const SecureRoute = () => {
    const add = useSelector(state => state.add);
    const user = useSelector(state => state.user);

    const R_Home = (<Route path='/' exact component={Home}></Route>);
    const R_Add = (<Route path='/add' component={Add}></Route>);
    const R_Login = (<Route path='/user/login' component={Login}></Route>);
    const R_Signup = (<Route path='/user/signup' component={Signup}></Route>);

    const BioRoute = user.id ? (
        <Switch>
            {R_Home}{add.barCode ? R_Add : null}{R_Login}{R_Signup}
            <Redirect to='/' />
        </Switch>
    ) : (
        <Switch>
            {R_Home}{R_Login}{R_Signup}
            <Redirect to='/' />
        </Switch>
    )
    return BioRoute;
}

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <Nav />
                <SecureRoute />
            </Router>
            <Footer />
        </Provider>
    );
}

export default App;