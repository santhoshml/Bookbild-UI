import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { loginAction, fetchAllRFPAction } from '../actions/index';
import { Link } from "react-router-dom";
import validator from 'validator';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import Header from './header';
import { connect } from "react-redux";
import RelativeValueTool from './relative_value_tool';
import * as actionCreators from '../actions/index';

class LoginForm extends Component{

	renderField(field) {
		const { meta: { touched, error } } = field;
		const className = `form-group ${touched && error ? "has-danger" : ""}`;
		// console.log('field:'+JSON.stringify(field));
		return (
			<div className={className}>
				<label>{field.label}</label>
				<input
					className="form-control"
					placeholder={field.placeholder}
					type={field.type}
					{...field.input} />
				<div className="text-help">
					{touched ? error : ""}
				</div>
			</div>
		);
	}

	renderCheckboxField(field) {
		const { meta: { touched, error } } = field;
		const className = `form-group ${touched && error ? "has-danger" : ""}`;
		// console.log('field:'+JSON.stringify(field));
		return (
			<div className={className}>
				<label>
					<input
						type={field.type}
						{...field.input}
						/>
					&nbsp;by clicking on submit, I agree to <a href='/termsAndConditions' target='_blank'>Bookbild terms and conditions.</a>
				</label>
				<div className="text-help">
					{touched ? error : ""}
				</div>
			</div>
		);
	}

	onSubmit(values){
		// const {resetForm} = this.props;
		this.props.loginAction(values)
		 .then((data) => {
			//  console.log('In submit then, data:'+JSON.stringify(data));
			 // blog post has been created, navigate the user to the index
			 // We navigate by calling this.context.router.push with the
			 // new path to navigate to.
			 if(data.payload.status === 200 && data.payload.data.status === 'SUCCESS'){ // on succesful login
				 // store the files in local storage
				 lsUtils.setValue(constants.KEY_USER_OBJECT, data.payload.data.data.userObject);
				 lsUtils.setValue(constants.KEY_COMPANY_OBJECT, data.payload.data.data.companyObject);

				 console.log('forwading now');

				 this.props.history.push(constants.ROUTES_MAP.RFP_MARKETPLACE);
				//  this.props.history.push(constants.ROUTES_MAP.CREATE_RFP+'/'+ constants.RFP_NEW); // FOR LOCAL_TESTING
			 } else {	// login failed
				//empty the username and password
				// resetForm();
				this.setState({
					errorObject : data.payload.data
				})
			 }
		 });
	}

	render(){
		const {handleSubmit, errors, pristine, reset, submitting} = this.props;
		return (
				<div>
					<Header/>
					<div className="container" >
						<br/>
						<br/>
						<form onSubmit={handleSubmit(this.onSubmit.bind(this))} className="login-form">
							<h3>Login to access your account</h3>

							<br/>
							<br/>
							<Field
								name="email"
								component={this.renderField}
								label="Email used for login"
								placeholder = "Email used to register with Bookbild"
								type="text"
							/>
							<Field
								name="password"
								component={this.renderField}
								label="Password to login"
								placeholder = "password used with Bookbild"
								type="password"
							/>
							<Field
								name="tcAgreement"
								component={this.renderCheckboxField}
								type="checkbox"
							/>

							<button type="submit" className="btn btn-primary" disabled={submitting}>Submit</button>
							<Link to="/" disabled={pristine || submitting} className="btn btn-danger" onClick={reset}>Cancel</Link>
						</form>
					</div>
				</div>
		    );
	}
}

function validate(values){
	// console.log('I am in validate');
  const errors={};

  if(!values.email || !validator.isEmail(values.email)){
    errors.email='Enter a valid email';
  }

  if(!values.password){
    errors.password='Enter password';
  }

	if(!values.tcAgreement){
    errors.tcAgreement='You have to agree to terms and conditions before you login';
  }

  return errors;
}

export default reduxForm({
	validate,
  form: 'LoginForm'
}) (connect(null, {loginAction})(LoginForm));
