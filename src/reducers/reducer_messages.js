import { GET_ALL_MESSAGES_FOR } from '../actions/index';

const INITIAL_STATE = { msgLinkList : null, msgContactMap : null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case GET_ALL_MESSAGES_FOR :
    // console.log('action:'+JSON.stringify(action));
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      // console.log('In wgl reducer:'+JSON.stringify(action.payload));
      return {
        ...state
        , msgLinkList : action.payload.data.data.msgLinkList
        , msgContactMap : action.payload.data.data.contactMap
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
