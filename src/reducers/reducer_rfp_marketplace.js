import { FETCH_ALL_RFP
  , FETCH_FAV_RFP_LIST
  , FETCH_COMPANY_RFP_LIST
  , FETCH_RFP
  , FETCH_TERM_SHEET_ACTIVITY_STATS
  , FETCH_COMPANY_LIST_FOR_RFP } from '../actions/index';

const INITIAL_STATE = { rfpList: null, termSheetActivity: null, companyListForRFP: null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case FETCH_COMPANY_LIST_FOR_RFP:
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){

      return {
        ...state
        , companyListForRFP: action.payload.data.data.Items
      };
    } else {
      return {
          ...state
          , errObject : action.payload.data
      };
    }
    break;
  case FETCH_TERM_SHEET_ACTIVITY_STATS:
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      return {
        ...state
        , termSheetActivity: action.payload.data.data.Items
      };
    } else {
      return {
          ...state
          , errObject : action.payload.data
      };
    }
    break;
  case FETCH_RFP:    
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
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
    break;
    case FETCH_ALL_RFP:
      if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){

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
      break;
    case FETCH_COMPANY_RFP_LIST :
      if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
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
      break;
    case FETCH_FAV_RFP_LIST:
      if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
        return {
          ...state
          , rfpList: action.payload.data.data
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
