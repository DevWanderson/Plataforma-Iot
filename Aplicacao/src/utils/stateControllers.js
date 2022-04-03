/*
    Autor: Daniel Pinheiro
    https://github.com/Daniel-Pinheiro
 */

import { downloadData, download } from './download_functions';
import store from '../Store';
import { deviceData, allDeviceData, updateVariables, updateDevice, changeDevice } from '../Reducers/ReduxDevsInfo/Actions';


async function updateDevicesList() {
    const [devs, vars] = await Promise.all([
        download(`devices?`),
        download(`vars?`),
    ]);

    if (devs) {
        if (!(devs.length > 0))
            console.log('Sem lista de dispositivos')
        else {
            const varsByType = {}
            vars.forEach(item => varsByType[item.type] = item.variables);

            const variables = {}, devices = {}
            devs.forEach(dev => {
                devices[dev.device] = dev
                variables[dev.device] = varsByType[dev.type] ? varsByType[dev.type] : {}
            });

            store.dispatch( updateDevice(devices) )
            if (vars)
                if (!(vars.length > 0))
                    console.log('Sem lista de variaveis')
                else {
                    store.dispatch( updateVariables(variables) )
                }
            else {
                console.log('Erro ao baixar lista de variaveis')
            }
        }
    }
    else
        console.log('Erro ao baixar lista de dispositivos')
}

async function updateAllDevicesData() {
    const [data] = await Promise.all([
        downloadData(`limit=1`),
    ]);

    if (data) {
        if (!(Object.keys(data).length > 0))
            console.log('Sem dados dos dispositivos')
        else {
            store.dispatch( allDeviceData(data) )
        }
    }
    else
        console.log('Erro ao baixar dados dos dispositivos')
}


async function updateDeviceData(device) {
    if (device !== '') {
        const data = await downloadData(`dev_eui=${device}&limit=1`)
        if (data) {
            if (data.length > 0)
                store.dispatch( deviceData(device, data) )
            else
                console.log(`Dispositivo ${device} sem dados`)
        }
        else
            console.log(`Erro ao baixar dados do dispositivo ${device}`)
    }
}

async function setDevice(device) {
    updateDevicesList()

    if (store.getState().devsInfoState.devicesData[device].length <= 0) {// Checa se há dado no dispositivo
        await updateDeviceData(device)  // Atrasa mudança até receber os dados
    }
    
    store.dispatch( changeDevice(device) )
}

export { updateDevicesList, updateAllDevicesData, updateDeviceData, setDevice }