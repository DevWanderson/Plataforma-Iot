import { STATUS_LOAD } from "./LoadActions";

const initialState = {
    statusLoad: false
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case STATUS_LOAD:
            return {
                ...state,
                statusLoad: payload,
            }
        default:
            return state
    }
}
