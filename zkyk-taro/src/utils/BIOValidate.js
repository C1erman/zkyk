// 验证规则 
const telValidate = (telString) => {
    const telRegexp = /^[1][3,4,5,7,8][0-9]{9}$/;
    return telRegexp.test(telString);
}
const heightValidate = (heightString) => {
    const heightRegexp = /^\d{2,3}(\.\d{2})*$/;
    return heightRegexp.test(heightString);
}
const weightValidate = (weightString) => {
    const weightRegexp = /^\d{2,3}(\.\d{2})*$/;
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

export {
    telValidate,
    heightValidate,
    weightValidate,
    nameValidate,
    emailValidate,
    zhValidate,
    passValidate
}