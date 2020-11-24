export default {
  pages: [
    'pages/index/index',
    'pages/add/add',
    'pages/login/login',
    'pages/infoadd/infoadd',
    'pages/userinfo/userinfo',
    'pages/reportlist/reportlist',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  networkTimeout: {
    request: 10000,
    downloadFile: 10000
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
        text : '送样填表',
      },
      {
        pagePath : 'pages/add/add',
        text : '信息绑定',
      },
      {
        pagePath : 'pages/userinfo/userinfo',
        text : '个人中心', 
      },
      {
        pagePath : 'pages/reportlist/reportlist',
        text : '报告列表', 
      }
    ]
  }
}
