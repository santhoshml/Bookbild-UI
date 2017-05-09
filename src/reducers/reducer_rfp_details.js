import { ADD_RFP_TO_FAVORITES, REMOVE_RFP_FROM_FAVORITES, GET_RFP_FROM_FAVORITES } from '../actions/index';

const INITIAL_STATE = { rfpFavoritesJSON: null, isFavorite: false };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case GET_RFP_FROM_FAVORITES:
      if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
        let isFavorite = (action.payload.data.data.Count === 0 ? false : true);
        return {
          ...state
          , rfpFavoritesJSON: action.payload.data.data.Items[0]
          , isFavorite: isFavorite
        };
      } else {
        return {
            ...state
            , errObject : action.payload.data
        };
      }
      break;
    case REMOVE_RFP_FROM_FAVORITES:
      if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){

        return {
          ...state
          , rfpFavoritesJSON: null
          , isFavorite: false
        };
      } else {
        return {
            ...state
            , errObject : action.payload.data
        };
      }
      break;
    case ADD_RFP_TO_FAVORITES:
      if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
        return {
          ...state
          , rfpFavoritesJSON: {
            favoriteId : action.payload.data.data
            }
          , isFavorite: true
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
