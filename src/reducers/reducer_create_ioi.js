import { CREATE_IOI } from '../actions/index';

const INITIAL_STATE = { ioi: null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case CREATE_IOI:
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      return {
        ...state
        , ioi: action.payload.data.data.Items
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
