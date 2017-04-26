import { CREATE_IOI } from '../actions/index';

const INITIAL_STATE = { ioi: null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case CREATE_IOI:
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      console.log('In reducer_create_ioi, data:'+JSON.stringify(action.payload.data));
      return {
        ...state
        , ioi: action.payload.data.data
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
