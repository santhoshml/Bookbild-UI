import {GET_LINKS_DOCS_WITH_LINK, GET_LINKS_DOCS_WITH_RFP_IOI, GET_LINK_DOCS_WITH_RFP_ID, GET_LINKS_WITH_COMPANYID, GET_LINKS_DOCS_WITH_RFP_IOI_COMPANY } from '../actions/index';

const INITIAL_STATE = { linkList: null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case GET_LINKS_WITH_COMPANYID :
    // console.log('action:'+JSON.stringify(action));
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      // console.log('In wgl reducer:'+JSON.stringify(action.payload));
      return {
        ...state
        , linkList: action.payload.data.data
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
    // console.log('action:'+JSON.stringify(action));
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      // console.log('In wgl reducer:'+JSON.stringify(action.payload));
      return {
        ...state
        , linkDocList: action.payload.data.data
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
