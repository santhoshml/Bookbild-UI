import { LOGIN } from '../actions/index';

const INITIAL_STATE = { userObject: null, companyObject: null, errObject : null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case LOGIN:
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      console.log('in reducer_login, payload:'+JSON.stringify(action.payload));
      console.log('in reducer_login, userObject:'+JSON.stringify(action.payload.data.data.userObject));
      console.log('in reducer_login, companyObject:'+JSON.stringify(action.payload.data.data.companyObject));

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
  default:
    return state;
  }
}
