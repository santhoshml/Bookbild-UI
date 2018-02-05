import { GET_FINAL_TERM, CREATE_FINAL_TERM, GET_FINAL_TERM_BY_IOI, GET_FINAL_TERM_WITH_YIELD_MATRIX } from '../actions/index';

const INITIAL_STATE = { finalTerm: null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case CREATE_FINAL_TERM :
  case GET_FINAL_TERM_BY_IOI :
  case GET_FINAL_TERM_WITH_YIELD_MATRIX :
  case GET_FINAL_TERM :
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
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
