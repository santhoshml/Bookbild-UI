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
import RegisterCompanyForm from './components/register_company';
import RFPMarketPlace from './components/rfp_marketplace';
import MyProfile from './components/user_profile';
import AddUser from './components/add_user';
import RFPDetail from './components/rfp_detail';
import IOIDetail from './components/ioi_detail';
import CreateIOI from './components/create_ioi';
import UnsolicitedPitch from './components/unsolicited_pitch';
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

import PostsIndex from "./components/posts_index";
import PostsNew from "./components/posts_new";
import PostsShow from "./components/posts_show";

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
      <BrowserRouter>
          <div>
            <Switch>
              <Route path="/landing" component={LandingPage} />
              <Route path="/createRFP/:type" component={CreateRFPForm} />
              <Route path="/login" component={LoginForm} />
              <Route path="/wgl" component={WGL} />
              <Route path="/registerCompany" component={RegisterCompanyForm} />
              <Route path="/rfpMarketPlace" component={RFPMarketPlace} />
              <Route path="/myProfile" component={MyProfile} />
              <Route path="/addUser" component={AddUser} />
              <Route path="/rfpDetail/:id" component={RFPDetail} />
              <Route path="/createIOI/:type" component={CreateIOI} />
              <Route path="/ioiDetail/:id" component={IOIDetail} />
              <Route path="/ioiList/:id/:type" component={IOIList} />
              <Route path="/rfpFavoriteList/:id" component={RFPFavoriteList} />
              <Route path="/rfpCompanyList/:id" component={RFPCompanyList} />
              <Route path="/superAdmin" component={SuperAdminBoard} />
              <Route path="/createPitch/:type" component={UnsolicitedPitch} />
              <Route path="/logout" component={Logout} />
              <Route path="/docs" component={Documents} />
              <Route path="/qCompliance" component={QuarterlyCompliance} />
              <Route path="/rvtool" component={RelativeValueTool} />
              <Route path="/solutions" component={Solutions} />
              <Route path="/aboutUs" component={AboutUs} />
              <Route path="/" component={LandingPage} />
            </Switch>
          </div>
      </BrowserRouter>
    </Provider>
  , document.querySelector('#test-container'));

  // <Route path="/posts/new" component={PostsNew} />
  // <Route path="/posts/:id" component={PostsShow} />
  // <Route path="/" component={PostsIndex} />
