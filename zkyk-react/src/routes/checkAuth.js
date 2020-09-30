// 检查路由权限

    // 基于角色的访问控制
const checkAuthorization = (role, permissions) => {
    if(!permissions.length) return true;
    if(role instanceof Array){
        for (let index = 0; index < permissions.length; index++) {
            const element = permissions[index];
            
        }
        return false;
    }
}