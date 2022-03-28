import { createStore } from 'redux';
import { combineReducers } from 'redux';
import devicesState from './Modulos/Devices/reducer';
import  userLogado  from './Modulos/Devices/reducer';
import {
  selectedDevice,
  devices,
  deviceProps,
  deviceData,
  MQTTclient,
  MQTTcurrentTopic,
} from './reducers';
import typeSelected from './Modulos/Devices/AlertRedux/reducers/typeReducer';

const rootReducer = combineReducers({
  devicesState,
  selectedDevice,
  devices,
  deviceProps,
  deviceData,
  MQTTclient,
  MQTTcurrentTopic,
  typeSelected,
  userLogado
})
const store = createStore(rootReducer)

export default store;
