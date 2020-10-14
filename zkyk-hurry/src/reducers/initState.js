// 初始 state 对象
const initState = {
    user : {
        id : '21',
        role : '',
        token : 'r9YftCtqjHjSWdPNazloHvM2swCJCenI'
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
        barCode : '',
        sampleId : ''
    }
}

export default initState;