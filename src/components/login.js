import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import { loginAction } from '../actions/index';
import {Link} from 'react-router';
import validator from 'validator';

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
		console.log('In onSubmit:'+JSON.stringify(props));
		const {resetForm} = this.props;
		this.props.loginAction(props)
		 .then((data) => {
			 // blog post has been created, navigate the user to the index
			 // We navigate by calling this.context.router.push with the
			 // new path to navigate to.
			 console.log('data in loginForm :'+JSON.stringify(data));
			 if(data.payload.status === 200 && data.payload.data.status === 'SUCCESS'){ // on succesful login
				 this.context.router.push('/');
			 } else {	// login failed
				//empty the username and password
				resetForm();
				console.log('yoyo state:'+JSON.stringify(this.state));
				console.log('yoyo props:'+JSON.stringify(this.props));
				console.log('yoyo:'+JSON.stringify(data.payload.data));
				this.setState({
					errorObject : data.payload.data
				})
				// this.props.submitError = data.payload.data;
				// this.context.router.push('login');
			 }
		 });
	}

	render(){
		const {fields:{ email, password }, handleSubmit, errors} = this.props;
		console.log('props:'+JSON.stringify(this.props));
		return (
		      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
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

		        <button type="submit" className="btn btn-primary">Submit</button>
		        <Link to="/" className="btn btn-danger">Cancel</Link>
		      </form>
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

	// console.log('errors:'+JSON.stringify(errors));
  return errors;
}

export default reduxForm({
  'form': 'LoginForm',
  'fields': ['email', 'password'],
	validate
}, null, {loginAction})(LoginForm);
