import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { registerCompanyAction } from '../actions/index';
import { Link } from "react-router-dom";
import validator from 'validator';
import NavBar from './sidebar';
import * as actionCreators from '../actions/index';
import constants from '../utils/constants';
import Header from './header';

const stateOptions = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District Of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan'
	,'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island'
	,'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

class RegisterCompanyForm extends Component{

	onSubmit(props){
		this.props.registerCompanyAction(props)
		 .then(() => {
			 // blog post has been created, navigate the user to the index
			 // We navigate by calling this.context.router.push with the
			 // new path to navigate to.
			 this.props.history.push(constants.ROUTES_MAP.SUPER_ADMIN);
		 });
	}

	renderDropdownField(field) {
    const { meta: { touched, error } } = field;
    const { size } = field;
    const className = `form-group ${size} ${touched && error ? "has-danger" : ""}`;

    return (
      <span className={className}>
        <label>{field.label}</label>
        <select className="form-control" {...field.input}>
          <option value="">Select one</option>
          {field.dpField.map(fOption =>
            <option value={fOption} key={fOption}>
              {fOption}
            </option>
          )}
        </select>
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </span>
    );
  }

	renderField(field) {
		const { meta: { touched, error } } = field;
		const { size } = field;
		const className = `form-group ${size} ${touched && error ? "has-danger" : ""}`;
		// console.log('className:'+JSON.stringify(className));
		// console.log('field:'+JSON.stringify(field));
		return (
			<span className={className}>
				<label>{field.label}</label>
				<input
					className="form-control"
					placeholder={field.placeholder}
					type={field.type}
					{...field.input} />
				<div className="text-help">
					{touched ? error : ""}
				</div>
			</span>
		);
	}

	renderRadioField(field) {
		const { meta: { touched, error } } = field;
		const className = `form-group ${touched && error ? "has-danger" : ""}`;
		// console.log('field:'+JSON.stringify(field));
		return (
			<span>
				<label className="radio-inline">
					<input
						type="radio"
						{...field.input}
						/>
						{field.label}
				</label>
			</span>
		);
	}

	render(){
		const {handleSubmit} = this.props;

		return (
				<div>
					<Header/>
					<div style={{ display: 'flex' }}>
						<NavBar history={this.props.history}/>			
						<div className="container" >
							<form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
								<h3>Add a NEW Company </h3>
								<br/>
								<br/>
								<h3>Company Details</h3>

								<div className={`row`}>
									<Field
										name="companyName"
										label="Company Name"
										size="col-xs-8 col-md-8"
										component={this.renderField}
										placeholder="Enter a valid Company Name"
									/>

									<Field
										name="ein"
										label="EIN of the Company"
										size="col-xs-4 col-md-4"
										component={this.renderField}
										placeholder="Enter a valid Company EIN"
									/>
								</div>

								<br/>
								<hr className={`col-xs-12 col-md-12`}/>
								<h3>Address Details</h3>

								<div className={`row`}>
									<Field
										name="streetAddress"
										label="Street Address"
										size="col-xs-12 col-md-12"
										component={this.renderField}
										placeholder="Enter a valid Street Address of the Company"
									/>
								</div>

								<div className={`row`}>
									<Field
										name="city"
										label="City"
										size="col-xs-6 col-md-6"
										component={this.renderField}
										placeholder="Enter the City of the Company"
									/>
									<Field
										label="State"
										name="state"
										size="col-xs-3 col-md-3"
										component={this.renderDropdownField}
										dpField={stateOptions}
									/>
									<Field
										name="zipcode"
										label="Zipcode"
										size="col-xs-3 col-md-3"
										component={this.renderField}
										placeholder="Enter a valid zipcode of the Company"
									/>
								</div>

								<br/>
								<hr className={`col-xs-12 col-md-12`}/>
								<h3>Contact Details</h3>

								<div className={`row`}>
									<Field
										name="fullName"
										label="Full Name"
										size="col-xs-12 col-md-12"
										component={this.renderField}
										placeholder="Enter users full name"
									/>
								</div>

								<div className={`row`}>
									<Field
										name="email"
										label="Email"
										type = "email"
										size="col-xs-6 col-md-6"
										component={this.renderField}
										placeholder="Enter a valid email"
									/>
									<Field
										name="phoneNumber"
										label="Phone Number"
										size="col-xs-6 col-md-6"
										component={this.renderField}
										placeholder="Enter a valid phone number"
									/>
								</div>

								<div className={`row`}>
									<Field
										name="password"
										label="Password"
										size="col-xs-6 col-md-6"
										type="password"
										component={this.renderField}
										placeholder="Enter password"
									/>
									<Field
										name="confirmPassword"
										label="Confirm Password"
										size="col-xs-6 col-md-6"
										type="password"
										component={this.renderField}
										placeholder="Enter password should be same as above"
									/>
								</div>

								<div className={`row`}>
									<div className="form-group col-xs-12 col-md-12">
										<label>Role of the user</label><br/>
											<Field
												name="role"
												value="Lender"
												label="Lender"
												component={this.renderRadioField}
											/>
											<Field
												name="financialSponsor"
												label="Financial Sponsor"
												value="Financial Sponsor"
												component={this.renderRadioField}
											/>
											<Field
												name="company"
												label="Company"
												value="Company"
												component={this.renderRadioField}
											/>
											<Field
												name="legalCounsel"
												label="Legal Counsel"
												value="Legal Counsel"
												component={this.renderRadioField}
											/>
											<Field
												name="3pdd"
												label="3rd Part Due Diligence"
												value="3rd Part Due Diligence"
												component={this.renderRadioField}
											/>
											<Field
												name="other"
												label="Other"
												value="Other"
												component={this.renderRadioField}
											/>
									</div>
								</div>

								<button type="submit" className="btn btn-primary">Submit</button>
								<Link to={constants.ROUTES_MAP.SUPER_ADMIN} className="btn btn-danger">Cancel</Link>
							</form>
							<br/>
							<br/>
							<br/>
							<br/>
							<br/>
						</div>
					</div>
				</div>
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
	validate
}, null, {registerCompanyAction})(RegisterCompanyForm);
