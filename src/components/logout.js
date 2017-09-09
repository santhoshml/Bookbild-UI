import React, {Component} from 'react';
import { Redirect } from "react-router";
import validator from 'validator';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import Header from './header';
import { connect } from "react-redux";

import * as actionCreators from '../actions/index';

export default class Logout extends Component{

	render(){
		lsUtils.deleteAll();
		return(
				<Redirect to='/login'/>
		);

	}
}
