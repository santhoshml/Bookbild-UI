import { FETCH_IOI_LIST_FOR_RFP, FETCH_IOI_LIST_FOR_COMPANY } from '../actions/index';

const INITIAL_STATE = { ioiList: null, ioiCompanyList : null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case FETCH_IOI_LIST_FOR_RFP:
  case FETCH_IOI_LIST_FOR_COMPANY :
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      return {
        ...state
        , ioiList: action.payload.data.data.IOI_LIST.Items
        , ioiCompanyList : action.payload.data.data.COMPANY_DETAILS_LIST
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
