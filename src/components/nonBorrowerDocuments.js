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
			<div>
				<Header/>
				<div style={{ display: 'flex' }}>
					<NavBar history={this.props.history}/>			
					<div className="container main-container-left-padding" >
						<br/>
						<br/>
						<h3>List of documents for each of your IOI</h3>
						<br/>
						<br/>
						{this.props.linkList ? <DisplayDocumentTabs linkList={this.props.linkList} type={this.state.user.role}/> : ''}
					</div>
				</div>
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
