// 提供深拷贝函数，支持具有循环引用的对象
function _forEach(array, callback){
    let i = -1;
    const length = array.length;
    while(++i < length){
        callback(array[i], i);
    }
    return array;
}
// const clone = (target, map = new Map()) => {
//     if(typeof target === 'object'){
//         let isArray = Array.isArray(target);
//         let result = isArray ? [] : {};

//         if(map.get(target)) return map.get(target);
//         map.set(target, result);

//         const keys = isArray ? undefined : Object.keys(target);
//         _forEach(keys || target, (v, i) => {
//             if(keys) i = v;
//             result[i] = clone(target[i], map);
//         })
//         return result;
//     }
//     else return target;
// }
function clone(target, cache = new Set()) {
    if ((typeof target !== 'object' && target !== null) || cache.has(target)) {
        return target
    }
    if (Array.isArray(target)) {
        return target.map(t => {
            cache.add(t)
            return t
        })
    } else {
        return [...Object.keys(target), ...Object.getOwnPropertySymbols(target)].reduce((res, key) => {
            cache.add(target[key])
            res[key] = clone(target[key], cache)
            return res
        }, target.constructor !== Object ? Object.create(target.constructor.prototype) : {}) // 继承
    }
}
// 修改键名：传入键名映射
const modifyKey = (obj, keyMaper) => {
    let result = {};
    let maperArr = Object.keys(keyMaper);
    Object.keys(obj).map(key => maperArr.includes(key) ? result[keyMaper[key]] = obj[key] : result[key] = obj[key]);
    return result;
}
// 检查属性是否有空值
    // 如果有空值则返回 true
const checkEmpty = (obj) => {
    let result = Object.keys(obj).filter(v => {
        return !obj[v];
    });
    return (result.length > 0);
}
export {
    clone,
    modifyKey,
    checkEmpty
}