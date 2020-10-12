import React, { useState } from 'react';
import './nav.css';

import logoImg from '../../icons/nav-logo-bio.svg';
import Drawer from '../Drawer';
import { Link, useLocation } from 'react-router-dom';

const Nav = () => {
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
    return (
        <>
            <NavHeader />
            <Drawer content={
                <div className='nav-link-container'>
                    <Link className='nav-link' to='/report/list' onClick={clickHandler}>报告列表</Link>
                    <Link className='nav-link' to='/user/signup' onClick={clickHandler}>整体情况</Link>
                    <Link className='nav-link' to='/sample/assess' onClick={clickHandler}>健康评估</Link>
                    <Link className='nav-link' to='/sample/suggestion' onClick={clickHandler}>建议</Link>
                    <Link className='nav-link' to='/user/login' onClick={clickHandler}>登录</Link>
                    <Link className='nav-link' to='/user/signup' onClick={clickHandler}>注册</Link>
                </div>
            } controller={controller} />
        </>
    );
}

export default Nav;