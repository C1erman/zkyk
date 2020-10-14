import React from 'react';
import './footer.css';
import bioWechat from '../../icons/bio-wechat.png';
import zkykWechat from '../../icons/zkyk-wechat.png';

const Footer = () => {
    let fromTime = '2017',
        endTime = (new Date()).getFullYear();
    return (
        <footer className='footer-wrapper'>
            <div className='footer-svgContainer'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path fill="#ff4f76" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,154.7C384,
                        149,480,107,576,117.3C672,128,768,192,864,218.7C960,245,1056,235,1152,197.3C1248,
                        160,1344,96,1392,64L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,
                        320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"> 
                    </path>
                </svg>
            </div>
            <div className='footer-textContainer'>
                <div className='footer-contact'>
                    <div>致电 : <a href='tel:4000191981'>400-019-1981</a></div>
                    <div className='footer-email'>邮箱 : <a href='mailto:kongdehecg@163.com'>kongdehecg@163.com</a></div>
                </div>
                <div className='footer-wechat'>
                    <div>
                        <img className='footer-wechatImg' src={bioWechat} alt='微信号：zkykjt' />
                        <span>关注博奥汇玖</span>
                    </div>
                    <div>
                        <img className='footer-wechatImg' src={zkykWechat} alt='微信号：zkykjt' />
                        <span>关注中科宜康</span>
                    </div>
                </div>
                <div className='footer-text'>
                    <div>Copyright ©<a href='http://www.biohuge.com/' title='北京博奥汇玖生物科技有限公司'>博奥汇玖</a>{`${fromTime} - ${endTime} `}</div>
                    <div>由<a href='http://www.biohuge.com/' title='北京博奥汇玖生物科技有限公司'>博奥汇玖</a>提供技术支持</div>
                    <div>备案 :<a href='http://beian.miit.gov.cn/' title='域名信息备案管理系统'>京ICP备15003875号-2</a></div>
                </div>
            </div>
            {/* <div className='footer-textContainer'>
                <div className='footer-text'>
                    <div>致电 : 400-998-4113</div>
                    <div className='footer-email'>邮箱 : bh@biohuge.com</div>
                    <div>Copyright ©<a href='http://www.biohuge.com/' title='北京博奥汇玖生物科技有限公司'>北京博奥汇玖生物科技有限公司</a>{`${fromTime} - ${endTime} `}</div>
                    <div>备案 :<a href='http://beian.miit.gov.cn/' title='域名信息备案管理系统'>京ICP备15003875号-2</a></div>
                </div>
                <div className='footer-wechat'>
                    <span>关注中科益康</span>
                    <div>
                        <img className='footer-wechatImg' src={wechat} alt='微信号：zkykjt' />
                    </div>
                </div>
            </div> */}
        </footer>
    );
}
export default Footer;