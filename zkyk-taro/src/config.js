import Taro from '@tarojs/taro';

const hostMaper = (type) => {
    return {
        'develop' : 'http://192.168.1.109:3000',
        'trial' : 'https://devapi.biohuge.cn',
        'release' : 'https://devapi.biohuge.cn'
    }[type]
}

export const host = () => {
    let { envVersion } = Taro.getAccountInfoSync().miniProgram;
    return hostMaper(envVersion || 'trial');
}
export const imgSrc = host() + '/resource'