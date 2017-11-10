import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import * as actionCreators from '../actions/index';
import ellipsis from 'text-ellipsis';

export default class Header extends Component{

	componentWillMount(){
		// console.log('I am in header componentWillMount');
		let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
		let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
		this.setState({
			user: user,
			company : company
		});
	}

	componentWillReceiveProps(nextProps){
		// console.log('I am in header componentWillReceiveProps');
		let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
		let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
		this.setState({
			user: user,
			company : company
		});
	}



	logoutCurrentUser(){
		// delete all the saved values
		lsUtils.deleteAll();
		window.location.replace("http://bookbild.com");
	}

	addLoginElement(){
		if(this.state.user){
			return(
				<a className="fa fa-sign-out header-cust-attr anchor-spacing header-menu-items " href="/logout">&nbsp;LOGOUT</a>
			);
		} else {
			return(
				<a className="fa fa-sign-in header-cust-attr anchor-spacing header-menu-items " href="/login">&nbsp;LOGIN</a>
			);
		}
		
	}

	render(){
		console.log('I am in header render');
		return (
			<header>
			<nav className="header-nav-cust-attr">
			  <div className="container-fluid">
				<span>
				  <a href="/">
					  <img alt="Brand" className="header-logo-cust-height" src="//s3-us-west-2.amazonaws.com/bookbild-shared-images/bookbild-header.jpg"/>
					</a>
				</span>
				<span className="align-right">
				  <a className="fa fa-home header-cust-attr anchor-spacing header-menu-items" href={this.state.user ? '/rfpMarketPlace' : '/'}>&nbsp;HOME</a>
				  <a className="fa fa-laptop header-cust-attr anchor-spacing header-menu-items " href="/contactUs">&nbsp;REQUEST DEMO</a>
					<a className="fa fa-bar-chart header-cust-attr anchor-spacing header-menu-items " href="/rvtool">&nbsp;DEAL COMPARISON TOOL</a>
					{this.addLoginElement()}
				</span>
			  </div>
			</nav>
		  </header>			
		    );
	}
}
