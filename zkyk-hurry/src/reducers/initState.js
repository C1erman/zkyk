// 初始 state 对象
const initState = {
    user : {
        id : localStorage.getItem('id') || '',
        role : '',
        token : localStorage.getItem('token') || ''
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
        barCode : '',
        sampleId : ''
    }
}

export default initState;