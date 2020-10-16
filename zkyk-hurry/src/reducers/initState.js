// 初始 state 对象
const initState = {
    user : {
        id : localStorage.getItem('id') || '',
        role : localStorage.getItem('role') || '',
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
        current : localStorage.getItem('current') || '2'
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