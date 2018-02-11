import {GET_LINK_WITH_FINAL_TERM, GET_LINKS_WITH_RFP, FETCH_LINK_DOCS_WITH_FINAL_TERM_ID, GET_LINKS_WITH_IOI, GET_LINKS_DOCS_WITH_LINK, GET_LINKS_DOCS_WITH_RFP_IOI, GET_LINK_DOCS_WITH_RFP_ID, GET_LINKS_WITH_COMPANYID, GET_LINKS_DOCS_WITH_RFP_IOI_COMPANY } from '../actions/index';

const INITIAL_STATE = { linkList: null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case GET_LINKS_WITH_COMPANYID :
  case GET_LINKS_WITH_IOI :
  case GET_LINKS_WITH_RFP :
  case GET_LINK_WITH_FINAL_TERM :
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      return {
        ...state
        , linkList: action.payload.data.data.Items
      };
    } else {
      return {
          ...state
          , errObject : action.payload.data
      };
    }
    break;
  case GET_LINKS_DOCS_WITH_RFP_IOI :
  case GET_LINK_DOCS_WITH_RFP_ID :
  case GET_LINKS_DOCS_WITH_RFP_IOI_COMPANY :
  case GET_LINKS_DOCS_WITH_LINK :
  case FETCH_LINK_DOCS_WITH_FINAL_TERM_ID :
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      return {
        ...state
        , linkDocList: action.payload.data.data.Items
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
