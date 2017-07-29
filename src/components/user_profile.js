import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { updateUserProfileAction, fetchAddressAction, fetchContactAction, fetchUserListAction} from '../actions/index';
import {Link} from 'react-router-dom';
import validator from 'validator';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import Header from './header';

const stateOptions = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District Of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan'
	,'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island'
	,'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
const roleOptions = ['Lender', 'Financial Sponsor', 'Company', 'Legal Counsel', '3rd Part Due Diligence', 'Other'];

class UserProfileForm extends Component{
  constructor(props){
    super(props);
    this.state = {
      user : null,
      company : null
    };
    // console.log('state:'+JSON.stringify(this.state));
  }

  componentWillMount() {
    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);

    this.setState({
      user : user,
      company : company
    });

    this.props.fetchAddressAction(user.addressId);
    this.props.fetchContactAction(user.contactId);
    this.props.fetchUserListAction(user.companyId);
  }

  onSubmit(props){
		console.log('In onSubmit:'+JSON.stringify(props));
    this.props.updateUserProfileAction(props)
     .then(() => {
       // blog post has been created, navigate the user to the index
       // We navigate by calling this.context.router.push with the
       // new path to navigate to.
       this.props.history.push(constants.ROUTES_MAP.RFP_MARKETPLACE);
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
		console.log('field:'+JSON.stringify(field));
		return (
			<div className={className}>
				<label>{field.label}</label>
				<input
					className="form-control"
					placeholder={field.placeholder}
					type={field.type}
					{...field.input}
				/>
				<div className="text-help">
					{touched ? error : ""}
				</div>
			</div>
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
    console.log('I am in user profile');
		console.log('props:'+JSON.stringify(this.props));
    const {address, contact} = this.props;
    const { handleSubmit, load, pristine, reset, submitting } = this.props
		console.log('yoyo:'+this.props.initialValues.fullName);

    return(
      <div>
        <Header />
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <h3>User Details</h3>

          <div className={`row`}>
            <Field
							id="fullName"
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
              name="phoneNumber"
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
            />
            <Field
              name="ein"
              label="Company Name"
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
          {console.log('this.state.isAdmin:'+this.state.isAdmin)}
          {this.props.userList && this.props.userList.length>0 && this.state.user.isAdmin? this.displayUserList() : ''}


          <br/>
          <button type="submit" className="btn btn-primary">Submit</button>&nbsp;&nbsp;
          <Link to={constants.ROUTES_MAP.RFP_MARKETPLACE} className="btn btn-danger">Cancel</Link>&nbsp;&nbsp;

        </form>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
      </div>
    );
  }

  displayUserList(){
    // console.log('In displayUserList :'+ JSON.stringify(userListJSON));
    return(
      <div className={`row`}>
        <br/>
        <hr className={`col-xs-12 col-md-12`}/>
        <h3>List of Users Added</h3>
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
    return this.props.userList.map((user, index)=>{
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
  var address = state.userProfile.address;
  var contact = state.userProfile.contact;
  var userList = state.userProfile.userList;

	var retObject = {
    initialValues : {
      // user info
      email : user.email,
      isAdmin : user.isAdmin,
      userAcceptedTermsConditions : user.userAcceptedTermsConditions,
      password : user.password,
      role : user.role,
      password : user.password,
      confirmPassword : user.password,

      // company info
      ein :company.ein,
      companyName : company.companyName,

      city : address===null ? '' :address[0].city,
      zipcode : address===null ? '' :address[0].zipcode,
      streetAddress : address===null ? '' :address[0].streetAddress,
      state : address===null ? '' :address[0].state,

      // contact info
      phoneNumber: contact===null ? '' :contact[0].phoneNumber,
      fullName: contact===null ? '' :contact[0].fullName,

      userId : user.userId,
      contactId : user.contactId,
      addressId : user.addressId,
      companyId : user.companyId
    }
    // userList : userList
  };

	console.log('In mapStateToProps:'+JSON.stringify(retObject));
	return retObject;
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

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    updateUserProfileAction   : updateUserProfileAction,
    fetchAddressAction    : fetchAddressAction,
    fetchContactAction    : fetchContactAction,
    fetchUserListAction : fetchUserListAction
  }, dispatch);
}

export default reduxForm({
  'form': 'UserProfileForm',
	enableReinitialize: true,
	initialized	: true,
  validate
}) (connect(mapStateToProps, mapDispatchToProps)(UserProfileForm));
