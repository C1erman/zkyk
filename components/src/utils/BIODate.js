// 时间初始化
const formatDate = (number, type) => {
    if(type === 'm') number += 1;
    return number < 10 ? '0' + number : number;
}
const getNow = () => {
    var date = new Date();
    return [date.getFullYear(), formatDate(date.getMonth(), 'm'), formatDate(date.getDate())].join('-');
}
const getPreviousDay = () => {
    var date = new Date();
    var millSecond = 24 * 60 * 60 * 1000;
    date.setTime(date.getTime() - millSecond);
    return [date.getFullYear(), formatDate(date.getMonth(), 'm'), formatDate(date.getDate())].join('-');
}

export {
    getNow,
    getPreviousDay
}