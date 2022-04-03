/*
    Autor: Daniel Pinheiro
    https://github.com/Daniel-Pinheiro
 */

import { DEVICE_DATA, ALL_DEVICES_DATA, UPDATE_VARIABLES, UPDATE_DEVICES, SET_DEVICE } from './Actions';

const initialState = {
    devicesData:  voidKey( {} , []),  // Retorna [] caso um device ainda não exista na estrutura
    deviceData: [],
    devicesUnits: voidKey( {} , {}),  // Retorna {} caso um device ainda não exista na estrutura
    deviceUnits: [],
    devices: [],
    currentDevice: '',
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case DEVICE_DATA:
            let {device, data} = payload
            let newData = voidKey( {...state.devicesData, [device]: data} , [])
            return {
                ...state,
                devicesData: newData,
                deviceData: newData[state.currentDevice]
            }
        case ALL_DEVICES_DATA:
            let datas = payload.data
            return {
                ...state,
                devicesData: voidKey(datas, []),
            }
        case UPDATE_VARIABLES:
            let variables = voidKey(payload.variables, {})
            return {
                ...state,
                devicesUnits: variables,
                deviceUnits: variables[state.currentDevice]
            }
        case UPDATE_DEVICES:
            return {
                ...state,
                devices: payload.devices
            }
        case SET_DEVICE:
            let dev = payload.device
            return {
                ...state,
                currentDevice: dev,
                deviceData: state.devicesData[dev],
                deviceUnits: state.devicesUnits[dev],
            }
        default:
            return state
    }
}

function voidKey(object, ret){  // <- Função muda uma saída padrão de um objeto de undifined pra ret
    let defaultObjRet = {
        get: function(target, device) {
            return target.hasOwnProperty(device) ? target[device] : ret;
        }
    };
    
    return new Proxy(object, defaultObjRet)
}

// const MQTTclient = ( state = null, {type, payload} ) => {
//     return (type === 'MQTT_CLIENT') ? payload : state
// }
// const MQTTcurrentTopic = ( state = null, {type, payload} ) => {
// return (type === 'MQTT_CT') ? payload : state
// }                       // <- MQTT não está mais sendo utilizado
