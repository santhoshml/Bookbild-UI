import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './components/app';
import Home from './components/home';
import RegisterCompanyForm from './components/register_company';
import LoginForm from './components/login';
import CreateRFPForm from './components/create_rfp';


export default (
  <Route path="/" component={App} >
    <IndexRoute component={Home} />
    <Route path="registerCompany" component={RegisterCompanyForm} />
    <Route path="login" component={LoginForm} />
    <Route path="create_rfp" component={CreateRFPForm} />
  </Route>
);
