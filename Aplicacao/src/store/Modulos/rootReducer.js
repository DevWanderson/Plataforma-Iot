import { combineReducers } from 'redux';

import devicesState from './Devices/reducer';
import userLogado  from './Devices/reducer';

const deviceData = (state={}, { type, payload }) => (
    type === 'DEVICE_DATA' ? {...state, [payload[0]]: payload[1]} : state
)                                           //device: data

export default combineReducers({
    devicesState,
    deviceData,
    userLogado
})