import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
// import { IntlProvider } from 'react-intl';
import promise from 'redux-promise';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import LoginForm from './components/login';
import Logout from './components/logout';
import CreateRFPForm from './components/create_rfp';
import EditRFPForm from './components/edit_rfp';
import RegisterCompanyForm from './components/register_company';
import RFPMarketPlace from './components/rfp_marketplace';
import MyProfile from './components/user_profile';
import AddUser from './components/add_user';
import RFPDetail from './components/rfp_detail';
import IOIDetail from './components/ioi_detail';
import CreateIOI from './components/create_ioi';
import EditIOI from './components/edit_ioi';
import IOIList from './components/ioi_list';
import RFPCompanyList from './components/rfp_company_list';
import RFPFavoriteList from './components/rfp_favorite_list';
import SuperAdminBoard from './components/super_admin_board';
import WGL from './components/wgl';
import Documents from './components/documents';
import QuarterlyCompliance from './components/quarterly_compliance';
import RelativeValueTool from "./components/relative_value_tool";
import LandingPage from "./components/landing";
import Solutions from "./components/solutions";
import AboutUs from "./components/about_us";
import Insights from "./components/insights";
import PrivacyPolicy from "./components/privacy_policy";
import TermsAndConditions from "./components/terms_conditions";
import ContactUs from "./components/contact_us";
import BorrowerControlledAccess from './components/borrower_controlled_access';
import CreateFinalTerm from './components/create_final_term';
import EditFinalTerm from './components/edit_final_term';
import FinalTermDetail from './components/final_term_detail';
import FinalTermList from './components/finalTerm_list';
import InviteCompany from './components/invite_company';
import Messages from './components/messages';
import Initializefromstate from './components/initializefromstate';




require("../style/style.css");
require("../css/stylish-portfolio.css");
require("../node_modules/react-dropdown/style.css");
require("../node_modules/react-tabs/style/react-tabs.css");
require("../node_modules/react-bootstrap-table/dist/react-bootstrap-table.min.css");

require("../js/stylish-portfolio.js");

require("../images/santhosh_aboutus_pic.jpg");
require("../images/bobby_aboutus_pic.jpg");
require("../images/light-bk-grnd-01.svg");
require("../images/folder-close.svg");
require("../images/folder-open.svg");

import PostsIndex from "./components/posts_index";
import PostsNew from "./components/posts_new";
import PostsShow from "./components/posts_show";

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
      <BrowserRouter>
          <div>
            <Switch>
              <Route path="/initializefromstate" component={Initializefromstate} />
              <Route path="/messages" component={Messages} />
              <Route path="/landing" component={LandingPage} />
              <Route path="/editRFP/:id" component={EditRFPForm} />
              <Route path="/createRFP" component={CreateRFPForm} />
              <Route path="/login" component={LoginForm} />
              <Route path="/wgl" component={WGL} />
              <Route path="/registerCompany" component={RegisterCompanyForm} />
              <Route path="/rfpMarketPlace" component={RFPMarketPlace} />
              <Route path="/myProfile" component={MyProfile} />
              <Route path="/addUser" component={AddUser} />
              <Route path="/rfpDetail/:id" component={RFPDetail} />
              <Route path="/createIOI/:id" component={CreateIOI} />
              <Route path="/editIOI/:id" component={EditIOI} />
              <Route path="/editFinalTerm/:id" component={EditFinalTerm} />
              <Route path="/createFinalTerm/:id" component={CreateFinalTerm} />
              <Route path="/finalTermDetail/:id" component={FinalTermDetail} />
              <Route path="/ioiDetail/:id" component={IOIDetail} />
              <Route path="/ioiList/:id/:type" component={IOIList} />
              <Route path="/finalTermList/:id/:type" component={FinalTermList} />
              <Route path="/rfpFavoriteList/:id" component={RFPFavoriteList} />
              <Route path="/rfpCompanyList/:id" component={RFPCompanyList} />
              <Route path="/superAdmin" component={SuperAdminBoard} />
              <Route path="/logout" component={Logout} />
              <Route path="/docs" component={Documents} />
              <Route path="/qCompliance" component={QuarterlyCompliance} />
              <Route path="/rvtool" component={RelativeValueTool} />
              <Route path="/solutions" component={Solutions} />
              <Route path="/aboutUs" component={AboutUs} />
              <Route path="/insights" component={Insights} />
              <Route path="/privacyPolicy" component={PrivacyPolicy} />
              <Route path="/termsAndConditions" component={TermsAndConditions} />
              <Route path="/contactUs" component={ContactUs} />
              <Route path="/borrowerControlledAccess" component={BorrowerControlledAccess} />
              <Route path="/finalTermList" component={FinalTermList} />
              <Route path="/inviteCompany" component={InviteCompany} />
              <Route path="/" component={LandingPage} />
            </Switch>
          </div>
      </BrowserRouter>
    </Provider>
  , document.querySelector('#test-container'));

