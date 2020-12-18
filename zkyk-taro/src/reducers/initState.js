// 初始 state 对象
const initState = {
    // 用户信息
    user : {
        token : '',
        username : ''
    },
    // 报告列表页
    sampleList : {
        totalPage : 1,
        currentPage : 1,
        search : ''
    },
    // 浏览报告
    report : {
        current : ''
    },
    // 编辑绑定信息
    edit : {
        current : ''
    },
    // 绑定采样
    add : {
        barCode : '',
        sampleId : '',
        testeeId : ''
    },
    // 使用二维码
        // 存放 access-code
    guide : {
        add : '',
        signup : ''
    },
    // 抗生素搜索引导
    antibiotics : {
        add : '',
        edit : '',
        report : ''
    },
}

export default initState;