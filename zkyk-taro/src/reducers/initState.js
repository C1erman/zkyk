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
    backendList : {
        totalPage : 1,
        currentPage : 1,
    },
    share : {
        add : '',
        signup : ''
    },
    pdf : '',
    globalInfo : ''
}

export default initState;