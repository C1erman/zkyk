// 初始 state 对象
const initState = {
    user : {
        id : '50',
        role : '',
        token : 'VKGO6tjrjWYzVIPrCL8gwrrFKfEx8N7Q'
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