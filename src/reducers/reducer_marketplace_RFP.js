import { FETCH_ALL_RFP } from '../actions/index';

const INITIAL_STATE = { rfpList: null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case FETCH_ALL_RFP:
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      console.log('in reducer_login, payload:'+JSON.stringify(action.payload));

      return {
        ...state
        , rfpList: action.payload.data.data.Items
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
