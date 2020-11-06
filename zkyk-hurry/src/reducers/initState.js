// 初始 state 对象
const initState = {
    user : {
        role : '',
        token : '',
        email : '',
        permission : ''
    },
    sampleList : {
        totalPage : 0,
        currentPage : 0,
        list : [
            {
                barCode : '',
                status : '',
                testee : ''
            }
        ],
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
        add : ''
    },
    globalInfo : ''
}

export default initState;