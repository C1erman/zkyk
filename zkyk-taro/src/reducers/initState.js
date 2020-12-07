// 初始 state 对象
const initState = {
    app : {
        currentPage : 0
    },
    user : {
        token : '',
        username : ''
    },
    sampleList : {
        totalPage : 1,
        currentPage : 1,
        search : ''
    },
    report : {
        current : ''
    },
    edit : {
        current : ''
    },
    add : {
        barCode : '',
        sampleId : '',
        testeeId : ''
    },
    // 生成二维码用
    share : {
        add : {
            code : '',
            expire : ''
        },
        signup : {
            code : '',
            expire : ''
        }
    },
    // 接收二维码用
    guide : {
        add : '',
        signup : ''
    },
    antibiotics : {
        add : '',
        edit : ''
    },
}

export default initState;