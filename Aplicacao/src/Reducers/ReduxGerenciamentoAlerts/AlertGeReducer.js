import { ALERTAS, ALERTAS_GERAL } from './AlertGeActions';

const initialState = {
    alertas:[], 
    alertasGeral:[]
}

export default (state = initialState, {type, payload}) => {
    switch(type){
        case ALERTAS:
            return{
                ...state,
                alertas: payload
            }
        case ALERTAS_GERAL:
            return{
                ...state,
                alertasGeral: payload
            }
        default:
            return state
    }
}