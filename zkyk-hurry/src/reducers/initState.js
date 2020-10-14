// 初始 state 对象
const initState = {
    user : {
        id : '0',
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
        current : '2'
    },
    add : {
        barCode : '132',
        sampleId : '123'
    }
}

export default initState;