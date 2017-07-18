import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
// import { Router, browserHistory } from 'react-router';
import reducers from './reducers';
import { IntlProvider } from 'react-intl';
// import routes from './routes';
import promise from 'redux-promise';
// import App from './components/app';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginForm from './components/login';
import CreateRFPForm from './components/create_rfp';


const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

ReactDOM.render(
  <IntlProvider locale="en">
    <Provider store={createStoreWithMiddleware(reducers)}>
      <BrowserRouter>
          <div>
            <Switch>
              <Route path="createRFP/:type" component={CreateRFPForm} />
              <Route path="login" component={LoginForm} />
              <Route component={LoginForm} />
            </Switch>
          </div>
      </BrowserRouter>
    </Provider>
  </IntlProvider>
  , document.querySelector('.container'));
