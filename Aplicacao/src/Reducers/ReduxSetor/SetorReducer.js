import { SETOR, SELECT_SETOR, DADOS_SETOR } from './SetorActions';

const initialState = {
    dadosSetor: [],
    selectSetor:'Todos',
    setor:[]
}

export default (state = initialState, {type, payload}) => {
    switch(type){
        case SETOR:
            return{
                ...state,
                setor: payload
            }

        case SELECT_SETOR:
            return{
                ...state,
                selectSetor: payload
            }
        
        case DADOS_SETOR:
            return{
                ...state,
                dadosSetor: payload
            }
        default:
            return state
    }
}