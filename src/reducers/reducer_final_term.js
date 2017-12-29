import { CREATE_FINAL_TERM, GET_FINAL_TERM_BY_IOI, GET_FINAL_TERM_WITH_YIELD_MATRIX } from '../actions/index';

const INITIAL_STATE = { finalTerm: null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case CREATE_FINAL_TERM :
  case GET_FINAL_TERM_BY_IOI :
  case GET_FINAL_TERM_WITH_YIELD_MATRIX :
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      // console.log('In reducer_create_ioi, data:'+JSON.stringify(action.payload.data));
      return {
        ...state
        , finalTerm: action.payload.data.data.Items
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
