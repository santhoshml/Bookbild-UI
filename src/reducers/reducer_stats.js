import { GET_ALL_KEY_STATS } from '../actions/index';

const INITIAL_STATE = { keyStats: null, errObject : null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case GET_ALL_KEY_STATS :
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      let dataList= action.payload.data.data.Items;
      let stats = {};
      dataList && dataList.map(item => {
        stats[item.stats_type.substring(13)] = item;
      });
      return {
        ...state
        , keyStats: stats
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
