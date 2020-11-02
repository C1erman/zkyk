import React from 'react';
import './nav.css';
import Drawer from '../Drawer';
import * as BIO from '../../actions';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

const Nav = () => {
    const state = useSelector(state => state);
    let { user, report } = state;
    const dispatch = useDispatch();
    let controller = {};

    const clickHandler = () => controller.on('toggle');
    const logoutHandler = () => {
        dispatch({
            type : BIO.LOGOUT_SUCCESS
        });
        controller.on('toggle');
    }
    const BioLinks = user.token ? (
        <div className='nav-link-container'>
            <NavLink className='nav-link' activeClassName='nav-link-active' to='/' exact onClick={clickHandler}>送样填表</NavLink>
            <NavLink className='nav-link' activeClassName='nav-link-active' to='/report/list' onClick={clickHandler}>报告列表</NavLink>
            {report.current ? (<NavLink className='nav-link' activeClassName='nav-link-active' to='/report/overview' onClick={clickHandler}>整体情况</NavLink>) : null}
            {report.current ? (<NavLink className='nav-link' activeClassName='nav-link-active' to='/report/assess' onClick={clickHandler}>健康评估</NavLink>) : null}
            {report.current ? (<NavLink className='nav-link' activeClassName='nav-link-active' to='/report/suggestion' onClick={clickHandler}>建议</NavLink>) : null}
            <NavLink className='nav-link' activeClassName='nav-link-active' to='/report/knowledge' onClick={clickHandler}>菌群知识科普</NavLink>
            {user.role === 'admin_org' || user.role === 'admin' ? <NavLink className='nav-link' activeClassName='nav-link-active' to='/backend' onClick={clickHandler}>后台管理</NavLink> : null}
            <NavLink className='nav-link' activeClassName='nav-link-active' to='/user/info' onClick={clickHandler}>个人中心</NavLink>
            <NavLink className='nav-link' activeClassName='' to='/user/login' onClick={logoutHandler}>登出</NavLink>
        </div>
    ) : (
        <div className='nav-link-container'>
            <NavLink className='nav-link' activeClassName='nav-link-active' to='/user/login' onClick={clickHandler}>登录</NavLink>
            <NavLink className='nav-link' activeClassName='nav-link-active' to='/user/signup' onClick={clickHandler}>注册</NavLink>
        </div>
    );
    return (
        <>
            <Drawer content={BioLinks} controller={controller} />
        </>
    );
}

export default Nav;