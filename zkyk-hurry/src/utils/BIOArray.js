// 一个或多个数据去重 --> 最快
const distinct = (one, ...rest) => {
    let array = [];
    let i = -1;
    while(++ i < rest.length) array.concat(rest[i]);

    let o = {}, result = [];
    while(array.length){
        let tem = array.pop();
        if(o[tem] === undefined){
            result.push(tem);
            o[tem] = tem;
        }
    }
    return result;
}
// 数组范围填充函数 类似 python 中的 range
const range = (start, end) => {
    return Object.keys(Array.apply(null, { length : end - start + 1}))
        .map((v, i) => {
            return i + start;
        })
}

export {
    distinct,
    range
}