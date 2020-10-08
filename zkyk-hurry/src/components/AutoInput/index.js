import React, { useRef, useState } from 'react';
import './autoinput.css';
import { debounce } from '../../utils/BIOFunc';

const AutoInput = ({
    withLabel = true,
    label = 'label',
    placeholder,
    effectiveVal,
    ...rest
}) => {
    let ref = useRef();
    let [ options, setOptions ] = useState([]);
    return withLabel ? (
        <div className='autoinput-container'>
            <label>{label}</label>
            <input className='autoinput' type='text' placeholder={placeholder} ref={ref} onChange={
                debounce(() => console.log(ref.current.value), 300)
            } {...rest} />
            <div className='autoinput-options-container'>
                <ul>
                    { options.map( v => <li>{v}</li>) }
                </ul>
            </div>
        </div>
    ) : (
        <div className='autoinput-container'>
            <input className='autoinput' type='text' placeholder={placeholder} ref={ref} onChange={
                () => console.log(ref.current.value)
            } {...rest} />
        </div>
    );
}

export default AutoInput;