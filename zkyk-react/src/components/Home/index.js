import React from 'react';
import HC from './home.css';

const Home = () => {
    return (
        <>
            <div className={HC.container}>
                <div className={HC.textContainer}>
                    <div className={HC.logoContainer}>
                        <img src='../../icons/logo-zkyk.svg' alt='中科宜康' />
                    </div>
                    <div className={HC.title}>中科宜康</div>
                </div>
                <div className={HC.btnContainer}>
                    <button className={HC.btn} onClick={()=>console.log('sd')}>绑定采样</button>
                </div>
            </div>
            <div></div>
        </>
    );
}

export default Home;