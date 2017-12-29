import { FETCH_FINAL_TERM_LIST_FOR_COMPANY } from '../actions/index';

const INITIAL_STATE = { finalTerm: null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case FETCH_FINAL_TERM_LIST_FOR_COMPANY :
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      // console.log('In reducer_create_ioi, data:'+JSON.stringify(action.payload.data));
      return {
        ...state
        , finalTermList : action.payload.data.data.Items
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
