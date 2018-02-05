import { SAVE_DEAL_COMPARISION_DATA } from '../actions/index';

const INITIAL_STATE = { dealComp: null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case SAVE_DEAL_COMPARISION_DATA:
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      return {
        ...state
        , dealComp: action.payload.data.data.Items
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
