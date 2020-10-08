// 防抖：延后执行，控制事件触发次数
const debounce = (func, time) => {
    let timer;
    return () => {
        if(timer) clearTimeout(timer);
        timer = setTimeout(() => {
            func.call(this);
        }, time)
    }
}
// 节流：在单位事件内至多执行一次，控制事件触发频率
const throttle = (func, time) => {
    let timer;
    return () => {
        if(!timer) timer = setTimeout(() => {
            clearTimeout(timer);
            func.call(this);
        }, time)
    }
}

export {
    debounce,
    throttle
}