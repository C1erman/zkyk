import React, { useState } from 'react';
import './nav.css';

import logoImg from '../../icons/nav-logo-bio.svg';
import Drawer from '../Drawer';

const Nav = () => {
    let [visible, setVisible] = useState(false);
    const clickHandler = () => {
        setVisible(!visible);
    }
    return (
        <>
            <header className='nav-container'>
                <div className='nav-logo-container'>
                    <a href='#/'>
                        <img className='nav-logo' src={logoImg} />
                        博奥汇玖
                    </a> 
                </div>
            </header>
            <Drawer visible={visible} onClick={clickHandler} />
        </>
    );
}

export default Nav;