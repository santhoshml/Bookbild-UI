import { GET_BORROWER_CONTROLLED_ACCESS_LIST } from '../actions/index';

const INITIAL_STATE = { borrowerControlledAccessList: null, errObject : null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case GET_BORROWER_CONTROLLED_ACCESS_LIST:
    // console.log('action:'+JSON.stringify(action));
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      // console.log('In wgl reducer:'+JSON.stringify(action.payload));
      return {
        ...state
        , borrowerControlledAccessList: action.payload.data.data.Items
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
