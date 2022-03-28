import { ATUALIZAR_DEVICES, SELECT_DEVICE, DADOS_TYPE, DADOS_DEVICE, STATUS_LOAD, USER } from './actions';

const initialState = {
    devices: [],
    selectedDevice: '',
    dadosType: [],
    dadosDevice: [],
    statusLoad: false,
    userLogado:[]
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, { type, payload }) => {
    switch (type) {
        case ATUALIZAR_DEVICES:
            return {
                ...state,
                devices: payload
            }
        case SELECT_DEVICE:
            return {
                ...state,
                selectedDevice: payload
            }
        case DADOS_TYPE:
            return {
                ...state,
                dadosType: payload
            }
        case DADOS_DEVICE:
            return {
                ...state,
                dadosDevice: payload,
            }

        case STATUS_LOAD:
            return {
                ...state,
                statusLoad: payload,
            }
        
        case USER:
            return{
                ...state,
                userLogado: payload
            }


        default:
            return state
    }
}

