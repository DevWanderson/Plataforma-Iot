import React from 'react';
import { FormControl, makeStyles, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { selecionarDevice } from '../../store/Modulos/Devices/actions';
import { setDevice } from '../../store/actions'


const useStyle = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    card: {
        padding: theme.spacing(1),
        textAlign: 'center',
        marginBottom: theme.spacing(3),
    },
    cardInfo: {
        padding: theme.spacing(1),
        textAlign: 'center',
        marginBottom: theme.spacing(3),
        width: '50%',
        marginInline: 5,
    },
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



export default function SearchDevice(props) {

    const selectedDevice = useSelector((state) => state.devicesState.selectedDevice);
    const devices = useSelector((state) => state.devicesState.devices);
    const dispatch = useDispatch();
    const classes = useStyle();

    const [searchDevice, setSearchDevice] = useState('');

    function getDevsByName(name) {
        const listDevices = devices.filter(dev => name === dev.name)
        return (listDevices.length > 0) ? listDevices[0].device : ''
    }
    function getSelNameDev() {
        const listDevices = devices.filter(dev => selectedDevice === dev.device)
        return (listDevices.length > 0) ? listDevices[0].name : ''
    }


    return (

        <>
            {/*
            <FormControl>
                <Autocomplete
                    className={clsx(classes.textIput)}
                    id="autocomplete"
                    value={getSelNameDev()}

                    onChange={(event, newValue) => {
                        if (newValue) {
                            const disp = newValue.split()
                            dispatch(selecionarDevice(getDevsByName(disp[0])))

                        } else {
                            console.log('erro')
                        }
                    }
                    }
                    inputValue={searchDevice}

                    onInputChange={(event, inputValue) => { setSearchDevice(inputValue) }}
                    options={devices.map(option => option.name)}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField onFocus {...params} label="Selecionar Dispositivo" variant="outlined" />}
                    onFocus
                ></Autocomplete>

            </FormControl >
          

             */}

            <FormControl style={{ zIndex: 0 }}>
                <Autocomplete
                    id='autocomplete'
                    options={devices.map(item => item.name)}
                    getOptionLabel={(option) => option}
                    value={getSelNameDev()}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Selecione um dispositivo" variant="outlined" />}
                    onChange={(event, newValue) => {
                        if (newValue) {
                            const disp = newValue.split()
                            dispatch(selecionarDevice(getDevsByName(disp[0])))
                            setDevice(getDevsByName(disp[0]))
                        } else {
                            // console.log('erro')
                        }
                    }
                    }
                    inputValue={searchDevice}
                    onInputChange={(event, inputValue) => { setSearchDevice(inputValue) }}
                />
            </FormControl>
        </>



    );


}