import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './components/app';
import Home from './components/home';
import RegisterCompany from './components/register_company';


export default (
  <Route path="/" component={App} >
    <IndexRoute component={Home} />
    <Route path="registerCompany" component={RegisterCompany} />
  </Route>
);
