// 验证规则 
const telValidate = (telString) => {
    const telRegexp = /^[1][3,4,5,7,8][0-9]{9}$/;
    return telRegexp.test(telString);
}
const heightValidate = (heightString) => {
    const heightRegexp = /^\d{2,3}(\.\d{1,2})*$/;
    return heightRegexp.test(heightString);
}
const weightValidate = (weightString) => {
    const weightRegexp = /^\d{2,3}(\.\d{1,2})*$/;
    return weightRegexp.test(weightString);
}
const nameValidate = (nameString) => {
    const nameRegexp = /^[\u4e00-\u9fa5]{1,3}$/;
    return nameRegexp.test(nameString);
}
const emailValidate = (emailString) => {
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegexp.test(emailString);
}
const zhValidate = (string) => {
    const zhRegexp = /[\u4e00-\u9fa5]/;
    return !zhRegexp.test(string);
}
const passValidate = (passString) => {
    const passRegexp = /^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z\d_]{6,20}$/;
    return passRegexp.test(passString);
}
const userNameValidate = (userNameString) => {
    const userNameRegexp = /^[\u4e00-\u9fa5\dA-Za-z]{4,20}$/;
    return userNameRegexp.test(userNameString);
}

const TYPE = {
    TEL : 'tel', HEIGHT : 'height', WEIGHT : 'weight',
    NAME : 'name', EMAIL : 'email', ZH : 'zh', PASS : 'pass', USERNAME : 'username'
}
const typeMaper = {
    [TYPE.TEL] : telValidate,
    [TYPE.HEIGHT] : heightValidate,
    [TYPE.WEIGHT] : weightValidate,
    [TYPE.NAME] : nameValidate,
    [TYPE.EMAIL] : emailValidate,
    [TYPE.ZH] : zhValidate,
    [TYPE.PASS] : passValidate,
    [TYPE.USERNAME] : userNameValidate
}
const infoMaper = {
    [TYPE.TEL] : '请输入正确的电话号码',
    [TYPE.HEIGHT] : '身高格式错误，最多支持小数点后两位',
    [TYPE.WEIGHT] : '体重格式错误，最多支持小数点后两位',
    [TYPE.NAME] : '请输入一到三个汉字',
    [TYPE.EMAIL] : '请输入正确的邮箱地址',
    [TYPE.ZH] : '请输入汉字',
    [TYPE.PASS] : '请输入6到20位的密码，支持大小写字母、数字与下划线组合',
    [TYPE.USERNAME] : '请输入4到20位的用户名，支持中英文与数字组合'
}

const validate = (obj = [
    {data : '', type : TYPE.TEL, info : '手机号格式错误'}
]) => {
    let result = obj.map((v) => {
        if(typeMaper[v.type](v.data)) return {
            validated : true
        }
        else return {
            validated : false,
            info : v.info ? v.info : infoMaper[v.type]
        }
    })
    let validated = result.filter((v) => !v.validated);
    if(validated.length) return validated[0];
    else return {
        validated : true
    }
}

const BIOValidate = {
    TYPE,
    validate
}

export {
    BIOValidate
}