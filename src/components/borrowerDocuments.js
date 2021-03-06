import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {fetchCompanyRFPListAction } from '../actions/index';
import { Link } from "react-router-dom";
import validator from 'validator';
import lsUtils from '../utils/ls_utils';
import cUtils from '../utils/common_utils';
import constants from '../utils/constants';
import NavBar from './sidebar';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import FileReaderInput from 'react-file-reader-input';
import * as actionCreators from '../actions/index';
import formatCurrency from 'format-currency';
import dateFormat from 'dateformat';
import moment from 'moment';
import DisplayDocumentTabs from './displayDocumentTabs';
import Header from './header';


class BorrowerDocumentForm extends Component{
	constructor(props){
		super(props);
		this.state = {
			user : null
		};
	}

	componentWillMount() {
		let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
		this.setState({
			user : user
		});
		this.props.fetchCompanyRFPListAction(user.companyId);
	}


	render(){
		const {handleSubmit, errors, pristine, reset, submitting} = this.props;
		return (
			<div>
				<Header/>
				<div style={{ display: 'flex' }}>
					<NavBar history={this.props.history}/>    			
					<div className="container main-container-left-padding" >
						<br/>
						<br/>
						<h3>List of documents for each of your RFP</h3>
						<br/>
						<br/>
						{(this.props.rfpList && this.props.rfpList.length > 0) 
							? <DisplayDocumentTabs linkList={this.props.rfpList} type={this.state.user.role}/> 
							: 'You have not invited any Lender to share documents with'}
					</div>
				</div>
			</div>
		    );
	}
}

function mapStateToProps(state) {
	let rObject={};
	if(state.rfpList.rfpList){
    rObject.rfpList = state.rfpList.rfpList;
  }
  return rObject;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
		fetchCompanyRFPListAction : fetchCompanyRFPListAction
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(BorrowerDocumentForm);
