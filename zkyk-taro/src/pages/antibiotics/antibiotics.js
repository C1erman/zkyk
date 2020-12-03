import React, { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import { AtIndexes, AtSearchBar, AtToast } from 'taro-ui';
import Taro, { useRouter } from '@tarojs/taro';
import { useDispatch } from 'react-redux';
import './antibiotics.css';
import * as BIO from '../../actions';
import { host } from '../../config';

const Antibiotics = () => {
    const router = useRouter()
    const dispatch = useDispatch()

    let [list, setList] = useState([{
        title : '',
        key : '',
        items : []
    }])
    let [search, setSearch] = useState('')
    let [pagefrom, setPageFrom] = useState('')
    let [toastText, setToast] = useState('')

    const mapPageFrom = (from, antibiotics) => {
        if(from == 'add') dispatch({
            type : BIO.ADD_SET_ANTIBIOTICS,
            data : antibiotics
        })
        else if(from == 'edit') dispatch({
            type : BIO.EDIT_SET_ANTIBIOTICS,
            data : antibiotics
        })
    }
    const handleClick = (item) => {
        mapPageFrom(pagefrom, item.name || '');
        Taro.navigateBack();
    }
    const handleSearch = () => {
        if(search.length){
            Taro.request({
                url : host + '/validate/wx/antibiotics',
                method : 'POST',
                data : {
                    antibiotics : search
                },
                header : { 
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
            .then(res => {
                let {data} = res;
                if(data.code === 'success'){
                    setList(data.data);
                    setToast('搜索成功');
                }
                else if(data.code === 'error') setToast(data.info);
            })
            .catch(e => console.log(e))
        }
    }

    useEffect(() => {
        let { from } = router.params;
        setPageFrom(from);

        Taro.request({
            url : host + '/validate/wx/antibiotics',
            method : 'POST',
            data : {
                antibiotics : ''
            },
            header : { 
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            let {data} = res;
            if(data.code === 'success') setList(data.data);
        })
        .catch(e => console.log(e))
    }, [])

    return (
        <View style='height : 100vh'>
            <AtToast isOpened={toastText.length} text={toastText} duration={2000} onClose={() => setToast('')}></AtToast>
            <AtIndexes list={list} isShowToast={false} onClick={handleClick} topKey='顶部'>
                <View>
                    <AtSearchBar placeholder='查找抗生素' 
                      onActionClick={handleSearch} value={search} onChange={(value) => setSearch(value)}
                      onConfirm={handleSearch}
                    />
                </View>
            </AtIndexes>
        </View>
    );
}

export default Antibiotics;