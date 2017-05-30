import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import LoginReducer from './reducer_login';
import RFPMarketPlaceListReducer from './reducer_rfp_marketplace';
import UserProfileReducer from './reducer_user_profile';
import RFPDetails from './reducer_rfp_details';
import IOIListReducer from './reducer_ioi_list';
import CreatePitchReducer from './reducer_create_pitch';

const rootReducer = combineReducers({
  form: formReducer,
  login: LoginReducer,
  rfpList: RFPMarketPlaceListReducer,
  userProfile : UserProfileReducer,
  rfpDetails : RFPDetails,
  ioiList : IOIListReducer,
  pitch : CreatePitchReducer
});

export default rootReducer;
