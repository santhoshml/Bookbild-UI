import React, {Component} from 'react';
import {getLinksWithCompanyIdAction} from '../actions/index';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import Header from './header';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/index';
import DisplayDocumentTabs from './displayDocumentTabs';


class NonBorrowerDocumentForm extends Component{
	constructor(props){
		super(props);
		console.log('I am in constructor');
		this.state = {
			user : null,
			displayLinkId : null
		};
	}

	componentWillMount() {
		console.log('I am in documents.componentWillMount');
		let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
		this.setState({
			user : user
		});		
		this.props.getLinksWithCompanyIdAction(user.companyId);
	}

	render(){
		console.log('I am in documents.render');
		const {handleSubmit, errors, pristine, reset, submitting} = this.props;
		return (
			<div className="container" >
				<Header />
				<br/>
				<br/>
				<h3>List of documents for each of your IOI</h3>
				<br/>
				<br/>
				{this.props.linkList ? <DisplayDocumentTabs linkList={this.props.linkList} type={this.state.user.role}/> : ''}
			</div>
		    );
	}
}

function mapStateToProps(state) {
	console.log('In documents.mapStateToProps');
	let rObject={};
	if(state.link.linkList){
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
