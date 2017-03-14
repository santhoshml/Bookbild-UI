import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import LoginReducer from './reducer_login';
import MarketPlaceRFPListReducer from './reducer_marketplace_RFP';

const rootReducer = combineReducers({
  form: formReducer,
  login: LoginReducer,
  rfpList: MarketPlaceRFPListReducer
});

export default rootReducer;
