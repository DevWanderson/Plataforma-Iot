import { downloadData, download } from '../utils/download_functions'
import store from '../store'

async function updateAllDevicesData() {
    const [devices, data] = await Promise.all([download(`devices?`), downloadData(`limit=1`)]);
    
    if(devices && data){
        if( !(Object.keys(devices).length>0) )
            console.log('Sem lista de dispositivos')
        else if( !(Object.keys(data).length>0) )
            console.log('Sem dados dos dispositivos')
        else    store.dispatch({ type: 'UPDATE_DEVICES', payload: {devices, data} })    
    }
    else
        console.log('Erro ao baixar dados dos dispositivos')
}

async function updateDeviceData(device) {
    if (device !== ''){
        const data = await downloadData(`dev_eui=${device}&limit=2000`)
        if(data){
            if(data.length>0)
            store.dispatch({ type: 'DEVICE_DATA', payload: {device, data} })
            else
                console.log(`Dispositivo ${device} sem dados`)
        }
        else
            console.log(`Erro ao baixar dados do dispositivo ${device}`)
    }
}

async function setDevice(device) {
    if( !(store.getState().devices[device]) ){
        await updateAllDevicesData()
    }
    store.dispatch({ type: 'SELECT_DEVICE', payload: device })
    updateDeviceData(device)
}

const setClient = MQTTclient => store.dispatch({ type: 'MQTT_CLIENT', payload: MQTTclient })
const setCurrentTopic = MQTTcurrentTopic => store.dispatch({ type: 'MQTT_CT', payload: MQTTcurrentTopic })

export { updateAllDevicesData, updateDeviceData, setDevice, setClient, setCurrentTopic }