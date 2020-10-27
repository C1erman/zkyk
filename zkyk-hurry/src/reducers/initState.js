// 初始 state 对象
const initState = {
    user : {
        id : '',
        role : '',
        token : '',
        email : ''
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
    globalInfo : ''
}

export default initState;