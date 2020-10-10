// 初始 state 对象
const initState = {
    user : {
        id : '12',
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
        barCode : 'sd',
        sampleId : ''
    }
}

export default initState;