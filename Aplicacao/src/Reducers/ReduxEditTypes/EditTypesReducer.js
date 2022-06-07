import {EDIT} from './EditTypesActions';

const initialState = {
    editType:[]
}

export default (state = initialState, {type, payload}) =>{
    switch(type){
        case EDIT:
            return{
                ...state,
                editType: payload
            }
        default:
            return state
    }
}