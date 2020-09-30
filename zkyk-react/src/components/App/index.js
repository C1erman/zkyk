import React from  'react';
// router
import { HashRouter as Router,  Switch, Route} from 'react-router-dom';
// redux
import { Provider } from 'react-redux';
import store from '../../reducers';
// component
import Nav from '../Nav';
import Footer from '../Footer';
import Home from '../Home';

const App = () => {
    return (
        <>
            <Router>
                <Switch>
                    <Route path='/' exact component={Home}></Route>
                </Switch>
            </Router>
            <Footer />
        </>
    );
}

export default App;