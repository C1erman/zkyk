// 初始 state 对象
const initState = {
    user : {
        id : '',
        role : '',
        token : ''
    },
    sample : {
        totalPage : 0,
        currentPage : 0,
        list : [
            {
                barCode : '',
                status : '',
                testee : ''
            }
        ],
        current : ''
    },
    add : {
        barCode : 'sdd',
        sampleId : ''
    }
}

export default initState;