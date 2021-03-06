import { GET_ALL_MESSAGES_FOR, GET_MESSAGE_LIST } from '../actions/index';

const INITIAL_STATE = { msgLinkList : null, msgContactMap : null, convContactMap : null, messages : null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case GET_ALL_MESSAGES_FOR :
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      return {
        ...state
        , msgLinkList : action.payload.data.data
      };
    } else {
      return {
          ...state
          , errObject : action.payload.data
      };
    }
    break;
    case GET_MESSAGE_LIST :
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      return {
        ...state
        , messages : action.payload.data.data.messages
        , convContactMap : action.payload.data.data.contactMap
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
