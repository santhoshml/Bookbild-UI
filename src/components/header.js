import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import * as actionCreators from '../actions/index';
import ellipsis from 'text-ellipsis';


export default class Header extends Component{

	componentWillMount(){
		let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
		let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
		this.setState({
			user: user,
			company : company
		});
	}

	componentWillReceiveProps(nextProps){
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

	displayLaunchButton(){
		if(this.state.user){
			return(
				<a className="anchor-spacing launch-btn" href={constants.ROUTES_MAP.RFP_MARKETPLACE}><b>HOME</b></a>
			);
		} else if(!this.state.user){
			return(
				<a className="anchor-spacing launch-btn" href={constants.ROUTES_MAP.LOGIN}><b>LAUNCH</b></a>
			);
		}
	}

	displaySolutions(){
		if(!this.state.user){
			return(
				<a className="fa fa-cogs header-cust-attr anchor-spacing header-menu-items" href="/solutions">&nbsp;SOLUTIONS</a>
			);
		}
	}

	displayDemo(){
		if(!this.state.user){
			return(
				<a className="fa fa-desktop header-cust-attr anchor-spacing header-menu-items" href="mailto:info@bookbild.com">&nbsp;DEMO</a>
			);
		}
	}

	displayInsights(){
		if(!this.state.user){
			return(
				<a className="fa fa-feed header-cust-attr anchor-spacing header-menu-items" href="/insights">&nbsp;INSIGHTS</a>
			);
		}
	}

	displayTeam(){
		if(!this.state.user){
			return(
				<a className="fa fa-users header-cust-attr anchor-spacing header-menu-items" href="/aboutUs">&nbsp;TEAM</a>
			);
		}
	}

	displayDashboard(){
		if(this.state.user){
			return(
				<a className="fa fa-tachometer header-cust-attr anchor-spacing header-menu-items" href="/dashboard">&nbsp;DASHBOARD</a>
			);
		}		
	}

	displayMarkets(){
		if(this.state.user){
			return(
				<a className="fa fa-line-chart header-cust-attr anchor-spacing header-menu-items" href="#">&nbsp;MARKETS</a>
			);
		}		
	}

	render(){
		return (
			<header>
				<nav className="header-nav-cust-attr">
					<div className="container-fluid">
					<span>
						<a href={this.state.user ? constants.ROUTES_MAP.RFP_MARKETPLACE : "/"}>
							<img alt="Brand" className="header-logo-cust-height" src="//s3-us-west-2.amazonaws.com/bookbild-shared-images/bookbild-header.jpg"/>
						</a>
					</span>
					<span className="align-right">
						{this.displayDashboard()}
						{this.displayMarkets()}
						{this.displaySolutions()}
						<a className="fa fa-bell-o header-cust-attr anchor-spacing header-menu-items" href="/inviteCompany">&nbsp;INVITE COMPANY</a>
						{this.displayDemo()}
						{this.displayInsights()}
						{this.displayTeam()}
						{ /* <a className="fa fa-bar-chart header-cust-attr anchor-spacing header-menu-items " href="/rvtool">&nbsp;DEAL COMPARISON TOOL</a> */}
						{this.displayLaunchButton()}
					</span>
					</div>
				</nav>
		  </header>			
		    );
	}
}
