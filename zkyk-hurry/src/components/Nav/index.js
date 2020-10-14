import React from 'react';
import './nav.css';

import logoImg from '../../icons/nav-logo-bio.svg';
import Drawer from '../Drawer';
import { Link, useLocation, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Nav = () => {
    let user = useSelector(state => state.user);
    let controller = {};
    const clickHandler = () => {
        controller.on('toggle');
    }
    let isHome = useLocation().pathname === '/';

    const NavHeader = () => {
        return !isHome ? (
            <header className='nav-container'>
                <div className='nav-logo-container'>
                    <a href='#/'>
                        <img className='nav-logo' src={logoImg} />
                        博奥汇玖
                    </a> 
                </div>
            </header>
        ) : null;
    }
    const BioLinks = user.id ? (
        <div className='nav-link-container'>
            <NavLink className='nav-link' activeClassName='nav-link-active' to='/report/list' onClick={clickHandler}>报告列表</NavLink>
            <NavLink className='nav-link' activeClassName='nav-link-active' to='/report/overview' onClick={clickHandler}>整体情况</NavLink>
            <NavLink className='nav-link' activeClassName='nav-link-active' to='/report/assess' onClick={clickHandler}>健康评估</NavLink>
            <NavLink className='nav-link' activeClassName='nav-link-active' to='/report/suggestion' onClick={clickHandler}>建议</NavLink>
            <NavLink className='nav-link' activeClassName='nav-link-active' to=''>登出</NavLink>
        </div>
    ) : (
        <div className='nav-link-container'>
            <NavLink className='nav-link' activeClassName='nav-link-active' to='/user/login' onClick={clickHandler}>登录</NavLink>
            <NavLink className='nav-link' activeClassName='nav-link-active' to='/user/signup' onClick={clickHandler}>注册</NavLink>
        </div>
    );
    return (
        <>
            <NavHeader />
            <Drawer content={BioLinks} controller={controller} />
        </>
    );
}

export default Nav;