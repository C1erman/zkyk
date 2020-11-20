export default {
  pages: [
    'pages/index/index',
    'pages/add/add',
    'pages/login/login',
    'pages/userinfo/userinfo'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    position : 'bottom',
    color : '#666666',
    selectedColor : '#ff4f76',
    backgroundColor : '#ffffff',
    borderStyle : 'black',
    'list': [
      {
        pagePath : 'pages/index/index',
        text : '绑定采样',
        
      },
      {
        pagePath : 'pages/userinfo/userinfo',
        text : '我'
      },
      {
        pagePath : 'pages/login/login',
        text : '登录'
      }
    ]
  }
}
