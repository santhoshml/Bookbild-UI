import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import { loginAction, fetchAllRFPAction } from '../actions/index';
import {Link} from 'react-router';
import validator from 'validator';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import Header from './header';

import * as actionCreators from '../actions/index';

class LoginForm extends Component{
	constructor(props){
		super(props);
		this.state = {
			errorObject : null
		}
	}

	static contextTypes ={
	    router : PropTypes.object
	};

	onSubmit(props){
		const {resetForm} = this.props;
		this.props.loginAction(props)
		 .then((data) => {
			 // blog post has been created, navigate the user to the index
			 // We navigate by calling this.context.router.push with the
			 // new path to navigate to.
			 if(data.payload.status === 200 && data.payload.data.status === 'SUCCESS'){ // on succesful login
				 // store the files in local storage
				 lsUtils.setValue(constants.KEY_USER_OBJECT, data.payload.data.data.userObject);
				 lsUtils.setValue(constants.KEY_COMPANY_OBJECT, data.payload.data.data.companyObject);

				 this.context.router.push('/rfpMarketPlace');
			 } else {	// login failed
				//empty the username and password
				resetForm();
				this.setState({
					errorObject : data.payload.data
				})
				// this.props.submitError = data.payload.data;
				// this.context.router.push('login');
			 }
		 });
	}

	render(){
		const {fields:{ email, password, tcAgreement }, handleSubmit, errors} = this.props;
		return (
				<div>
					<br/>
					<br/>
		      <form onSubmit={handleSubmit(this.onSubmit.bind(this))} className="login-form">
		        <h3>Login to access your account</h3>

						<div className="text-help">
							{this.state.errorObject ? this.state.errorObject.err_desc : ''}
						</div>

		        <div className={`form-group ${email.touched && email.invalid ? 'has-danger' : ''}`}>
		          <label> Email used for login </label>
		          <input type="email" className="form-control" placeholder="Enter a valid email" {...email}/>
							<div className="text-help">
            		{email.touched ? email.error : ''}
          		</div>
		        </div>

		        <div className={`form-group ${password.touched && password.invalid ? 'has-danger' : ''}`}>
		          <label>Password</label>
		          <input type="password" className="form-control" placeholder="Enter password" {...password}/>
							<div className="text-help">
            		{password.touched ? password.error : ''}
          		</div>
		        </div>

						<div className="checkbox">
							<label><input type="checkbox" {...tcAgreement} />&nbsp;by clicking on submit, I agree to <a href="terms_and_conditions.html" target="_blank">Bookbild terms and conditions.</a></label>
							<div className="text-help">
								{tcAgreement.touched ? tcAgreement.error : ''}
							</div>
						</div>

		        <button type="submit" className="btn btn-primary">Submit</button>
		        <Link to="/" className="btn btn-danger">Cancel</Link>
		      </form>
				</div>
		    );
	}
}

function validate(values){
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
  'form': 'LoginForm',
  'fields': ['email', 'password', 'tcAgreement'],
	validate
}, null, {loginAction})(LoginForm);
