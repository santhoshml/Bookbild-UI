import React, {Component} from 'react';
import {getLinksWithCompanyIdAction} from '../actions/index';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import NavBar from './sidebar';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/index';
import DisplayDocumentTabs from './displayDocumentTabs';
import Header from './header';
import Dropdown from 'react-dropdown';
import DataroomDropdown from './data_room_dropdown';

class NonBorrowerDocumentForm extends Component{
	constructor(props){
		super(props);
		// console.log('I am in constructor');
		this.state = {
			user : null,
			displayLinkId : null
		};
	}

	componentWillMount() {
		// console.log('I am in documents.componentWillMount');
		let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
		let type = null;
		// console.log('user:'+JSON.stringify(user));
		if(user.role === constants.KEY_COMPANY || user.role === constants.KEY_FINANCIAL_SPONSOR){
			type = 'BORROWER';
		} else if(user.role === constants.KEY_LENDER){
			type = 'LENDER';
		}
		this.props.getLinksWithCompanyIdAction(user.companyId, type);
		this.setState({
			user : user
		});
	}

	_onSelectDropdown(event){
		// console.log('In _onSelectDropdown');
		// console.log('event:'+JSON.stringify(event));
		this.props.linkList.forEach(link => {
			if(link.linkId === event.value){
				this.setState({
					selectedLink : link,
					selectedDropDown : event
				});
			}
		});
	}

	render(){
		// console.log('I am in documents.render');
		const {handleSubmit, errors, pristine, reset, submitting} = this.props;
		return (
			<div>
				<Header/>
				<div style={{ display: 'flex' }}>
					<NavBar history={this.props.history}/>			
					<div className="container main-container-left-padding" >
						<br/>
						<br/>
						<h3>Documents</h3>
						<br/>
						<p>Select the link from dropdown to see the documents related to the deal.</p>
						<br/>
						<DataroomDropdown linkList={this.props.linkList} onChange={this._onSelectDropdown.bind(this)} selectedDropDown={this.state.selectedDropDown}/>
						<br/>
						<br/>
						{this.state.selectedLink
							? <DisplayDocumentTabs link={this.state.selectedLink} type={this.state.user.role}/>
							: ''}
					</div>
				</div>
			</div>
		    );
	}
}

function mapStateToProps(state) {
	// console.log('In documents.mapStateToProps');
	let rObject={};
	if(state.link.linkList){
		// console.log('state.link.linkList:'+JSON.stringify(state.link.linkList));
		rObject.linkList = state.link.linkList;
	}
  return rObject;
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
		getLinksWithCompanyIdAction : getLinksWithCompanyIdAction,
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(NonBorrowerDocumentForm);
