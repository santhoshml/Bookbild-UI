import { CREATE_PITCH } from '../actions/index';

const INITIAL_STATE = { pitch: null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case CREATE_PITCH:
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      return {
        ...state
        , pitch: action.payload.data.data.Items
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
