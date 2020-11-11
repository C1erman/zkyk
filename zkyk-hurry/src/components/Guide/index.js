import React, { useEffect, useState } from 'react';
import './guide.css';
import { useParams, useHistory } from 'react-router-dom';
import Axios from 'axios';
import { host } from '../../_config';
import Alert from '../Alert';
import { useDispatch } from 'react-redux';
import * as BIO from '../../actions';

const Guide = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const history = useHistory();
    let [message, setMsg] = useState('');
    let controller = {};

    useEffect(() => {
        let { key, to } = params;
        Axios({
            method : 'GET',
            url : host + '/ds/' + key,
            headers : {
                'Content-Type' : 'application/json; charset=UTF-8'
            },
            timeout : 5000
        }).then(_data => {
            const {data} = _data;
            if(data.code === 'error'){
                setMsg(data.info);
                controller.on('toggle');
            }
            else if(data.code === 'success') {
                switch(to){
                    case 'add' : {
                        dispatch({
                            type : BIO.SHARE_REPORT_ADD,
                            data : data.data.access_code
                        });
                        history.push('/');
                        break;
                    }
                    case 'signup' : {
                        console.log('sd')
                        dispatch({
                            type : BIO.SHARE_SIGN_UP,
                            data : data.data.access_code
                        });
                        history.push('/user/signup');
                        // history.push({
                        //     pathname : '/user/signup',
                        //     state : {
                                
                        //     }
                        // });
                        break;
                    }
                }
            }
        }).catch(error => console.log(error));
    }, [])
    return (
        <div className='guide-container'>
            <div className='guide-loading'>正在处理请求中，请稍候。</div>
            <Alert controller={controller} content={message} beforeClose={() => history.push('/')} />
        </div>
    );
}

export default Guide;