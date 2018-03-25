import { GET_ALL_COMPANY_LIST } from '../actions/index';

const INITIAL_STATE = { companyList: null, errObject : null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case GET_ALL_COMPANY_LIST :
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      return {
        ...state
        , companyList: action.payload.data.data.Items
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
