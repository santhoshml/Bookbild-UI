import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import LoginReducer from './reducer_login';
import RFPMarketPlaceListReducer from './reducer_rfp_marketplace';
import UserProfileReducer from './reducer_user_profile';
import RFPDetails from './reducer_rfp_details';
import IOIListReducer from './reducer_ioi_list';
import CreatePitchReducer from './reducer_create_pitch';
import PostsReducer from "./reducer_posts";
import WGLReducer from "./reducer_wgl";
import LinkReducer from "./reducer_link";
import DealCompReducer from "./reducer_deal_comparision";
import ComplianceDataReducer from "./reducer_compliance_data";
import ControlledAccessListReducer from "./reducer_controlled_access_list";
import FinalTermReducer from "./reducer_final_term";
import FinalTermListReducer from "./reducer_finalTerm_list";
import contactListReducer from './reducer_contacts';
import MessagesReducer from './reducer_messages';
import DashboardReducer from './reducer_dashboard';

const rootReducer = combineReducers({
  form : formReducer,
  login : LoginReducer,
  rfpList : RFPMarketPlaceListReducer,
  userProfile : UserProfileReducer,
  rfpDetails : RFPDetails,
  ioiList : IOIListReducer,
  pitch : CreatePitchReducer,
  posts : PostsReducer,
  wgl : WGLReducer,
  link : LinkReducer,
  dealComp : DealCompReducer,
  complianceData : ComplianceDataReducer,
  controlledAccessList : ControlledAccessListReducer,
  finalTerm : FinalTermReducer,
  finalTermList : FinalTermListReducer,
  contactList : contactListReducer,
  messages : MessagesReducer,
  dashboard : DashboardReducer
});

export default rootReducer;
