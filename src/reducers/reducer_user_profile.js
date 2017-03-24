import { FETCH_ADDRESS, FETCH_CONTACT } from '../actions/index';

const INITIAL_STATE = { addressJSON: null, contactJSON: null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case FETCH_ADDRESS:
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      console.log('in reducer_address, payload:'+JSON.stringify(action.payload));

      return {
        ...state
        , addressJSON: action.payload.data.data
      };
    } else {
      return {
          ...state
          , errObject : action.payload.data
      };
    }
  case FETCH_CONTACT:
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      console.log('in reducer_contact, payload:'+JSON.stringify(action.payload));

      return {
        ...state
        , contactJSON: action.payload.data.data
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
