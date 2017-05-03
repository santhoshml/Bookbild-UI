import { FETCH_ADDRESS, FETCH_CONTACT, UPDATE_USER_PROFILE, ADD_USER, FETCH_USER_LIST } from '../actions/index';

const INITIAL_STATE = { address: null, contact: null, userList: null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case FETCH_ADDRESS:
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){

      return {
        ...state
        , address: action.payload.data.data
      };
    } else {
      return {
          ...state
          , errObject : action.payload.data
      };
    }
  case FETCH_CONTACT:
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){

      return {
        ...state
        , contact: action.payload.data.data
      };
    } else {
      return {
          ...state
          , errObject : action.payload.data
      };
    }
  case UPDATE_USER_PROFILE:
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
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      return {
        ...state
        , userList: action.payload.data.data
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
