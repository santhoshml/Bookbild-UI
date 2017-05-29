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
  }


  render(){
    return(
      <div>
        <Header />
        <Link to="/registerCompany" className="btn btn-primary">
          Add a company
        </Link>
        &nbsp;&nbsp;
        <Link to={"/createRFP/"+constants.RFP_NEW} className="btn btn-primary">
          Create RFP
        </Link>
        &nbsp;&nbsp;
        <Link to="/" className="btn btn-primary">
          Reset Activity TermSheet stats
        </Link>
      </div>
    );
  }
}
