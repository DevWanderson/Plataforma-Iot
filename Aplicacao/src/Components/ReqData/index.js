import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../Connections/api'
import { updateDevicesList } from '../../Utils/stateControllers'
import { selecionarDevice, atualizarDevices, dadosDevice } from '../../Reducers/ReduxDevices/DeviceActions';
import { setor, dadosSetor } from '../../Reducers/ReduxSetor/SetorActions';
import { alertasGeral } from '../../Reducers/ReduxGerenciamentoAlerts/AlertGeActions';
import { dadosType } from '../../Reducers/ReduxTypes/TypeActions';
import { statusLoad } from '../../Reducers/ReduxLoad/LoadActions';
import { setDevice } from '../../Utils/stateControllers';
import { useLocation } from 'react-router-dom'
import Setor from '../Setor';
import './styles.css';


export default function ReqData({ props }) {
    const devices = useSelector((state) => state.deviceState.devices)
    const selectedDevice = useSelector((state) => state.deviceState.selectedDevice)
    const selectedSetor = useSelector((state) => state.setorState.selectSetor);
    const setorDados = useSelector((state) => state.setorState.dadosSetor);
    const userL = useSelector((state) => state.userState.userLogado)
    var user = userL ? userL.uid : null


    let location = useLocation();
    const dispatch = useDispatch()



    useEffect(() => {
        handleDevices()
        handleAlerts()
        selectData()
        selectDeviveTypes()
        selectSetor()
        selectDataSetor()
        
    }, [selectedDevice, selectedSetor])

    useEffect(() => {
        setDevice(selectedDevice)
    }, [selectedDevice])

    useEffect(() => {
        if (selectedDevice === '') {

            if (devices.length > 0) {
                dispatch(selecionarDevice(devices[0].device))
            }
            else {
                updateDevicesList()
            }
        }

    }, [devices, setorDados])

    async function handleAlerts() {
        await api.get(`alerts?login=${user}`)
            .then((res) => {
                dispatch(alertasGeral(res.data))
                //setAlertas(res.data);

            })
            .catch((err) => {
                console.log(err)
            })
    }
    async function handleDevices() {
        await api.get(`devices?login=${user}`)
            .then((res) => {
                // const devs = Object.keys(res.data).map(dev => ({ ...res.data[dev], device: dev }))
                dispatch(atualizarDevices(res.data))
            })
            .catch((err) => {

            })
    }

    async function handleDevices() {
        await api.get(`saved_alerts?login=${user}`)
            .then((res) => {
                // const devs = Object.keys(res.data).map(dev => ({ ...res.data[dev], device: dev }))
                dispatch(atualizarDevices(res.data))
            })
            .catch((err) => {

            })
    }

    async function selectDeviveTypes() {
        await api.get(`types?login=${user}`)
            .then((res) => {
                dispatch(dadosType(res.data))
            })
            .catch((err) => {
                console.log(err)
            })
    }

    async function selectSetor() {
        await api.get(`departments?login=${user}`)
            .then((res) => {
                dispatch(setor(res.data))
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    async function selectDataSetor() {
        await api.get(`devices?login=${user}&department=${selectedSetor}`)
            .then((res) => {
                dispatch(dadosSetor(res.data))

            })
            .catch((err) => {
                console.log(err)
            })
    }

    async function selectData() {
        const lastDevice = devices.length
        const id = (devices.length > 0 ? (selectedDevice === '' ? devices[lastDevice] : selectedDevice) : "")
        if (id !== '') {
            dispatch(statusLoad(true)) //SETA O ESTADO DO LOAD PARA TRUE, PARA APARECER SPINNER DE LOAD NAS TELAS
            await api.get(`data?dev_eui=${id}&limit=2000&login=${user}`)//erro de requisição
                .then((res) => {
                    const data = res.data.map(data => ({ ...data, device: id }))
                    dispatch(dadosDevice(data));
                })
                .catch((err) => {
                    console.log(err)
                })
        }

        dispatch(statusLoad(false))

    }



    return (
        <div style={{width: 230}} id='setor'>
            {
                location.pathname === "/analytics" ||
                    location.pathname === "/alertas" ? ''
                    : <Setor />
            }
        </div>
    )
}

