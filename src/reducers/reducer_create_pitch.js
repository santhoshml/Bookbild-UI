import { CREATE_PITCH } from '../actions/index';

const INITIAL_STATE = { pitch: null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case CREATE_PITCH:
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      // console.log('In reducer_create_ioi, data:'+JSON.stringify(action.payload.data));
      return {
        ...state
        , pitch: action.payload.data.data
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
