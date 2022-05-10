import { USER } from './SavedAlerts';

const initialSater = {
    userLogado: []
}

export default (state = initialSater, { type, payload }) => {
    switch (type) {
        case USER:
            return {
                ...state,
                userLogado: payload
            }
        default:
            return state
    }
}