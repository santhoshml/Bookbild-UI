import { FETCH_IOI_LIST_FOR_RFP, FETCH_IOI_LIST_FOR_COMPANY } from '../actions/index';

const INITIAL_STATE = { ioiList: null, ioiCompanyList : null, ioiUserList : null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case FETCH_IOI_LIST_FOR_RFP:
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      return {
        ...state
        , ioiList: action.payload.data.data.Items
      };
    } else {
      return {
          ...state
          , errObject : action.payload.data
      };
    }
  case FETCH_IOI_LIST_FOR_COMPANY :
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      console.log('action.payload.data.data:'+JSON.stringify(action.payload.data.data));
      return {
        ...state
        , ioiList: action.payload.data.data.IOI_LIST.Items
        , ioiCompanyList : action.payload.data.data.COMPANY_DETAILS_LIST
        , ioiUserList : action.payload.data.data.USER_DETAILS_LIST
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
