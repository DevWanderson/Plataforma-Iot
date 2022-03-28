let defaultObjRet = {   // <- Estrutura que adiciona uma saída padrão pra qlqr entrada
    get: function(target, device) {
      return target.hasOwnProperty(device) ? target[device] : [];
    }
};
let InitialState = new Proxy({}, defaultObjRet);  // Garante q ñ dê undefined caso um device ainda não exista

const deviceData = ( state = InitialState, {type, payload} ) => {
    switch(type){
        case 'DEVICE_DATA':
            let {device, data} = payload
            let newState = {...state, [device]: data}
            return new Proxy(newState, defaultObjRet)
        case 'UPDATE_DEVICES':
            return new Proxy(payload.data, defaultObjRet)
        default:
            return state
    }
}   

const deviceProps = ( state = InitialState, {type, payload} ) => {
    if(type === 'UPDATE_DEVICES'){
        const {data} = payload
        const newState = {}

        for(var device in data)
            if(data[device].length > 0) newState[device] = Object.keys(data[device][0])
        return new Proxy(newState, defaultObjRet)
    }
    else return state
}

const devices = ( state = {}, {type, payload} ) => {
    return (type === 'UPDATE_DEVICES') ? payload.devices : state
}

const selectedDevice = ( state = '', {type, payload} ) => {
    return (type === 'SELECT_DEVICE') ? payload : state
}

const MQTTclient = ( state = null, {type, payload} ) => {
    return (type === 'MQTT_CLIENT') ? payload : state
}
  const MQTTcurrentTopic = ( state = null, {type, payload} ) => {
    return (type === 'MQTT_CT') ? payload : state
}
  

export { devices, deviceData, deviceProps, selectedDevice, MQTTclient, MQTTcurrentTopic };