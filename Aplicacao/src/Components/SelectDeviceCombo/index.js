import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../Components/Connections/api'
import firebase from '../FirebaseConnection/firebaseConnection';
import { updateDeviceData, updateAllDevicesData } from '../../store/actions'
import { selecionarDevice, atualizarDevices, dadosDevice, dadosType, statusLoad } from '../../store/Modulos/Devices/actions';

import './styles.css';


export default function Combo() {
    const devices = useSelector((state) => state.devicesState.devices)
    const selectedDevice = useSelector((state) => state.devicesState.selectedDevice)

    const dispatch = useDispatch()
    

    const userL = useSelector((state) => state.userLogado.userLogado)
    var user = userL ? userL.name : null

    useEffect(() => {
        handleDevices()
        selectData()
        selectDeviveTypes()
        
    }, [selectedDevice])

    useEffect(() => {
        if (selectedDevice === '')
            if (devices.length > 0)
                dispatch(selecionarDevice(devices[0].device))
            else
                updateAllDevicesData()
    }, [devices])

    async function handleDevices() {
        await api.get(`devices?user=${user}`)
            .then((res) => {
                // const devs = Object.keys(res.data).map(dev => ({ ...res.data[dev], device: dev }))
                dispatch(atualizarDevices(res.data))
            })
            .catch((err) => {

            })
    }

    async function selectDeviveTypes() {
        await api.get(`types?user=${user}`)
            .then((res) => {
                dispatch(dadosType(res.data))
            })
            .catch((err) => {

            })
    }

    async function selectData() {
        const lastDevice = devices.length
        const id = (devices.length > 0 ? (selectedDevice === '' ? devices[lastDevice] : selectedDevice) : "")
        if (id !== '') {
            dispatch(statusLoad(true)) //SETA O ESTADO DO LOAD PARA TRUE, PARA APARECER SPINNER DE LOAD NAS TELAS
            await api.get(`data?dev_eui=${id}&limit=2000&user=${user}`)//erro de requisição
                .then((res) => {
                    const data = res.data.map(data => ({ ...data, device: id }))
                    dispatch(dadosDevice(data));
                })
                .catch((err) => {

                })
        }

        dispatch(statusLoad(false))

    }


    return (
        <div style={{ width: '16%', marginLeft: '80%' }}>

        </div>
    )
}





// import React, { useState, useEffect, useContext } from 'react';
// // import { Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import api from '../../Connections/api';
// import firebase from '../FirebaseConnection/firebaseConnection';
// import { updateDeviceData, updateAllDevicesData } from '../../store/actions'
// import { selecionarDevice, atualizarDevices, dadosDevice, dadosType, statusLoad } from '../../store/Modulos/Devices/actions';
// // import { Form, Card, CardDeck, Row, Col } from 'react-bootstrap';
// import './styles.css';
// // import Autocomplete from '@material-ui/lab/Autocomplete';
// // import { MenuItem, TextField } from '@material-ui/core'


// export default function Combo() {
//     const devices = useSelector((state) => state.devicesState.devices)
//     const selectedDevice = useSelector((state) => state.devicesState.selectedDevice)
//     //const dadosTypes = useSelector((state) =>  state.devicesState.dadosType)
//     //const dadosDevice = useSelector((state) =>  state.devicesState.dadosDevice);

//     // const device = useSelector((state) => state.device);
//     // const deviceData =  device[selectedDevice].data
//     // const deviceProps = device[selectedDevice].props
//     const dispatch = useDispatch()

//     const [teste, setTeste] = useState();

//     const userL = useSelector((state) => state.userLogado.userLogado)
//     var user = userL.name
//     console.log(user)
//     console.log(userL)



//     /*  const [currentUser, setCurrentUser] = useState('');
//      let user = JSON.parse(localStorage.getItem('Auth_user'))

//      if(user !== null){
//          if(user!==currentUser){
//              async function updateUser(){
//                  await localStorage.setItem('user', user.name)
//                  setCurrentUser(user.name)
//              }       
//              updateUser()
//          }}
//      else{
//          localStorage.setItem('user', null)
//      } */


//     useEffect(() => {
//         handleDevices()
//         selectData()
//         selectDeviveTypes()

//     }, [selectedDevice])

//     useEffect(() => {
//         if (selectedDevice === '')
//             if (devices.length > 0)
//                 dispatch(selecionarDevice(devices[0].device))
//             else
//                 updateAllDevicesData()
//     }, [devices])

//     async function handleDevices() {
//         await api.get(`devices?user=${user}`)
//             .then((res) => {
//                 // const devs = Object.keys(res.data).map(dev => ({ ...res.data[dev], device: dev })) Q DIABO É ISSO???
//                 // console.log(devs)
//                 // console.log(res)
//                 dispatch(atualizarDevices(res.data))
//             })
//             .catch((err) => {
//                 console.log(err)
//             })
//     }

//     async function selectDeviveTypes() {
//         await api.get(`types?user=${user}`)
//             .then((res) => {
//                 dispatch(dadosType(res.data))
//             })
//             .catch((err) => {
//                 console.log(err)
//             })
//     }
//     // const id = (devices.length > 0) ? (selectedDevice === '' ? devices[0].device : devices.filter((dev) => dev.device === selectedDevice)[0].device) : ""
//     async function selectData() {
//         const lastDevice = devices.length
//         const id = (devices.length > 0 ? (selectedDevice === '' ? devices[lastDevice] : selectedDevice) : "")
//         if (id !== '') {
//             dispatch(statusLoad(true)) //SETA O ESTADO DO LOAD PARA TRUE, PARA APARECER SPINNER DE LOAD NAS TELAS
//             await api.get(`data?dev_eui=${id}&limit=2000&user=${user}`)//erro de requisição
//                 .then((res) => {
//                     const data = res.data.map(data => ({ ...data, device: id }))
//                     dispatch(dadosDevice(data));
//                 })
//                 .catch((err) => {
//                     console.log(err)
//                 })
//         }

//         dispatch(statusLoad(false))
//         // function equacionarDadosDevices(dadosDevice) {
//         //     return dadosDevice.map((dados) => {
//         //         if (dados.type) {
//         //             return dados;
//         //         }
//         //         else {
//         //             return {
//         //                 ...dados,
//         //                 type: ""
//         //             }
//         //         }
//         //     })
//         // }    
//     }


//     return (
//         <div style={{ width: '16%', marginLeft: '80%' }}>
//             {/* <Autocomplete
//                     value={selectedDevice}
//                     onChange={(event, newValue) => {
//                         dispatch(selecionarDevice(event.target.value))
//                         //setSelectDevice(newValue)
//                     }}
//                     inputValue={searchDevice}
//                     onInputChange={(event, inputValue) => {
//                         setSeactDevice(inputValue)
//                     }}
//                     options={devices}
//                     getOptionLabel={(option) =>  option.name ? option.name : option.device}
//                     style={{width: 300}}

//                     renderInput={(params) => <TextField {...params} label="Pesquisar Dispositivo" variant="outlined"/>}
//                 /> */}

//             {/* <div style={{ marginLeft: '6%' }}>{(devices.length > 0) ? "Dispositivo Selecionado:" : <p> </p>}</div>
//             <TextField select value={selectedDevice} onChange={(e) => dispatch(selecionarDevice(e.target.value))}>
//                 {(devices.length > 0) ? devices.map((dev) => (
//                     <MenuItem key={dev.name ? dev.name : dev.device} value={dev.device}>{dev.name ? dev.name : dev.device}</MenuItem>
//                 )) :
//                     (
//                         <option>Nenhum dispositivo</option>
//                     )
//                 }
//             </TextField> */}
//         </div>
//     )
// }




