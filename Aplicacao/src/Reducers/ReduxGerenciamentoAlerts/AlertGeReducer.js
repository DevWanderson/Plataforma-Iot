import { ALERTAS } from './AlertGeActions';

const initialState = {
    alertas:[]
}

export default (state = initialState, {type, payload}) => {
    switch(type){
        case ALERTAS:
            return{
                ...state,
                alertas: payload
            }
        default:
            return state
    }
}