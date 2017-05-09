import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './components/app';
import Home from './components/home';
import RegisterCompanyForm from './components/register_company';
import LoginForm from './components/login';
import CreateRFPForm from './components/create_rfp';
import RFPMarketPlace from './components/rfp_marketplace';
import MyProfile from './components/user_profile';
import AddUser from './components/add_user';
import RFPDetail from './components/rfp_detail';
import IOIDetail from './components/ioi_detail';
import CreateIOI from './components/create_ioi';
import IOIList from './components/ioi_list';
import RFPList from './components/rfp_list';

import FilterExample from './components/filter_example';
import DGExample from './components/data_grid_example';

export default (
  <Route path="/" component={App} >
    <IndexRoute component={Home} />
    <Route path="registerCompany" component={RegisterCompanyForm} />
    <Route path="login" component={LoginForm} />
    <Route path="createRFP/:type" component={CreateRFPForm} />
    <Route path="rfpMarketPlace" component={RFPMarketPlace} />
    <Route path="myProfile" component={MyProfile} />
    <Route path="addUser" component={AddUser} />
    <Route path="rfpDetail/:id" component={RFPDetail} />
    <Route path="createIOI/:type" component={CreateIOI} />
    <Route path="ioiDetail/:id" component={IOIDetail} />
    <Route path="ioiList/:id/:type" component={IOIList} />
    <Route path="rfpList/:id/:type" component={RFPList} />



    <Route path="fe" component={FilterExample} />
    <Route path="dge" component={DGExample} />
  </Route>
);
