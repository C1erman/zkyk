import React, { useEffect, useState } from  'react';
import { HashRouter as Router,  Switch, Route, Redirect} from 'react-router-dom';

import Footer from '../Footer';
import Home from '../Home';
import Add from '../Add';

const App = () => {
    const [code, setCode] = useState('');
    let SecureRoute = () => code.length ?
        (
            <Switch>
                <Route path='/' exact component={Home}></Route>
                <Route path='/add' component={Add}></Route>
            </Switch>
        ) : (
            <Switch>
                <Route path='/' exact component={Home}></Route>
                <Redirect to='/' />
            </Switch>
        )
    return (
        <>
            <Router>
                <SecureRoute />
            </Router>
            <Footer />
        </>
    );
}

export default App;