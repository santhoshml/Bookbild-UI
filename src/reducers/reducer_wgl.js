import { GET_WGL_BY_LINKID, GET_WGL_BY_COMPANYID } from '../actions/index';

const INITIAL_STATE = { wgl: null, wglMap: null, errObject : null };

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case GET_WGL_BY_COMPANYID :
  case GET_WGL_BY_LINKID :
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      return {
        ...state
        , wgl: action.payload.data.data.Items
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
