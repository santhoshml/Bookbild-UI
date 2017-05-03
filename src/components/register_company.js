import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import { registerCompanyAction } from '../actions/index';
import {Link} from 'react-router';
import validator from 'validator';

import * as actionCreators from '../actions/index';

class RegisterCompanyForm extends Component{
	static contextTypes ={
	    router : PropTypes.object
	};

	onSubmit(props){
		this.props.registerCompanyAction(props)
		 .then(() => {
			 // blog post has been created, navigate the user to the index
			 // We navigate by calling this.context.router.push with the
			 // new path to navigate to.
			 this.context.router.push('/');
		 });
	}

	render(){
		const {fields:{companyName, ein, role
			, streetAddress, city, state, zipcode
			, fullName, email, password, confirmPassword, phoneNumber
			}, handleSubmit} = this.props;

		return (
		      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
						<h3>Add a NEW Company </h3>
						<br/>
						<br/>
		        <h3>Compay Details</h3>

						<div className={`row`}>
			        <div className={`form-group col-xs-8 col-md-8 ${companyName.touched && companyName.invalid ? 'has-danger' : ''}`}>
			          <label> Company Name </label>
			          <input type="text" className="form-control" placeholder="Enter a valid Company Name" {...companyName}/>
								<div className="text-help">
	            		{companyName.touched ? companyName.error : ''}
	          		</div>
			        </div>

			        <div className={`form-group col-xs-4 col-md-4 ${ein.touched && ein.invalid ? 'has-danger' : ''}`}>
			          <label>EIN of the Company</label>
			          <input type="text" className="form-control" placeholder="Enter a valid Company EIN" {...ein}/>
								<div className="text-help">
	            		{ein.touched ? ein.error : ''}
	          		</div>
			        </div>
						</div>

						<br/>
						<hr className={`col-xs-12 col-md-12`}/>
						<h3>Address Details</h3>

						<div className={`row`}>
							<div className={`form-group col-xs-12 col-md-12 ${streetAddress.touched && streetAddress.invalid ? 'has-danger' : ''}`}>
			          <label> Street Address </label>
			          <input type="text" className="form-control" placeholder="Enter a valid Street Address of the Company" {...streetAddress}/>
								<div className="text-help">
	            		{streetAddress.touched ? streetAddress.error : ''}
	          		</div>
			        </div>
						</div>

						<div className={`row`}>
							<div className={`form-group col-xs-6 col-md-6 ${city.touched && city.invalid ? 'has-danger' : ''}`}>
			          <label>City</label>
			          <input type="text" className="form-control" placeholder="Enter the City of the Company" {...city}/>
								<div className="text-help">
	            		{city.touched ? city.error : ''}
	          		</div>
			        </div>

			        <div className={`form-group col-xs-3 col-md-3 ${state.touched && state.invalid ? 'has-danger' : ''}`}>
			          <label>State</label>
								<select className="form-control" {...state}>
									<option value=""> --- select one --- </option>
									<option value="AL">Alabama</option>
									<option value="AK">Alaska</option>
									<option value="AZ">Arizona</option>
									<option value="AR">Arkansas</option>
									<option value="CA">California</option>
									<option value="CO">Colorado</option>
									<option value="CT">Connecticut</option>
									<option value="DE">Delaware</option>
									<option value="DC">District Of Columbia</option>
									<option value="FL">Florida</option>
									<option value="GA">Georgia</option>
									<option value="HI">Hawaii</option>
									<option value="ID">Idaho</option>
									<option value="IL">Illinois</option>
									<option value="IN">Indiana</option>
									<option value="IA">Iowa</option>
									<option value="KS">Kansas</option>
									<option value="KY">Kentucky</option>
									<option value="LA">Louisiana</option>
									<option value="ME">Maine</option>
									<option value="MD">Maryland</option>
									<option value="MA">Massachusetts</option>
									<option value="MI">Michigan</option>
									<option value="MN">Minnesota</option>
									<option value="MS">Mississippi</option>
									<option value="MO">Missouri</option>
									<option value="MT">Montana</option>
									<option value="NE">Nebraska</option>
									<option value="NV">Nevada</option>
									<option value="NH">New Hampshire</option>
									<option value="NJ">New Jersey</option>
									<option value="NM">New Mexico</option>
									<option value="NY">New York</option>
									<option value="NC">North Carolina</option>
									<option value="ND">North Dakota</option>
									<option value="OH">Ohio</option>
									<option value="OK">Oklahoma</option>
									<option value="OR">Oregon</option>
									<option value="PA">Pennsylvania</option>
									<option value="RI">Rhode Island</option>
									<option value="SC">South Carolina</option>
									<option value="SD">South Dakota</option>
									<option value="TN">Tennessee</option>
									<option value="TX">Texas</option>
									<option value="UT">Utah</option>
									<option value="VT">Vermont</option>
									<option value="VA">Virginia</option>
									<option value="WA">Washington</option>
									<option value="WV">West Virginia</option>
									<option value="WI">Wisconsin</option>
									<option value="WY">Wyoming</option>
							  </select>
								<div className="text-help">
	            		{state.touched ? state.error : ''}
	          		</div>
			        </div>

			        <div className={`form-group col-xs-3 col-md-3 ${zipcode.touched && zipcode.invalid ? 'has-danger' : ''}`}>
			          <label>Zipcode</label>
			          <input type="text" className="form-control" placeholder="Enter a valid zipcode of the Company" {...zipcode}/>
								<div className="text-help">
	            		{zipcode.touched ? zipcode.error : ''}
	          		</div>
			        </div>
						</div>

						<br/>
						<hr className={`col-xs-12 col-md-12`}/>
						<h3>Contact Details</h3>

						<div className={`row`}>
							<div className={`form-group col-xs-12 col-md-12 ${fullName.touched && fullName.invalid ? 'has-danger' : ''}`}>
			          <label> Full Name </label>
			          <input type="text" className="form-control" placeholder="Enter users full name" {...fullName}/>
								<div className="text-help">
	            		{fullName.touched ? fullName.error : ''}
	          		</div>
			        </div>
						</div>

						<div className={`row`}>
			        <div className={`form-group col-xs-6 col-md-6 ${email.touched && email.invalid ? 'has-danger' : ''}`}>
			          <label>Email</label>
			          <input type="email" className="form-control" placeholder="Enter a valid email" {...email}/>
								<div className="text-help">
	            		{email.touched ? email.error : ''}
	          		</div>
			        </div>

							<div className={`form-group col-xs-6 col-md-6 ${phoneNumber.touched && phoneNumber.invalid ? 'has-danger' : ''}`}>
			          <label>Phone Number</label>
			          <input type="text" className="form-control" placeholder="Enter a valid phone number" {...phoneNumber}/>
								<div className="text-help">
	            		{phoneNumber.touched ? phoneNumber.error : ''}
	          		</div>
			        </div>
						</div>

						<div className={`row`}>
			        <div className={`form-group col-xs-6 col-md-6 ${password.touched && password.invalid ? 'has-danger' : ''}`}>
			          <label>Password</label>
			          <input type="password" className="form-control" placeholder="Enter password" {...password}/>
								<div className="text-help">
	            		{password.touched ? password.error : ''}
	          		</div>
			        </div>

							<div className={`form-group col-xs-6 col-md-6 ${confirmPassword.touched && confirmPassword.invalid ? 'has-danger' : ''}`}>
			          <label>Confirm Password</label>
			          <input type="password" className="form-control" placeholder="Enter password should be same as above" {...confirmPassword}/>
								<div className="text-help">
	            		{confirmPassword.touched ? confirmPassword.error : ''}
	          		</div>
			        </div>
						</div>

						<div className={`row`}>
							<div className={`form-group col-xs-12 col-md-12 ${role.touched && role.invalid ? 'has-danger' : ''}`}>
			          <label>Role of the user</label><br/>
								<label className="radio-inline"><input type="radio" {...role} value="Lender"/>Lender</label>
								<label className="radio-inline"><input type="radio" {...role} value="Financial Sponsor"/>Financial Sponsor</label>
								<label className="radio-inline"><input type="radio" {...role} value="Company"/>Company</label>
								<label className="radio-inline"><input type="radio" {...role} value="Legal Counsel"/>Legal Counsel</label>
								<label className="radio-inline"><input type="radio" {...role} value="3rd Part Due Diligence"/>3rd Part Due Diligence</label>
								<label className="radio-inline"><input type="radio" {...role} value="Other"/>Other</label>
								<div className="text-help">
	            		{role.touched ? role.error : ''}
	          		</div>
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

  if(!values.companyName){
    errors.companyName='Enter a company name';
  }

  if(!values.ein){
    errors.ein='Enter company EIN';
  }

  if(!values.role){
    errors.role='Enter company role';
  }

  if(!values.email || !validator.isEmail(values.email)){
    errors.email='Enter a valid email';
  }

  if(!values.phoneNumber){
    errors.phoneNumber='Enter phone#';
  }

  if(!values.streetAddress){
    errors.streetAddress='Enter Street Address';
  }

  if(!values.city){
    errors.city='Enter a city';
  }

  if(!values.state){
    errors.state='Enter State';
  }

  if(!values.zipcode){
    errors.zipcode='Enter zipcode';
  }

  if(!values.fullName){
    errors.fullName='Enter full name of the user';
  }

  if(!values.password){
    errors.password='Enter password';
  }

	if(!values.confirmPassword){
    errors.confirmPassword='Enter confirm password';
  }

	if(values.password !== values.confirmPassword){
		errors.password = 'password and confirm password should be same';
		errors.confirmPassword = 'password and confirm password should be same';
	}

  return errors;
}

export default reduxForm({
  'form': 'RegisterCompanyForm',
  'fields': ['companyName', 'ein', 'role', 'streetAddress', 'city', 'state', 'zipcode', 'fullName', 'email', 'password', 'confirmPassword', 'phoneNumber'],
	validate
}, null, {registerCompanyAction})(RegisterCompanyForm);
