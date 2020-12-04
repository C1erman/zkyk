import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { useSelector, useDispatch } from 'react-redux';
import Taro, { useDidShow } from '@tarojs/taro';
import { AtButton, AtFloatLayout, AtIcon, AtToast, AtSearchBar, AtAccordion, AtMessage } from 'taro-ui';
import './reportlist.css';
import { host, imgSrc } from '../../config';
import * as BIO from '../../actions';
import Pager from '../../component/Pager';

const ReportList = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const sampleList = useSelector(state => state.sampleList)

    let [accordionOpen, setAccordionOpen] = useState(false)

    let [list, setList] = useState([])
    let [listCurrent, setCurrent] = useState(+ sampleList.currentPage)
    let [listPagination, setPagination] = useState({
        total : 1,
        pageSize : 1
    })
    let listNumPerPage = 7
    let [detailStatus, setStatus] = useState([])

    let [listSearch, setListSearch] = useState(sampleList.search || '');
    let [listSearchText, setListSearchText] = useState(sampleList.search || '')

    let [testeeCode, setTesteeCode] = useState({
        name : '',
        code : ''
    })
    let br = '\n';
    let [toastText, setToast] = useState('')

    let [listSort, setListSort] = useState({
        name : '',
        barcode : '',
        status : ''
    });
    let [listSortCurrent, setListSortCurrent] = useState('')

    useDidShow(() => {
        if(user.token){
            let current = (+ sampleList.currentPage) || 1;
            let query = sampleList.search || '';
            Taro.request({
                url : host + '/sample/list',
                method : 'GET',
                data : {
                    'access-token' : user.token,
                    pageNum : listNumPerPage,
                    page : current,
                    query : query,
                    field : listSortCurrent,
                    order : listSort[listSortCurrent] || ''
                },
                header : {
                    'Content-Type' : 'application/json; charset=UTF-8'
                }
            })
            .then(res => {
                let {data} = res;
                if(data.code === 'success'){
                    setList(data.data.list);
                    setPagination(data.data.pagination);
                    setCurrent(current);
                    setListSearch(query);
                    setListSearchText(query);
                }
            })
            .catch(e => console.log(e))
        }
    });

    const mapButtonStatus = (status) => {
        switch(status){
            case 'failed' : return true;
            case 'succeeded' : return true;
            case 'experimenting' : return true;
            default : return false;
        }
    }
    const getStatus = (sampleId) => {
        Taro.request({
            url : host + '/sample/status',
            method : 'GET',
            data : {
                'access-token' : user.token,
                id : sampleId
            },
            header : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let {data} = res;
            if(data.code === 'success'){
                setStatus(data.data);
            }
        }).catch(e => console.log(e))
    }
    const getTesteeCode = (barcode) => {
        Taro.request({
            url : host + '/sample/testee/code',
            method : 'GET',
            data : {
                'access-token' : user.token,
                barcode : barcode
            },
            header : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let {data} = res;
            if(data.code === 'success'){
                setTesteeCode(data.data);
            }
        })
        .catch(e => console.log(e))
    }
    const initialList = () => {
        Taro.request({
            url : host + '/sample/list',
            method : 'GET',
            data : {
                'access-token' : user.token,
                pageNum : listNumPerPage
            },
            header : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let {data} = res;
            if(data.code === 'success'){
                setToast('查询条件已清空')
                setList(data.data.list)
                setPagination(data.data.pagination);
                setCurrent(1);
                setListSearch('');
                setListSearchText('');

                setListSortCurrent('');
                setListSort({
                    name : '',
                    barcode : '',
                    status : ''
                });
            }
            else setToast(data.info);
        })
        .catch(e => console.log(e))
    }
    const clearSearch = () => {
        dispatch({
            type : BIO.REPORT_LIST_CURRENT_PAGE,
            data : 1
        });
        dispatch({
            type : BIO.REPORT_LIST_CURRENT_SEARCH,
            data : ''
        });
        initialList();
    }
    const getCurrentList = (currentPage) => {
        setCurrent(currentPage)
        dispatch({
            type : BIO.REPORT_LIST_CURRENT_PAGE,
            data : currentPage
        });
        Taro.request({
            url : host + '/sample/list',
            method : 'GET',
            data : {
                'access-token' : user.token,
                page : currentPage,
                pageNum : listNumPerPage,
                query : listSearch,
                field : listSortCurrent,
                order : listSort[listSortCurrent]
            },
            header : {
                'Content-Type' : 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let {data} = res;
            if(data.code === 'success'){
                setList(data.data.list)
                setPagination(data.data.pagination);

                setListSearchText(listSearch);
                dispatch({
                    type : BIO.REPORT_LIST_CURRENT_SEARCH,
                    data : listSearch
                });
            }
        })
        .catch(e => console.log(e))
    }
    const mapStatusIcon = (status) => {
        return {
            untreated : imgSrc + '/icons/list/untreated_active.svg',
            registered : imgSrc + '/icons/list/registered_active.svg',
            received : imgSrc + '/icons/list/received_active.svg',
            experimenting : imgSrc + '/icons/list/experimenting_active.svg',
            succeeded : imgSrc + '/icons/list/succeeded_active.svg',
            completed : imgSrc + '/icons/list/completed_active.svg',
            failed : imgSrc + '/icons/list/failed.svg'
        }[status]
    }
    const handleViewReport = (reportId) => {
        if(reportId === 'error') setToast('抱歉，此份报告暂时无法查看');
        else{
            dispatch({
                type : BIO.REPORT_SELECT,
                data : { current : reportId }
            })
            Taro.navigateTo({
                url : '/pages/view/view?id=' + reportId
            })
        }
    }
    const handleEditSample = (sampleId) => {
        dispatch({
            type : BIO.REPORT_EDIT,
            data : { current : sampleId }
        })
        Taro.navigateTo({
            url : '/pages/edit/edit'
        })
    }
    const mapOperate = (operate, reportId, sampleId) => {
        if(operate === '查看') return handleViewReport(reportId);
        else if(operate === '编辑') return handleEditSample(sampleId);
        else if(operate === '已锁定') return false;
        else return false;
    }
    const handleListSearch = () => {
        if(listSearch.length){
            Taro.request({
                url : host + '/sample/list',
                method : 'GET',
                data : {
                    'access-token' : user.token,
                    pageNum : listNumPerPage,
                    query : listSearch
                },
                header : {
                    'Content-Type' : 'application/json; charset=UTF-8'
                }
            })
            .then(res => {
                let {data} = res;
                if(data.code === 'success'){
                    setToast('查询成功')
                    setList(data.data.list);
                    setPagination(data.data.pagination);
                    setCurrent(1);
                    setListSearch(listSearch);
                    setListSearchText(listSearch);

                    setListSortCurrent('');
                    setListSort({
                        name : '',
                        barcode : '',
                        status : ''
                    });
                    dispatch({
                        type : BIO.REPORT_LIST_CURRENT_PAGE,
                        data : 1
                    });
                    dispatch({
                        type : BIO.REPORT_LIST_CURRENT_SEARCH,
                        data : listSearch
                    });
                }
            })
            .catch(e => console.log(e))
        }
        else clearSearch();
    }
    const switchOrder = (current) => {
        if(!current) return 'desc';
        else if(current === 'desc') return 'asc';
        else if(current === 'asc') return '';
    }
    const mapListSort = (field) => {
        if(field === listSortCurrent) return listSort[field] === 'desc' ? 'at-icon at-icon-chevron-down' : 'at-icon at-icon-chevron-up';
        else return '';
    }
    const handleListSort = (field) => {
        let order = switchOrder(listSort[field]);
        if(order){
            Taro.request({
                url : host + '/sample/list',
                method : 'GET',
                data : {
                    'access-token' : user.token,
                    page : '',
                    pageNum : listNumPerPage,
                    query : listSearch,
                    field : field,
                    order : order
                },
                header : {
                    'Content-Type' : 'application/json; charset=UTF-8'
                }
            })
            .then(res => {
                let {data} = res;
                if(data.code === 'success'){
                    setList(data.data.list)
                    setPagination(data.data.pagination);
                    setCurrent(1);

                    setListSortCurrent(field);
                    let sort = {
                        name : '',
                        barcode : '',
                        status : ''
                    };
                    sort[field] = order;
                    setListSort(sort);
                    setToast('排序成功')
                }
            })
            .catch(e => console.log(e))
        }
        else{
            Taro.request({
                url : host + '/sample/list',
                method : 'GET',
                data : {
                    'access-token' : user.token,
                    page : '',
                    pageNum : listNumPerPage,
                    query : listSearch,
                    field : '',
                    order : ''
                },
                header : {
                    'Content-Type' : 'application/json; charset=UTF-8'
                }
            })
            .then(res => {
                let {data} = res;
                if(data.code === 'success'){
                    setList(data.data.list)
                    setPagination(data.data.pagination);
                    setCurrent(1);

                    setListSortCurrent('');
                    setListSort({
                        name : '',
                        barcode : '',
                        status : ''
                    });
                }
            })
            .catch(e => console.log(e))
        }
    }

    return (
        <>
            <AtMessage />
            <AtToast isOpened={toastText.length} text={toastText} duration={2000} onClose={() => setToast('')}></AtToast>
            <View className='reportList-container'>
                <View className='reportList-title'><Text className='text'>选择你要查看的报告</Text></View>
                <View className='reportList-search'>
                    <AtSearchBar className='reportList-search-input' disabled={!user.token}
                      value={listSearch} onChange={(value) => setListSearch(value)} onActionClick={handleListSearch} onConfirm={handleListSearch}
                    />
                    <View className='reportList-search-info'>可输入受测人、样本编号与状态进行查询，多条件查询时请用空格连接。</View>
                </View>
                <AtAccordion open={accordionOpen} onClick={() => setAccordionOpen(!accordionOpen)} hasBorder={false} title='说明'
                  icon={{value : 'help', color : '#666666', size : '20'}}
                >
                    <View className='reportList-info'>
                        在实验结束、生成报告之前，您都有机会对您填写的信息进行修改；报告生成之后，您只能查看而不能修改相关信息。<Text>{br}点击受测人姓名查看受测人编码，点击报告的当前状态查看状态详情。</Text>
                        <Text>{br}支持对受测人、样本编号与当前状态的排序操作，请点击表头。</Text>
                    </View>
                </AtAccordion>
                {
                    !user.token ? (
                        <View className='reportList-empty'>请登录过后再来查看。</View>
                    ) : !list.length ? (
                    <>
                        {listSearchText.length ? (
                            <View className='reportList-search-show'>
                                当前查询条件为：<Text className='reportList-search-text'>{listSearchText}</Text>
                                <AtButton className='reportList-search-button' size='small' circle type='secondary' onClick={clearSearch}>点击清空</AtButton>
                            </View>
                        ) : null}
                        <View className='reportList-empty'>抱歉，暂时没有报告可以展示。</View>
                    </>
                ) : (
                    <>
                        {listSearchText.length ? (
                            <View className='reportList-search-show'>
                                当前查询条件为：<Text className='reportList-search-text'>{listSearchText}</Text>
                                <AtButton className='reportList-search-button' size='small' circle type='secondary' onClick={clearSearch}>点击清空</AtButton>
                            </View>
                        ) : null}
                        <View className='reportList-table'>
                            <View className='reportList-table-head'>
                                <View className='tr'>
                                    <View className='td' onClick={() => handleListSort('name')}><View className={mapListSort('name')}>受测人</View></View>
                                    <View className='td' onClick={() => handleListSort('barcode')}><View className={mapListSort('barcode')}>样本编号</View></View>
                                    <View className='td' onClick={() => handleListSort('status')}><View className={mapListSort('status')}>当前状态</View></View>
                                    <View className='td'>操作</View>
                                </View>
                            </View>
                            <View className='reportList-table-body'>
                                {list.map((v, i) => <View key={i} className='reportList-table-tr tr'>
                                    <View className='td' onClick={() => getTesteeCode(v.sample_barcode)}>{v.person_name}</View>
                                    <View className='td'>{v.sample_barcode + (v.version ? ' V' + v.version : '')}</View>
                                    <View className={'td ' + v.status_en} onClick={() => getStatus(v.sample_id)}>{v.status_zh}</View>
                                    <View className='td'><AtButton className='bio-button' size='small' circle disabled={mapButtonStatus(v.status_en)} onClick={() => mapOperate(v.operate, v.report_id || 'error', v.sample_id)}>{v.operate}</AtButton></View>
                                </View>)}
                            </View>
                        </View>
                        <Pager current={listCurrent} total={listPagination.pageSize} prevClick={(currentPage) => getCurrentList(currentPage)} nextClick={(currentPage) => getCurrentList(currentPage)} />
                        <AtFloatLayout isOpened={detailStatus.length > 0} title='状态详情' onClose={() => setStatus([])}>
                            <View className='reportList-status'>
                                { detailStatus.map((v, i) => (<View key={i} className={'reportList-status-item ' + v.status_en}>
                                    <View className='reportList-status-time'>
                                        <Text>{v.year}</Text>
                                        <Text className='important'>{v.month}</Text>
                                        <Text>{v.date}</Text>
                                    </View>
                                    <View className='reportList-status-icon'>
                                        <Image className='reportList-status-icon-self' src={mapStatusIcon(v.status_en)} />
                                    </View>
                                    <View className='reportList-status-content'>{v.detail}</View>
                                </View>))}
                            </View>
                        </AtFloatLayout>
                        <AtFloatLayout  isOpened={testeeCode.name} title='受测人编码' onClose={() => setTesteeCode({})}>
                            <View className='reportList-testeeCode'>
                                <Text className='name'>{testeeCode.name}</Text>的受测人编码为<Text className='code'>{testeeCode.code}</Text>。
                                <View>下一次为该受测人填写信息时请输入该编码。</View>
                            </View>
                        </AtFloatLayout>
                    </>
                )}
            </View>
        </>
    );
}

export default ReportList;