export default {
  pages: [
    'pages/index/index',
    'pages/add/add',
    'pages/login/login',
    'pages/edit/edit',
    'pages/view/view',
    'pages/infoadd/infoadd',
    'pages/userinfo/userinfo',
    'pages/reportlist/reportlist',

    'pages/moduleA/moduleA',
    'pages/moduleB/moduleB',
    'pages/moduleC/moduleC',
    'pages/moduleD/moduleD',
    'pages/moduleE/moduleE',
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
        iconPath : 'icons/tab/add.png',
        selectedIconPath : 'icons/tab/add_selected.png'
      },
      // {
      //   pagePath : 'pages/add/add',
      //   text : '信息绑定',
      // },
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
      // {
      //   pagePath : 'pages/all/all',
      //   text : '功能',
      //   iconPath : 'icons/tab/home.png',
      //   selectedIconPath : 'icons/tab/home_selected.png'
      // },
      {
        pagePath : 'pages/view/view',
        text : '浏览'
      }
      // {
      //   pagePath : 'pages/edit/edit',
      //   text : '编辑'
      // }
      // {
      //   pagePath : 'pages/moduleA/moduleA',
      //   text : '整体情况'
      // }
      // {
      //   pagePath : 'pages/moduleB/moduleB',
      //   text : '菌群状态分析'
      // }
      // {
      //   pagePath : 'pages/moduleC/moduleC',
      //   text : '菌群状态分析'
      // }
      // {
      //   pagePath : 'pages/moduleD/moduleD',
      //   text : '健康评估'
      // }
    ]
  }
}
