import { LOGIN } from '../actions/index';

const INITIAL_STATE = { userObject: null, companyObject: null, errObject : null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case LOGIN:
    // console.log('action:'+JSON.stringify(action));
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      return {
        ...state
        , userObject: action.payload.data.data.userObject
        , companyObject: action.payload.data.data.companyObject
      };
    } else {
      return {
          ...state
          , errObject : action.payload.data
      };
    }
    break;
  default:
    return state;
  }
}
