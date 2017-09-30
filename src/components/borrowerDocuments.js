import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {fetchCompanyRFPListAction } from '../actions/index';
import { Link } from "react-router-dom";
import validator from 'validator';
import lsUtils from '../utils/ls_utils';
import cUtils from '../utils/common_utils';
import constants from '../utils/constants';
import Header from './header';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import FileReaderInput from 'react-file-reader-input';
import * as actionCreators from '../actions/index';
import formatCurrency from 'format-currency';
import dateFormat from 'dateformat';
import moment from 'moment';
import DisplayDocumentTabs from './displayDocumentTabs';


class BorrowerDocumentForm extends Component{
	constructor(props){
		super(props);
		console.log('I am in constructor');
		this.state = {
			user : null
		};
	}

	componentWillMount() {
		console.log('I am in documents.componentWillMount');
		let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
		console.log('user:'+JSON.stringify(user));
		this.setState({
			user : user
		});
		this.props.fetchCompanyRFPListAction(user.companyId);
	}


	render(){
		console.log('I am in documents.render');
		const {handleSubmit, errors, pristine, reset, submitting} = this.props;
		return (
			<div>
				<Header />
				<br/>
				<br/>
				<h3>List of documents for each of your RFP</h3>
				<br/>
				<br/>
				{this.props.rfpList ? <DisplayDocumentTabs linkList={this.props.rfpList} type={this.state.user.role}/> : ''}
			</div>
		    );
	}
}

function mapStateToProps(state) {
	console.log('In documents.mapStateToProps');
	let rObject={};
	if(state.rfpList.rfpList){
    rObject.rfpList = state.rfpList.rfpList;
  }
  return rObject;
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
		fetchCompanyRFPListAction : fetchCompanyRFPListAction
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(BorrowerDocumentForm);
