import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import LoginReducer from './reducer_login';
import MarketPlaceRFPListReducer from './reducer_marketplace_RFP';
import UserProfileReducer from './reducer_user_profile';

const rootReducer = combineReducers({
  form: formReducer,
  login: LoginReducer,
  rfpList: MarketPlaceRFPListReducer,
  userProfile : UserProfileReducer
});

export default rootReducer;
