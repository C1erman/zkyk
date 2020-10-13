// 初始 state 对象
const initState = {
    user : {
        id : '21',
        role : '',
        token : 'kREy-oSrHlWBe33XbVn_vnTBFEz9kg9k'
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
        current : ''
    },
    add : {
        barCode : '',
        sampleId : ''
    }
}

export default initState;