import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router';

import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import Header from './header';

export default class Admin extends Component{
  constructor(props){
    super(props);
    console.log('I am in home.constructor');
    lsUtils.deleteAll();
  }

  componentWillReceiveProps(nextProps){
    console.log('I am in home.componentWillReceiveProps');
    lsUtils.deleteAll();
  }

  render(){
    return(
      <div>
        <Link to="/registerCompany" className="btn btn-primary">
          Add a company
        </Link>
        &nbsp;&nbsp;
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    );
  }
}
