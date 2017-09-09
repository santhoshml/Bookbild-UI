import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { Link } from "react-router-dom";
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import Header from './header';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/index';
import BorrowerDocumentForm from './borrowerDocuments' ;
import NonBorrowerDocumentForm from './nonBorrowerDocuments' ;

export default class DocumentForm extends Component{
	constructor(props){
		super(props);
		console.log('I am in constructor');
		this.state = {
			user : null,
			company : null,
			displayRfpId : null
		};
	}

	componentWillMount() {
		console.log('I am in documents.componentWillMount');
		let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
		this.setState({
			user : user,
			company : company
		});
	}

	render(){
		console.log('I am in documents.render');
		if(this.state.user.role === 'Company'){
			console.log('forwading to borrower Document form');
			return (
				<BorrowerDocumentForm />
			);
		} else {
			console.log('forwading to Non-borrower Document form');
			return (
				<NonBorrowerDocumentForm />
			);
		}
	}
}
