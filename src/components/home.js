import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router';

import * as actionCreators from '../actions/index';

export default class Home extends Component{
  render(){
    return(
      <div>
        <Link to="/registerCompany" className="btn btn-primary">
          Add a company
        </Link>

        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    );
  }
}
