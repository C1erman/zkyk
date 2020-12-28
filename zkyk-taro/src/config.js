import Taro from '@tarojs/taro';

const hostMaper = (type) => {
    return {
        // develop : 'http://192.168.1.109:3000',
        develop : 'https://devapi.biohuge.cn',
        trial : 'https://devapi.biohuge.cn',
        release : 'https://api.biohuge.cn'
    }[type]
}

export const host = () => {
    let { envVersion } = Taro.getAccountInfoSync().miniProgram;
    return hostMaper(envVersion || 'trial');
}
export const imgSrc = host() + '/resource'