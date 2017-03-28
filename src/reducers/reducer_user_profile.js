import { FETCH_ADDRESS, FETCH_CONTACT, UPDATE_USER_PROFILE, ADD_USER, FETCH_USER_LIST } from '../actions/index';

const INITIAL_STATE = { addressJSON: null, contactJSON: null, userListJSON: null};

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
  case UPDATE_USER_PROFILE:
    console.log('in reducer_update_user_profile, payload:'+JSON.stringify(action.payload));
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      return {
        ...state
      };
    } else {
      return {
          ...state
          , errObject : action.payload.data
      };
    }
  case ADD_USER:
    console.log('in reducer_add_user, payload:'+JSON.stringify(action.payload));
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      return {
        ...state
      };
    } else {
      return {
          ...state
          , errObject : action.payload.data
      };
    }
  case FETCH_USER_LIST:
    console.log('in reducer_fetch_user_list, payload:'+JSON.stringify(action.payload));
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      return {
        ...state
        , userListJSON: action.payload.data.data
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
