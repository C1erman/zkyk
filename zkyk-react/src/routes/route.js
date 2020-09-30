// 路由划分
const commonRoute = [{
    path : '/',
    exact : true
},{
    path : '/privacy',
    exact : true
},{
    path : '/login',
    exact : true
},{
    path : '/signup',
    exact : true
},{
    path : '/user/password/reset',
    exact : true
}];
const authorizedRoute = [{
    path : '/sample',
    exact : false
},{
    path : '/sample/:barcode',
    exact : true
}];

export {
    commonRoute,
    authorizedRoute
}