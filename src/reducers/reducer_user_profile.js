import { FETCH_ADDRESS, FETCH_CONTACT, UPDATE_USER_PROFILE, ADD_USER, FETCH_USER_LIST } from '../actions/index';

const INITIAL_STATE = { addressJSON: null, contactJSON: null, userListJSON: null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case FETCH_ADDRESS:
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){

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
