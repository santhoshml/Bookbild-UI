import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './components/app';
import Home from './components/home';
import RegisterCompanyForm from './components/register_company';
import LoginForm from './components/login';
import CreateRFPForm from './components/create_rfp';
import RFPMarketPlace from './components/rfp_marketPlace';
import MyProfile from './components/user_profile';
import AddUser from './components/add_user';

import FilterExample from './components/filter_example';
import DGExample from './components/data_grid_example';

export default (
  <Route path="/" component={App} >
    <IndexRoute component={Home} />
    <Route path="registerCompany" component={RegisterCompanyForm} />
    <Route path="login" component={LoginForm} />
    <Route path="createRFP" component={CreateRFPForm} />
    <Route path="rfpMarketPlace" component={RFPMarketPlace} />
    <Route path="myProfile" component={MyProfile} />
    <Route path="addUser" component={AddUser} />

    <Route path="fe" component={FilterExample} />
    <Route path="dge" component={DGExample} />
  </Route>
);
