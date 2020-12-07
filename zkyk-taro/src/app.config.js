export default {
  pages: [
    'pages/index/index',
    'pages/add/add',
    'pages/login/login',
    'pages/edit/edit',
    'pages/view/view',
    'pages/share/share',
    'pages/infoadd/infoadd',
    'pages/userinfo/userinfo',
    'pages/reportlist/reportlist',
    'pages/antibiotics/antibiotics',

    'pages/moduleA/moduleA',
    'pages/moduleB/moduleB',
    'pages/moduleC/moduleC',
    'pages/moduleD/moduleD',
    'pages/moduleE/moduleE',
    'pages/moduleF/moduleF',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  networkTimeout: {
    request: 30000,
    downloadFile: 30000
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
        iconPath : 'icons/tab/add.png',
        selectedIconPath : 'icons/tab/add_selected.png'
      },
      {
        pagePath : 'pages/reportlist/reportlist',
        text : '报告列表',
        iconPath : 'icons/tab/list.png',
        selectedIconPath : 'icons/tab/list_selected.png'
      },
      {
        pagePath : 'pages/userinfo/userinfo',
        text : '我的',
        iconPath : 'icons/tab/user.png',
        selectedIconPath : 'icons/tab/user_selected.png'
      },
      {
        pagePath : 'pages/share/share',
        text : '分享绑定',
      }
    ]
  }
}
