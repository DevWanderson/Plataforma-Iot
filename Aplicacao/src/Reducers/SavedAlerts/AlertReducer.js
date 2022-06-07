import { ALERTS } from './AlertActions';

const initialSater = {
    saveAlerts: []
}

export default (state = initialSater, { type, payload }) => {
    switch (type) {
        case ALERTS:
            return {
                ...state,
                saveAlerts: payload
            }
        default:
            return state
    }
}