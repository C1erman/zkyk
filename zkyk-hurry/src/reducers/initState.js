// 初始 state 对象
const initState = {
    user : {
        role : '',
        token : '',
        permission : ''
    },
    sampleList : {
        totalPage : 1,
        currentPage : 1,
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
    share : {
        add : '',
        signup : ''
    },
    pdf : '',
    globalInfo : ''
}

export default initState;