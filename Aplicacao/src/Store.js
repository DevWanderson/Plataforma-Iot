import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import {createLogger} from 'redux-logger';
import multi from 'redux-multi';
import thunkMiddleware from 'redux-thunk';



//aqui colocar os imports do Reducer
import DeviceReducer from './Reducers/ReduxDevices/DeviceReducer';
import SetorReducer from './Reducers/ReduxSetor/SetorReducer';
import TypesReducer from './Reducers/ReduxTypes/TypesReducer';
import UserReducer from './Reducers/ReduxUser/UserReducer';
import LoadReducer from './Reducers/ReduxLoad/LoadReducer';
import typeSelected from './Reducers/ReduxAlertType/AlertReducer';
import DevicesReducer from './Reducers/ReduxDevsInfo/Reducer';
import GerenciaAlertas from './Reducers/ReduxGerenciamentoAlerts/AlertGeReducer';
import SavedAlerts from './Reducers/SavedAlerts/AlertReducer';

const Reducer = combineReducers({
    deviceState: DeviceReducer,
    setorState: SetorReducer,
    typeState: TypesReducer,
    userState: UserReducer,
    loadState: LoadReducer,
    alertasState: GerenciaAlertas,
    typeSelected,
    devsInfoState: DevicesReducer,
    savedAlertsState: SavedAlerts,
})

const loggerMiddleware = createLogger();

export default createStore(Reducer, composeWithDevTools(applyMiddleware(thunkMiddleware, multi)));