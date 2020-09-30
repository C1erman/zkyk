// 提供深拷贝函数，支持具有循环引用的对象
function _forEach(array, callback){
    let i = -1;
    const length = array.length;
    while(++i < length){
        callback(array[i], i);
    }
    return array;
}
const clone = (target, map = new Map()) => {
    if(typeof target === 'object'){
        let isArray = Array.isArray(target);
        let result = isArray ? [] : {};

        if(map.get(target)) return map.get(target);
        map.set(target, result);

        const keys = isArray ? undefined : Object.keys(target);
        _forEach(keys || target, (v, i) => {
            if(keys) i = v;
            result[i] = clone(target[i], map);
        })
        return result;
    }
    else return target;
}

export {
    clone
}