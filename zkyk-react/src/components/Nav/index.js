import React from 'react';
import { NavLink } from 'react-router-dom';
import NavStyle from './nav.css';

const Nav = () => (
    <div className={NavStyle.nav}>
        <div className={NavStyle['nav-wrapper']}>
            <div className={NavStyle['nav-logo']}>
                <NavLink to='/'>
                    <img src='' alt='中科宜康' />
                </NavLink>
            </div>
            <div className={NavStyle['nav-links']}>
                <NavLink activeClassName={NavStyle.active} to='/sort'>疾病预测</NavLink>
                <NavLink activeClassName={NavStyle.active} to='/foods'>饮食推荐</NavLink>
            </div>
        </div>
    </div>
)

export default Nav;