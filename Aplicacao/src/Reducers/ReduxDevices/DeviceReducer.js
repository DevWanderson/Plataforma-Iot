import { ATUALIZAR_DEVICES, SELECT_DEVICE, DADOS_DEVICE } from './DeviceActions';

const initialState = {
    devices: [],
    selectedDevice: '',
    dadosDevice: []
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case DADOS_DEVICE:
            return {
                ...state,
                dadosDevice: payload
            }

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
        
        default:
            return state
    }
}