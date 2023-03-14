import React from 'react'
import { useGlobleContext } from '../context/appContext';

const Alert = () => {
    const { alertType, alertText } = useGlobleContext()
    return <div className={`alert alert-${alertType}`} > {alertText}</div >;
};

export default Alert