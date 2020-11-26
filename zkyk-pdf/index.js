import React from 'react';
import ReactDOM from 'react-dom';
import Pdf from './components/Pdf';

ReactDOM.render(<Pdf />, document.querySelector('#app'));
// babel
window.Promise = Promise;
window.Set = Set;
window.Map = Map;
// polyfill
if(!window.location.origin){
    window.location.origin = 
        window.location.protocol 
        + "//" 
        + window.location.hostname 
        + (window.location.port ? ':' + window.location.port : '');
}