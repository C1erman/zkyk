// 初始 state 对象
const initState = {
    user : {
        id : '',
        role : '',
        token : ''
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
        current : '',
        personId : '',
        testeeId : '',
        barCode : '',
        sampleId : ''
    },
    add : {
        barCode : '123',
        sampleId : '2'
    },
    globalInfo : ''
}

export default initState;