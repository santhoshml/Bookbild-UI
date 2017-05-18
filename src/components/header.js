import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import * as actionCreators from '../actions/index';

export default class Header extends Component{
	static contextTypes ={
	    router : PropTypes.object
	};

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

	displayCreateRFPLink(){
		if(this.state.user && (this.state.user.role === constants.KEY_COMPANY || this.state.user.role === constants.KEY_FINANCIAL_SPONSOR)){
			return (
				<li><Link to={"/createRFP/"+constants.RFP_NEW}>Create RFP</Link></li>
			);
		}
	}

	displayMyRFPLink(){
		if(this.state.user && (this.state.user.role === constants.KEY_COMPANY || this.state.user.role === constants.KEY_FINANCIAL_SPONSOR)){
			return (
				<li><Link to={"/rfpCompanyList/"+this.state.company.companyId}>My RFP List</Link></li>
			);
		}
	}

	displayIOIDD(){
		if(this.state.user && this.state.user.role === constants.KEY_LENDER){
			return(
				<li className="dropdown">
					<Link to="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">IOI</Link>
					<ul className="dropdown-menu">
						<li><Link to={"/ioiList/"+this.state.company.companyId+"/"+constants.IOI_FOR_COMPANY}>My IOI List</Link></li>
						<li><Link to="#">Create a Pitch</Link></li>
						<li><Link to="#">Default Pitch Settings</Link></li>
					</ul>
				</li>
			);
		}
	}

	logoutCurrentUser(){
		// delete all the saved values
		lsUtils.deleteAll();
		window.location.replace("http://bookbild.com");
	}

	getAddUserLink(){
		if(this.state.user.isAdmin && this.state.user.isAdmin=== true){
			return(
				<li><Link to="/addUser">Add a User</Link></li>
			);
		}
	}

	displayLoginLogoutDD(){
		if(this.state.user){
			return (
				<li className="dropdown">
					<Link to="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{this.state.user.email}</Link>
					<ul className="dropdown-menu">
						<li><Link to="/myProfile">Profile</Link></li>
						<li><Link to="#">My Team</Link></li>
						{this.getAddUserLink()}
						<li><Link onClick={this.logoutCurrentUser}>Logout</Link></li>
					</ul>
				</li>
			);
		} else {
			return(
				<li className="dropdown">
					<Link to="/login" role="button" aria-haspopup="true" aria-expanded="false">Login</Link>
				</li>
			);
		}
	}


	render(){
		// console.log('I am in header render');
		return (
				<div>
				<nav className="navbar navbar-default">
				  <div className="container-fluid">
				    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
				      <ul className="nav navbar-nav">
								<li className="dropdown">
									<Link to="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">RFP</Link>
									<ul className="dropdown-menu">
										<li><Link to="/rfpMarketPlace">RFP List</Link></li>
										<li><Link to={"/rfpFavoriteList/"+this.state.user.userId}>My Favorites</Link></li>
										{this.displayMyRFPLink()}
										{this.displayCreateRFPLink()}
									</ul>
								</li>
								{this.displayIOIDD()}
				      	<li><Link to="#">Concourse</Link></li>
				        <li><Link to="#">Data Room</Link></li>
								<li><Link to="#">Legal Docs</Link></li>
								<li><Link to="#">Market Data</Link></li>
								<li><Link to="#">Tombstones</Link></li>
								{this.displayLoginLogoutDD()}
				      </ul>
				    </div>
				  </div>
				</nav>
				</div>
		    );
	}
}
