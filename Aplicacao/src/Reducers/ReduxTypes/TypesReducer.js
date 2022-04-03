import { DADOS_TYPE } from './TypeActions';

const initialState = {
    dadosType:[]
}

export default (state = initialState, {type, payload}) => {
    switch(type){
        case DADOS_TYPE:
            return{
                ...state,
                dadosType: payload
            }
        default:
            return state
    }
}