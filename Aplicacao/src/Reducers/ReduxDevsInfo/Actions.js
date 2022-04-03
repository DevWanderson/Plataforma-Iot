import { downloadData, download } from '../../Utils/download_functions';
import store from '../../Store';



export const DEVICE_DATA = "DEVICE_DATA";

export const deviceData = (device, data) => ({
    type: DEVICE_DATA,
    payload: { device, data }
})


export const ALL_DEVICES_DATA = "ALL_DEVICES_DATA";

export const allDeviceData = data => ({
    type:ALL_DEVICES_DATA,
    payload: { data }
})


export const UPDATE_VARIABLES = "UPDATE_VARIABLES";

export const updateVariables = variables => ({
    type: UPDATE_VARIABLES,
    payload: { variables }
})


export const UPDATE_DEVICES = "UPDATE_DEVICES";

export const updateDevice = devices => ({
    type: UPDATE_DEVICES,
    payload: { devices }
})


export const SET_DEVICE = "SET_DEVICE";

export const changeDevice = device => ({
    type: SET_DEVICE,
    payload: { device }
})


    // MQTT não está mais sendo utilizado
// const setClient = MQTTclient => store.dispatch({ type: 'MQTT_CLIENT', payload: MQTTclient })
// const setCurrentTopic = MQTTcurrentTopic => store.dispatch({ type: 'MQTT_CT', payload: MQTTcurrentTopic })
