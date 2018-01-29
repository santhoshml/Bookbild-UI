import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { addUserAction
	, sendAMsgFromAdmin
	, sendAMsgFromAdminWithCompanyId
	, fetchAddressAction } from '../actions/index';
import { Link } from "react-router-dom";
import validator from 'validator';
import { bindActionCreators } from 'redux';
import Header from './header';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import NavBar from './sidebar';
import * as actionCreators from '../actions/index';
import { connect } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';

const stateOptions = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI'
,'MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI'
,'SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

const isAdminOptions = ['Yes', 'No'];

class AddUserForm extends Component{

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
		const disabled = field.disabled;
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
					{...field.input}
					disabled = {disabled}
				/>
				<div className="text-help">
					{touched ? error : ""}
				</div>
			</span>
		);
	}

	renderPasswordField(field) {
		const { meta: { touched, error } } = field;
		const { size } = field;
		const className = `form-group ${size} ${touched && error ? "has-danger" : ""}`;
		// console.log('field:'+JSON.stringify(field));
		return (
			<span className={className}>
				<label>{field.label}</label>
				<input
					className="form-control"
					placeholder={field.placeholder}
					type="password"
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

	onSubmit(props){
		let that = this;

		props.addedByUserId = this.state.user.userId;
		props.companyId = this.state.user.companyId;
		props.role = this.state.user.role;
		// console.log('props : '+JSON.stringify(props));
		this.props.addUserAction(props)
		 .then((data) => {
			 if(data.payload.status === 200 && data.payload.data.status === 'SUCCESS'){ // on add user
				// console.log('data :'+JSON.stringify(data));
					// send msgs to all in the company
					let mProps={
						companyId : that.state.user.companyId,
						msg : constants.MESSAGES.ADD_NEW_USER,
						NAME : props.fullName
					};
					that.props.sendAMsgFromAdminWithCompanyId(mProps);

					// send a welcome message to the user
					let uProps={
						toId : data.payload.data.data.contactId,
						msg : constants.MESSAGES.WELCOME
					};
					that.props.sendAMsgFromAdmin(uProps);					
					that.props.history.push({
						pathname : constants.ROUTES_MAP.RFP_MARKETPLACE,
						state : constants.NOTIFICATIONS.ADD_USER_SUCCESS
					});
			 } else {

					that.props.history.push(constants.ROUTES_MAP.ADD_USER);
					toast(constants.NOTIFICATIONS.ADD_USER_FAILED, {
						className : "notification-error"
					});
					// that.setState({errMsg : data.payload.data.data.errMsg});
			 }
		 });
	}

	displayErrMsg(){
		if(this.state.errMsg){
			return(
				<div className="alert alert-warning">
					Error : {this.state.errMsg}
				</div>
			);
		}
	}

	componentWillMount(){
		if(this.props.location.state){
			toast(this.props.location.state, {
				className : "notification-success"
			});
		}
		var user = lsUtils.getValue(constants.KEY_USER_OBJECT);
		var company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
		
		this.props.fetchAddressAction(user.addressId);
		this.setState({
			errMsg : null,
			user : user,
			company : company
    });
	}

	render(){
		const { handleSubmit } = this.props;

		return (
			<div>
				<ToastContainer />
				<Header/>
				<div style={{ display: 'flex' }}>
					<NavBar history={this.props.history}/>
					<div className="container main-container-left-padding" >
							<form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
								<h3>User Details</h3>
								<br/>
								<p>To add a new user from your company, enter the below details and Click submit.</p>
								<br/>
								<div className={`row`}>
									<Field
										name="fullName"
										label="Full Name"
										size="col-xs-8 col-md-8"
										component={this.renderField}
										placeholder="Enter users full name"
									/>
									<Field
										label="Admin Privileges"
										name="isAdmin"
										size="col-xs-3 col-md-3"
										component={this.renderDropdownField}
										dpField={isAdminOptions}
									/>									
								</div>
								<div className={`row`}>
									<Field
										name="email"
										label="Email"
										type="email"
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
								<button type="submit" className="btn btn-primary">Submit</button>&nbsp;&nbsp;
								<Link to="/rfpMarketPlace" className="btn btn-danger">Cancel</Link>
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

	if(!values.isAdmin){
    errors.isAdmin='Select an option if the user should have admin privileges';
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

function mapStateToProps(state){
	if(state.userProfile.address){
		let address = state.userProfile.address[0];
		// console.log('address :'+JSON.stringify(address));
		let initData = {
			streetAddress : address.streetAddress,
			city : address.city,
			state : address.state,
			zipcode : address.zipcode
		};
		return {
			initialValues : initData
		}
	} else {
		return {}
	}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
		addUserAction   : addUserAction,
		fetchAddressAction : fetchAddressAction,
		sendAMsgFromAdmin : sendAMsgFromAdmin,
		sendAMsgFromAdminWithCompanyId : sendAMsgFromAdminWithCompanyId
  }, dispatch);
}

AddUserForm = reduxForm({
	form : 'AddUserForm',
	enableReinitialize  : true,
  validate
}) (AddUserForm)

AddUserForm = connect(mapStateToProps, mapDispatchToProps)(AddUserForm)

export default AddUserForm