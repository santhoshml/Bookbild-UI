import { GET_DASHBOARD_STATS } from '../actions/index';

const INITIAL_STATE = { stats : null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case GET_DASHBOARD_STATS :
    // console.log('action:'+JSON.stringify(action));
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      // console.log('In wgl reducer:'+JSON.stringify(action.payload));
      return {
        ...state
        , stats : action.payload.data.data
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
