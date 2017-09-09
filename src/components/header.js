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

	displayCreateRFPLink(){
		if(this.state.user
			&& (this.state.user.role === constants.KEY_COMPANY
				|| this.state.user.role === constants.KEY_FINANCIAL_SPONSOR
				|| this.state.user.role === constants.KEY_SUPER_ADMIN )
			){
			return (
				<li><Link to={constants.ROUTES_MAP.CREATE_RFP+"/"+constants.RFP_NEW}>Create RFP</Link></li>
			);
		}
	}

	displayMyRFPLink(){
		if(this.state.user
			&& (this.state.user.role === constants.KEY_COMPANY
				|| this.state.user.role === constants.KEY_FINANCIAL_SPONSOR
				|| this.state.user.role === constants.KEY_SUPER_ADMIN
			)){
			return (
				<li><Link to={constants.ROUTES_MAP.RFP_COMPANY_LIST+"/"+this.state.company.companyId}>My RFP List</Link></li>
			);
		}
	}

	displayIOIDD(){
		if(this.state.user
			&& (this.state.user.role === constants.KEY_LENDER
			|| this.state.user.role === constants.KEY_SUPER_ADMIN)
		){
			return(
				<li className="dropdown">
					<Link to="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">IOI</Link>
					<ul className="dropdown-menu">
						<li><Link to={constants.ROUTES_MAP.IOI_LIST+"/"+this.state.company.companyId+"/"+constants.IOI_FOR_COMPANY}>My IOI List</Link></li>

					</ul>
				</li>
			);
		}
		//<li><Link to={"/createPitch/"+constants.PITCH_NEW}>Create a Pitch</Link></li>
		//<li><Link to="#">Default Pitch Settings</Link></li>
	}

	logoutCurrentUser(){
		// delete all the saved values
		lsUtils.deleteAll();
		window.location.replace("http://bookbild.com");
	}

	getAddUserLink(){
		if((this.state.user && this.state.user.isAdmin && this.state.user.isAdmin=== true)
			||(this.state.user && this.state.user.isSuperAdmin && this.state.user.isSuperAdmin=== true)
		){
			return(
				<li><Link to={constants.ROUTES_MAP.ADD_USER}>Add a User</Link></li>
			);
		}
	}

	displayLoginLogoutDD(){

		if(this.state.user){
			return (
				<li className="dropdown">
					<Link to="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{ellipsis(this.state.user.email, 10)}</Link>
					<ul className="dropdown-menu">
						<li><Link to={constants.ROUTES_MAP.MY_PROFILE}>Profile</Link></li>
						<li><Link to="#">My Team</Link></li>
						{this.getAddUserLink()}
						<li><Link to={constants.ROUTES_MAP.LOGOUT}>Logout</Link></li>
					</ul>
				</li>
			);
		} else {
			return(
				<li className="dropdown">
					<Link to={constants.ROUTES_MAP.LOGIN} role="button" aria-haspopup="true" aria-expanded="false">Login</Link>
				</li>
			);
		}
	}

	displaySuperAdminDashBoard(){
		if(this.state.user && this.state.user.isSuperAdmin && this.state.user.isSuperAdmin === true){
			return (<li><Link to={constants.ROUTES_MAP.SUPER_ADMIN}>SuperAdmin</Link></li>);
		}
	}

	displayConcourse(){
		return(
			<li className="dropdown">
				<Link to="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Concourse</Link>
				<ul className="dropdown-menu">
					<li><Link to="#">Network</Link></li>
					<li><Link to="#">Forum</Link></li>
					<li><Link to="#">Messages</Link></li>
				</ul>
			</li>
		);
	}

	displayLegalDocs(){
		return(
			<li className="dropdown">
				<Link to="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Legal Docs</Link>
				<ul className="dropdown-menu">
					<li><Link to="#">My Precedents</Link></li>
					<li><Link to="#">Create Precedent</Link></li>
					<li><Link to="#">Search Precedents</Link></li>
				</ul>
			</li>
		);
	}

	displayMarketData(){
		return(
			<li className="dropdown">
				<Link to="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Market Data</Link>
				<ul className="dropdown-menu">
					<li><Link to="#">Sector Heatmaps</Link></li>
					<li><Link to="#">Private Debt Trends</Link></li>
					<li><Link to="#">Economic Data</Link></li>
					<li><Link to="#">News</Link></li>
				</ul>
			</li>
		);
	}

	displayDataRoom(){
		return(
			<li className="dropdown">
				<Link to="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Data Room</Link>
				<ul className="dropdown-menu">
					<li><Link to="#">New Project</Link></li>
					<li><Link to={constants.ROUTES_MAP.DOCS}>Documents</Link></li>
					<li><Link to="#">Edit Deal Team</Link></li>
					<li><Link to={constants.ROUTES_MAP.WGL}>Manage WGL</Link></li>
					<li><Link to="#">Quarterly Compliance</Link></li>
				</ul>
			</li>
		);
	}

	displayTombstones(){
		return(
			<li className="dropdown">
				<Link to="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Tombstones</Link>
				<ul className="dropdown-menu">
					<li><Link to="#">Manage Quals</Link></li>
					<li><Link to="#">Upload Tombstones</Link></li>
				</ul>
			</li>
		);
	}

	render(){
		// console.log('I am in header render');
		return (
				<div>
				<nav className="navbar navbar-default">
				  <div className="container-fluid">
				    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
				      <ul className="nav navbar-nav">
								{this.displaySuperAdminDashBoard()}
								<li className="dropdown">
									<Link to="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">RFP</Link>
									<ul className="dropdown-menu">
										<li><Link to={constants.ROUTES_MAP.RFP_MARKETPLACE}>RFP List</Link></li>
										<li><Link to={constants.ROUTES_MAP.RFP_FAVORITES_LIST+"/"+this.state.user.userId}>My Favorites</Link></li>
										{this.displayMyRFPLink()}
										{this.displayCreateRFPLink()}
										<li><Link to="/#">Parameter Search</Link></li>
									</ul>
								</li>
								{this.displayIOIDD()}
								{this.displayConcourse()}
								{this.displayDataRoom()}
								{this.displayLegalDocs()}
								{this.displayMarketData()}
								{this.displayTombstones()}
								{this.displayLoginLogoutDD()}
				      </ul>
				    </div>
				  </div>
				</nav>
				</div>
		    );
	}
}
