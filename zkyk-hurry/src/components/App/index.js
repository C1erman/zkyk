import React, { useEffect, useState } from  'react';
import { HashRouter as Router,  Switch, Route, Redirect} from 'react-router-dom';
// redux
import { Provider, useSelector } from 'react-redux';
import store from '../../reducers';

import Footer from '../Footer';
import Home from '../Home';
import Add from '../Add';
import Nav from '../Nav';

const SecureRoute = () => {
    const add = useSelector(state => state.add);
    return (
        add.barCode ? (
            <Switch>
                <Route path='/' exact component={Home}></Route>
                <Route path='/add' component={Add}></Route>
                <Redirect to='/' />
            </Switch>
        ) : (
            <Switch>
                <Route path='/' exact component={Home}></Route>
                <Redirect to='/' />
            </Switch>
        )
    );
}

const App = () => {
    return (
        <Provider store={store}>
            <Nav />
            <Router>
                <SecureRoute />
            </Router>
            <Footer />
        </Provider>
    );
}

export default App;