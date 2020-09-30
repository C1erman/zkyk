import React from 'react';
import FC from './footer.css';
// config
import config from '../../config.json';

const Footer = () => {
    let fromTime = config['copyright']['since'],
        endTime = (new Date()).getFullYear();
    return (
        <footer className={FC.wrapper}>
            <div className={FC.svgContainer}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#1a1a1a" fillOpacity="1" 
                        d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,213.3C672,203,
                        768,117,864,106.7C960,96,1056,160,1152,197.3C1248,235,1344,245,1392,250.7L1440,
                        256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,
                        672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                    </path>
                </svg>
            </div>
            <div className={FC.textContainer}>
                <div className={FC.text}>
                    <div>致电 : 400-019-1981</div>
                    <div className={FC.email}>邮箱 : kongdehecg@163.com</div>
                    <div>Copyright ©<a href='http://www.zgzkyk.com/' title='中科宜康生物科技有限公司'>中科宜康生物科技有限公司</a>{`${fromTime} - ${endTime} `}</div>
                    <div>
                        由<a href='http://www.biohuge.com/' title='北京博奥汇玖生物科技有限公司'>博奥汇玖</a>提供技术支持
                    </div>
                </div>
                <div className={FC.wechat}>
                    <span>关注我们</span>
                    <div>
                        <img className={FC.wechatImg} src='http://16062084.s21i.faiusr.com/2/ABUIABACGAAg5v3K1wUo1LSBpQQwgAo4gAo!160x160.jpg.webp' alt='微信号：zkykjt' />
                    </div>
                </div>
            </div>
        </footer>
    );
}
export default Footer;