import React from 'react';
import './nav.css';

import bioLogoImg from '../../icons/nav-logo-bio.svg';
import zkykLogoImg from '../../icons/nav-logo-zkyk.svg';
import Drawer from '../Drawer';
import * as BIO from '../../actions';
import { useLocation, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

const Nav = () => {
    let user = useSelector(state => state.user);
    let report = useSelector(state => state.report);
    const dispatch = useDispatch();
    let controller = {};
    const clickHandler = () => {
        controller.on('toggle');
    }
    const logoutHandler = () => {
        dispatch({
            type : BIO.LOGOUT_SUCCESS
        });
        controller.on('toggle');
    }

    let isHome = useLocation().pathname === '/';

    const NavHeader = () => {
        return !isHome ? (
            <header className='nav-container'>
                <div className='nav-logo-container'>
                    <a href='#/'>
                        <img className='nav-logo' src={bioLogoImg} />
                        ×
                        <img className='nav-logo-zkyk' src={zkykLogoImg} />
                    </a> 
                </div>
            </header>
        ) : null;
    }
    const BioLinks = user.id ? (
        <div className='nav-link-container'>
            <NavLink className='nav-link' activeClassName='nav-link-active' to='/' exact onClick={clickHandler}>绑定采样</NavLink>
            <NavLink className='nav-link' activeClassName='nav-link-active' to='/report/list' onClick={clickHandler}>报告列表</NavLink>
            {report.current ? (<NavLink className='nav-link' activeClassName='nav-link-active' to='/report/overview' onClick={clickHandler}>整体情况</NavLink>) : null}
            {report.current ? (<NavLink className='nav-link' activeClassName='nav-link-active' to='/report/assess' onClick={clickHandler}>健康评估</NavLink>) : null}
            {report.current ? (<NavLink className='nav-link' activeClassName='nav-link-active' to='/report/suggestion' onClick={clickHandler}>建议</NavLink>) : null}
            {user.role === 'admin_org' || user.role === 'admin' ? <NavLink className='nav-link' activeClassName='nav-link-active' to='/backend' onClick={clickHandler}>后台管理</NavLink> : null}
            <NavLink className='nav-link' activeClassName='' to='/' onClick={logoutHandler}>登出</NavLink>
        </div>
    ) : (
        <div className='nav-link-container'>
            <NavLink className='nav-link' activeClassName='nav-link-active' to='/' exact onClick={clickHandler}>绑定采样</NavLink>
            <NavLink className='nav-link' activeClassName='nav-link-active' to='/user/login' onClick={clickHandler}>登录</NavLink>
            <NavLink className='nav-link' activeClassName='nav-link-active' to='/user/signup' onClick={clickHandler}>注册</NavLink>
        </div>
    );
    return (
        <>
            {/* <NavHeader /> */}
            <Drawer content={BioLinks} controller={controller} />
        </>
    );
}

export default Nav;