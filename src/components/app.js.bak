import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import RegisterCompanyForm from './register_company';
import LoginForm from './login';
import CreateRFPForm from './create_rfp';
import RFPMarketPlace from './rfp_marketplace';
import MyProfile from './user_profile';
import AddUser from './add_user';
import RFPDetail from './rfp_detail';
import IOIDetail from './ioi_detail';
import CreateIOI from './create_ioi';
import UnsolicitedPitch from './unsolicited_pitch';
import IOIList from './ioi_list';
import RFPCompanyList from './rfp_company_list';
import RFPFavoriteList from './rfp_favorite_list';
import SuperAdminBoard from './super_admin_board';


export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
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
          <Route path="rfpFavoriteList/:id" component={RFPFavoriteList} />
          <Route path="rfpCompanyList/:id" component={RFPCompanyList} />
          <Route path="superAdmin" component={SuperAdminBoard} />
          <Route path="createPitch/:type" component={UnsolicitedPitch} />
          <Route component={LoginForm} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
