import React, { useRef, useState } from 'react';
import './autoinput.css';
import { debounce } from '../../utils/BIOFunc';
import Axios from 'axios';

const AutoInput = ({
    label = 'label',
    placeholder,
    effectiveVal,
    method = 'POST',
    url,
    dataName,
    keyName,
    headers,
    asyncAdd = false,
    ...rest
}) => {
    let ref = useRef();
    let [ options, setOptions ] = useState([]);
    let [ checked, setChecked ] = useState(false);

    const request = (data) => {
        Axios({
            method : method,
            url : url,
            data : data,
            headers : headers
        })
        .then(_data => {
            let { data } = _data;
            if(data.code === 'success'){
                setOptions(data.data)
            }
            else if(data.code === 'error'){
                let obj = {};
                obj[keyName] = data.info;
                setOptions([obj])
            }
        })
        .catch(error => {
            console.error(error)
        })
    }
    return (
        <div className='autoinput-container'>
            <label>{label}</label>
            <input className='autoinput' type='text' placeholder={placeholder} ref={ref}
            // blur 先于 click 发生
            onBlur={() => { if(checked) setOptions([]) }}
            onChange={
                debounce(() => {
                    let value = ref.current.value;
                    if(value.length){
                        let data = {};
                        data[dataName] = value;
                        request(data);
                    }
                    else setOptions([]);
                    setChecked(false);
                    typeof effectiveVal === 'function' ? effectiveVal(value) : undefined;
                }, 500)
            } {...rest} />
            <div className='autoinput-options-container'>
                <ul>
                    { options.map( v => {
                        return (
                            <li key={v[keyName]} onClick={() => {
                                ref.current.value = v[keyName];
                                // 直接设置不会触发 onchange
                                typeof effectiveVal === 'function' ? effectiveVal(v[keyName]) : undefined;
                                setOptions([]);
                                setChecked(true);
                            }}><a className='autoinput-options'>{v[keyName].replace('-error', '')}</a></li>
                        );
                    }) }
                </ul>
            </div>
        </div>
    );
}

export default AutoInput;