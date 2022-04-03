import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, FormControl, makeStyles } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import clsx from 'clsx';
import './styles.css';
import { selecionarDevice } from '../../Reducers/ReduxDevices/DeviceActions';
import { setDevice } from '../../Utils/stateControllers';


const useStyle = makeStyles((theme) => ({
    textIput: {
        margin: theme.spacing(1),
        borderRadius: 100,
        width: '45%',
        borderRadius: 100,
    },
    form: {
        width: '100%',
        margin: theme.spacing(1),
        justifyContent: 'center',
        alignItems: 'center'
    }
}))


export default function SearchForm() {
    const selectedDevice = useSelector((state) => state.deviceState.selectedDevice);
    const devices = useSelector((state) => state.deviceState.devices)
    const dadosDevice = useSelector((state) => state.deviceState.dadosDevice);
    const dispatch = useDispatch();
    const classes = useStyle();

    const [searchedDevice, setSearchDevice] = useState('');

    function getDevsByName(name){
        const listDevices = devices.filter(dev => name === dev.name)
        return (listDevices.length > 0) ? listDevices[0].device : ''
    }
    function getSelNameDev(){
        const listDevices = devices.filter(dev => selectedDevice === dev.device)
        return (listDevices.length > 0) ? listDevices[0].name : ''
    }

    return(
    <FormControl className={clsx(classes.form)} >
        <Autocomplete
            className={clsx(classes.textIput)}
            id="autocomplete"
            value={ getSelNameDev() }
            onChange={(event, newValue) => {
                if (newValue) {
                    const disps = newValue.split()
                    dispatch(selecionarDevice( getDevsByName(disps[0]) ))
                    setDevice(getDevsByName(disps[0]))
                } else {
                    console.log('erro')
                }
            }
            }
            inputValue={searchedDevice}
            onInputChange={(event, inputValue) => { setSearchDevice(inputValue) }}
            options={devices.map(option => option.name)}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Pesquisar Dispositivo" variant="outlined" />}
        />
    </FormControl>
    )
}