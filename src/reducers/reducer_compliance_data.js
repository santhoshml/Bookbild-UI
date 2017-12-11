import { SAVE_COMPLIANCE_DATA, GET_COMPLIANCE_DATA } from '../actions/index';

const INITIAL_STATE = { complianceData: null, errObject : null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case GET_COMPLIANCE_DATA:
    // console.log('compliance reducer, get, action:'+JSON.stringify(action));
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      // console.log('In wgl reducer:'+JSON.stringify(action.payload));
      return {
        ...state
        , complianceData: action.payload.data.data[0]
      };
    } else {
      return {
          ...state
          , errObject : action.payload.data
      };
    }
    break;
  case SAVE_COMPLIANCE_DATA:
    // console.log('action:'+JSON.stringify(action));
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      // console.log('In wgl reducer:'+JSON.stringify(action.payload));
      return {
        ...state
        , complianceData: action.payload.data.data
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