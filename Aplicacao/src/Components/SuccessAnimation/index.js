import React from 'react'
import './styles.scss'
import { Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { selecionarDevice } from '../../store/Modulos/Devices/actions'
import { useState } from 'react';



export default function SuccessAnimation(props) {
    const dispatch = useDispatch()
    const device = useSelector(state => state.devicesState.devices[0])
    const [animation, setAnimation] = useState(false)


    dispatch(selecionarDevice(props.device))

    setTimeout(() => {
        setAnimation(true)
    }, 1500)


    if (animation === true) {
        return <Redirect to='/dispositivos-cadastrados' />
    }

    return (
        <div class="success-checkmark">
            <div class="check-icon">
                <span class="icon-line line-tip"></span>
                <span class="icon-line line-long"></span>
                <div class="icon-circle"></div>
                <div class="icon-fix"></div>
            </div>

        </div>
    )
}