import * as BIO from '../actions';
import initState from './initState';
import { clone } from '../utils/BIOObject';

const loginReducer = (state = initState, action) => {
    switch(action.type){
        case BIO.LOGIN_SUCCESS : {
            const user = clone(state['user']);
            const { id, role, token } = action.data;
            user.id = id;
            user.role = role;
            user.token = token;
            return {
                ...state,
                user
            }
        }
    }
}

export default loginReducer;