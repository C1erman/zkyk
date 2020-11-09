import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import BackSrc from '../../icons/back.svg';
import './share.css';
import { host } from '../../_config';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { slideUp } from '../../utils/slideUp';

const Share = () => {
    const history = useHistory();
    const user = useSelector(state => state.user);
    let [qrCode, setQrCode] = useState({
        code: ''
    });
    let [content, setContent] = useState({
        title: '向受测者分享',
        info: '受测人扫描下方二维码进行挂名信息绑定，或邀请受测人使用链接进行访问：',
        url: '',
        time : ''
    })
    useEffect(() => {
        if(!window.location.origin){
            window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        }
        slideUp();
        Axios({
            method: 'POST',
            url: host + '/ds/bind',
            data: {
                url: window.location.origin + '/#/guide/add/',
                size: 200
            },
            params: {
                'access-token': user.token
            },
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            timeout: 5000
        }).then(_data => {
            const { data } = _data;
            if (data.code === 'error') {
                console.log(data.info);
            }
            else if (data.code === 'success') {
                setQrCode(data.data);
                setContent({
                    title: '向受测者分享',
                    info: '受测人扫描下方二维码进行挂名信息绑定，或邀请受测人使用链接进行访问：',
                    url: data.data.url,
                    time : data.data.expire_at
                })
            }
        }).catch(error => console.log(error));
        document.title = '分享';
        return () => {
            document.title = '信息绑定';
        }
    }, [])

    return (
        <div className='share-container'>
            <div className='share-back'>
                <img className='share-back-icon' src={BackSrc} onClick={() => history.goBack()} />
            </div>
            <div className='share-code-container'>
                <div className='share-code-title'>{content.title}</div>
                <div className='share-code-info'>{content.info}<a target='_blank'>{content.url}</a>{content.time ? (<span className='share-code-info-time'>，过期时间为：{content.time}</span>) : null}</div>
                <div className='share-code-img'>
                    {qrCode.code ? (<img src={host + '/ds/q/' + qrCode.code} />) : (<span>二维码获取中，请稍候</span>)}
                </div>
            </div>
            <div className='share-more'>更多</div>
            <div className='share-divide'></div>
            <div className='share-code-list'>其它分享功能正在开发中，敬请期待。</div>
        </div>
    );
}

export default Share;