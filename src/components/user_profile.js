import React, {Component} from 'react';
import {Field, reduxForm, initialize} from 'redux-form';
import { updateUserProfileAction
  , fetchAddressAction
  , fetchContactAction
  , fetchUserListAction
  , updateAddressAction
  , updateUserAction
  , updateContactAction
  , sendAMsgFromAdmin } from '../actions/index';
import {Link} from 'react-router-dom';
import validator from 'validator';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import lsUtils from '../utils/ls_utils';
import cUtils from '../utils/common_utils';
import constants from '../utils/constants';
import NavBar from './sidebar';
import Header from './header';

// const { DOM: { input, select, textarea } } = React

const stateOptions = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI'
	,'MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI'
	,'SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

const roleOptions = ['Lender', 'Financial Sponsor', 'Company', 'Legal Counsel', '3rd Part Due Diligence', 'Other'];


class UserProfileForm extends Component{
  constructor(props){
    super(props);
    this.state = {
      user : null,
      company : null
    };
    // console.log('state:'+JSON.stringify(this.state));
  };

  componentDidMount() {
		// console.log('I am in componentWillMount');
		var that = this;
    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);

    this.setState({
      user : user,
      company : company
    });

		Promise.all([this.props.fetchAddressAction(user.addressId)
			, this.props.fetchContactAction(user.contactId)
      , this.props.fetchUserListAction(user.companyId)])
  }

  renderField(field){
		// console.log('ctx:'+JSON.stringify(ctx));
		// console.log('field: '+JSON.stringify(field));
    const { meta: { touched, error } } = field;
    const disabled = field.disabled;
		const { size } = field;
		const className = `form-group ${size} ${touched && error ? "has-danger" : ""}`;
		// console.log('field:'+JSON.stringify(field));
		return (
			<div className={className}>
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
			</div>
		);
	}

  renderDropdownField(field) {
		// console.log('field:'+JSON.stringify(field));
    const { meta: { touched, error } } = field;
    const { size } = field;
    const disabled = field.disabled;
    const className = `form-group ${size} ${touched && error ? "has-danger" : ""}`;

    return (
      <span className={className}>
        <label>{field.label}</label>
        <select className="form-control" {...field.input} disabled={disabled} >
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
    // console.log('In onSubmit, props :'+ JSON.stringify(props));
    let that = this;
    let promiseArr=[];

    // check if the userobject has changed 
    if(this.props.initialValues.password !== props.password){
      // console.log('user object has changed, update it');
      let uProps = {
        email : props.email,
        password : props.password,
        role : props.role,
        userId : this.state.user.userId,
        contactId : this.state.user.contactId
      }
      promiseArr.push(this.props.updateUserAction(uProps));
    }

    // check if the contactObject has changed
    if(this.props.initialValues.fullName !== props.fullName
      || this.props.initialValues.phoneNumber !== props.phoneNumber){
      // console.log('user object has changed, update it');
      let uProps = {
        email : props.email,
        contactId : this.state.user.contactId,
        fullName : props.fullName,
        phoneNumber : props.phoneNumber,
        contactRole : this.props.initialValues.contactRole,
        firm : this.props.initialValues.firm
      }
      promiseArr.push(this.props.updateContactAction(uProps));
    }

    // check if the addressObject has changed
    if(this.props.initialValues.city !== props.city
      || this.props.initialValues.state !== props.state
      || this.props.initialValues.streetAddress !== props.streetAddress
      || this.props.initialValues.zipcode !== props.zipcode){
      // console.log('user object has changed, update it');
      let uProps = {
        contactId : this.state.user.contactId,
        addressId : this.state.user.addressId,
        city : props.city,
        state : props.state,
        streetAddress : props.streetAddress,
        zipcode : props.zipcode
      }
      promiseArr.push(this.props.updateAddressAction(uProps));
    }

    if(promiseArr.length > 0){
      Promise.all(promiseArr)
      .then(() => {
        let mProps = {
          toId : that.state.user.contactId,
          msg : constants.MESSAGES.PROFILE_UPDATED
        };
        this.props.sendAMsgFromAdmin(mProps);
       	this.props.history.push(constants.ROUTES_MAP.RFP_MARKETPLACE);
				// this.props.history.push(constants.ROUTES_MAP.MY_PROFILE); // FOR LOCAL_TESTING
      });
    }
	}

  render = () => {
    // console.log('I am in render');
		console.log('props:'+JSON.stringify(this.props));
    const {address, contact} = this.props;
    const { handleSubmit, pristine, reset, submitting } = this.props
		// console.log('yoyo:'+JSON.stringify(this.props.initialValues));

    return(
      <div>
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
              <h3>User Details</h3>

              <div className={`row`}>
              <Field
                name="fullName"
                label="Full Name"
                size="col-xs-6 col-md-6"
                component={this.renderField}
                placeholder="Enter users full name"
              />
              <Field
                label="Role of the user"
                name="role"
                size="col-xs-6 col-md-6"
                component={this.renderDropdownField}
                dpField={roleOptions}
                disabled
              />
            </div>
            <div className={`row`}>
              <Field
                name="email"
                type="email"
                label="Email"
                size="col-xs-6 col-md-6"
                component={this.renderField}
                placeholder="Enter a valid email"
                disabled
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
                type="password"
                size="col-xs-6 col-md-6"
                component={this.renderField}
                placeholder="Enter password"
              />
              <Field
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                size="col-xs-6 col-md-6"
                component={this.renderField}
                placeholder="Enter password should be same as above"
              />
            </div>
            <hr className={`col-xs-12 col-md-12`}/>
            <br/>
            <h3>Company Details</h3>
            <div className={`row`}>
              <Field
                name="companyName"
                label="Company Name"
                size="col-xs-8 col-md-8"
                component={this.renderField}
                placeholder="Enter a valid Company Name"
                disabled
              />
              <Field
                name="ein"
                label="EIN of the Company"
                size="col-xs-4 col-md-4"
                disabled="true"
                component={this.renderField}
                placeholder="Enter a valid Company EIN"
              />
            </div>
            <hr className={`col-xs-12 col-md-12`}/>
            <br/>
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
            {this.props.initialValues 
              && this.props.initialValues.userList 
              && this.props.initialValues.userList.length>0 
              && this.props.initialValues.isAdmin.toLowerCase() == 'yes' ? this.displayUserList() : ''}


            <br/>
            <button type="submit" className="btn btn-primary">Submit</button>&nbsp;&nbsp;
            <Link to={constants.ROUTES_MAP.RFP_MARKETPLACE} className="btn btn-danger">Cancel</Link>&nbsp;&nbsp;

            </form>
          </div>
        </div>
      </div>
    );
  }

  displayUserList(){
    // console.log('In displayUserList :'+ JSON.stringify(userListJSON));
		// console.log('I am in displayUserList');
    return(
      <div className={`row`}>
        <br/>
        <hr className={`col-xs-12 col-md-12`}/>
        <h3>List of Users</h3>
        <table className="table table-hover table-bordered table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Is Admin</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {this.displayUserListRows()}
          </tbody>
        </table>
      </div>
    );
  }

  displayUserListRows(){
    return this.props.initialValues.userList.map((user, index)=>{
      return(
        <tr key={user.contactId}>
          <td> {index+1}</td>
          <td> {user.email} </td>
          <td> {user.isAdmin} </td>
          <td> {user.role} </td>
        </tr>
      );
    });
  }
}

function mapStateToProps(state) {
  var user = lsUtils.getValue(constants.KEY_USER_OBJECT);
  var company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);

  let initValues = {
      // // user info
      email : user.email,
      isAdmin : user.isAdmin,
      userAcceptedTermsConditions : user.userAcceptedTermsConditions,
      password : user.password,
      role : user.role,
      confirmPassword : user.password,
			
      // company info
      ein :company.ein,
      companyName : company.companyName,

      userId : user.userId,
      contactId : user.contactId,
      addressId : user.addressId,
      companyId : user.companyId
  };

  if(state.userProfile.address
    && state.userProfile.contact
    && state.userProfile.userList){
    // console.log('state.userProfile.address :'+ JSON.stringify(state.userProfile.address));
    let userAddress = state.userProfile.address[0];
    let contact = state.userProfile.contact[0];
    let userList = state.userProfile.userList

    //set the address values in initial object
    initValues.city = userAddress.city;
    initValues.streetAddress = userAddress.streetAddress;
    initValues.zipcode = userAddress.zipcode;
    initValues.state = userAddress.state;

    //set the contact values in inital object
    initValues.fullName = contact.fullName;
    initValues.phoneNumber = contact.phoneNumber;
    initValues.contactRole = contact.contactRole;
    
    initValues.userList = userList;

    // console.log('initValues : '+JSON.stringify(initValues));
    return {
      initialValues : initValues,
    };
  }

  return {};
}

function validate(values){
  const errors={};

  if(!values.fullName){
    errors.fullName='Enter full name of the user';
  }

  if(!values.phoneNumber){
    errors.phoneNumber='Enter phone#';
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

  return errors;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateUserProfileAction   : updateUserProfileAction,
    fetchAddressAction        : fetchAddressAction,
    fetchContactAction        : fetchContactAction,
    fetchUserListAction       : fetchUserListAction,
    updateUserAction          : updateUserAction,
    updateContactAction       : updateContactAction,
    updateAddressAction       : updateAddressAction,
    sendAMsgFromAdmin         : sendAMsgFromAdmin
  }, dispatch);
}

UserProfileForm = reduxForm({
  form                : 'UserProfileForm',
  enableReinitialize  : true,
  validate
}) (UserProfileForm)

UserProfileForm = connect(mapStateToProps, mapDispatchToProps)(UserProfileForm);

export default UserProfileForm;