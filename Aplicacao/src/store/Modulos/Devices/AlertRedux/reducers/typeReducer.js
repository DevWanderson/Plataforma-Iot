export default function typeSelected(state = '', action) {
    switch (action.type) {
        case 'SELECTEDTYPE':
            return state = action.payload;

        default:
            return state
    }
}