import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import { updateUserProfileAction, fetchAddressAction, fetchContactAction, fetchUserListAction} from '../actions/index';
import {Link} from 'react-router';
import validator from 'validator';
import { bindActionCreators } from 'redux';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';

class UserProfileForm extends Component{
  static contextTypes ={
	    router : PropTypes.object
	};

  constructor(props){
    super(props);
    this.state = {
      userJSON : lsUtils.getValue(constants.KEY_USER_OBJECT),
      companyJSON : lsUtils.getValue(constants.KEY_COMPANY_OBJECT)
    };
    // console.log('state:'+JSON.stringify(this.state));
  }

  componentWillMount() {
    // console.log('state:'+JSON.stringify(this.state));
    this.props.fetchAddressAction(this.state.userJSON.address_id);
    this.props.fetchContactAction(this.state.userJSON.contact_id);
    this.props.fetchUserListAction(this.state.userJSON.company_id);
  }

  onSubmit(props){
		console.log('In onSubmit:'+JSON.stringify(props));
    this.props.updateUserProfileAction(props)
     .then(() => {
       // blog post has been created, navigate the user to the index
       // We navigate by calling this.context.router.push with the
       // new path to navigate to.
       this.context.router.push('/');
     });

	}

  render(){
    console.log('I am in user profile');
    const {addressJSON, contactJSON} = this.props;
    const {fields:{companyName, ein, role
			, streetAddress, city, state, zipcode
			, fullName, email, password, confirmPassword, phoneNumber
      , user_id, contact_id, address_id, company_id
			}, handleSubmit} = this.props;

    return(
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
      <h3>User Details</h3>

      <div className={`form-group ${fullName.touched && fullName.invalid ? 'has-danger' : ''}`}>
        <label>Full Name</label>
        <input type="text" className="form-control" placeholder="Enter full name of the user" {...fullName} />
        <div className="text-help">
          {fullName.touched ? fullName.error : ''}
        </div>
      </div>

      <div className={`form-group ${email.touched && email.invalid ? 'has-danger' : ''}`}>
        <label>Email</label>
        <input type="email" className="form-control" placeholder="Enter a valid email" {...email} />
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

      <div className={`form-group ${confirmPassword.touched && confirmPassword.invalid ? 'has-danger' : ''}`}>
        <label>Confirm Password</label>
        <input type="password" className="form-control" placeholder="Enter password should be same as above" {...confirmPassword}/>
        <div className="text-help">
          {confirmPassword.touched ? confirmPassword.error : ''}
        </div>
      </div>

      <div className={`form-group ${phoneNumber.touched && phoneNumber.invalid ? 'has-danger' : ''}`}>
        <label>Phone Number</label>
        <input type="text" className="form-control" placeholder="Enter a valid phone number" {...phoneNumber}/>
        <div className="text-help">
          {phoneNumber.touched ? phoneNumber.error : ''}
        </div>
      </div>

      <div className={`form-group ${role.touched && role.invalid ? 'has-danger' : ''}`}>
        <label>Role of the user</label><br/>
        <label className="radio-inline"><input type="radio" {...role} value='lender' />Lender</label>
        <label className="radio-inline"><input type="radio" {...role} value='financial_sponsor' />Financial Sponsor</label>
        <label className="radio-inline"><input type="radio" {...role} value='company' />Company</label>
        <label className="radio-inline"><input type="radio" {...role} value='legal_counsel'/>Legal Counsel</label>
        <label className="radio-inline"><input type="radio" {...role} value='3pdd'/>3rd Part Due Diligence</label>
        <label className="radio-inline"><input type="radio" {...role} value='other'/>Other</label>
        <div className="text-help">
          {role.touched ? role.error : ''}
        </div>
      </div>

      <br/>
      <hr/>
      <h3>Company Details</h3>

      <div className={`form-group ${companyName.touched && companyName.invalid ? 'has-danger' : ''}`}>
        <label> Company Name </label>
        <input type="text" className="form-control" placeholder="Enter a valid Company Name" {...companyName} />
        <div className="text-help">
          {companyName.touched ? companyName.error : ''}
        </div>
      </div>

      <div className={`form-group ${ein.touched && ein.invalid ? 'has-danger' : ''}`}>
        <label>EIN of the Company</label>
        <input type="text" className="form-control" placeholder="Enter a valid Company EIN" {...ein} />
        <div className="text-help">
          {ein.touched ? ein.error : ''}
        </div>
      </div>

      <br/>
      <hr/>
      <h3>Address Details</h3>

      <div className={`form-group ${streetAddress.touched && streetAddress.invalid ? 'has-danger' : ''}`}>
        <label> Street Address </label>
        <input type="text" className="form-control" placeholder="Enter a valid Street Address of the Company" {...streetAddress} />
        <div className="text-help">
          {streetAddress.touched ? streetAddress.error : ''}
        </div>
      </div>

      <div className={`form-group ${city.touched && city.invalid ? 'has-danger' : ''}`}>
        <label>City</label>
        <input type="text" className="form-control" placeholder="Enter the City of the Company" {...city} />
        <div className="text-help">
          {city.touched ? city.error : ''}
        </div>
      </div>

      <div className={`form-group ${state.touched && state.invalid ? 'has-danger' : ''}`}>
        <label>State</label>
        <input type="text" className="form-control" placeholder="Enter the State of the Company" {...state} />
        <div className="text-help">
          {state.touched ? state.error : ''}
        </div>
      </div>

      <div className={`form-group ${zipcode.touched && zipcode.invalid ? 'has-danger' : ''}`}>
        <label>Zipcode</label>
        <input type="text" className="form-control" placeholder="Enter a valid zipcode of the Company" {...zipcode} />
        <div className="text-help">
          {zipcode.touched ? zipcode.error : ''}
        </div>
      </div>

      <br/>
      <hr/>
      <h3>List of Users Added</h3>
      {this.props.userListJSON && this.props.userListJSON.length>0 ? this.displayUserList() : ''}


      <br/>
      <Link to="/rfpMarketPlace" className="btn btn-primary">Home</Link>&nbsp;&nbsp;
      <button type="submit" className="btn btn-primary">Submit</button>&nbsp;&nbsp;
      <Link to="/addUser" className="btn btn-primary">Add a User</Link>

      </form>
    );
  }

  displayUserList(){
    // console.log('In displayUserList :'+ JSON.stringify(userListJSON));
    return(
      <div>
        <table className="table table-hover table-bordered table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Is Admin</th>
              <th>Role</th>
            </tr>
          </thead>
          {this.displayUserListRows()}
        </table>
      </div>
    );
  }

  displayUserListRows(){
    return this.props.userListJSON.map((user, index)=>{
      return(
        <tr key={user.contact_id}>
          <td> {index+1}</td>
          <td> {user.email} </td>
          <td> {user.is_admin} </td>
          <td> {user.role} </td>
        </tr>
      );
    });
  }
}


function mapStateToProps(state) {
  // console.log('In mapStateToProps:'+JSON.stringify(state));
  var userJSON = lsUtils.getValue(constants.KEY_USER_OBJECT);
  var companyJSON = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
  var addressJSON = state.userProfile.addressJSON;
  var contactJSON = state.userProfile.contactJSON;
  var userListJSON = state.userProfile.userListJSON;
  console.log('userListJSON in mapStateToProps:'+JSON.stringify(userListJSON));

  return {
    initialValues : {
      // user info
      email : userJSON.email,
      is_admin : userJSON.is_admin,
      user_accepted_terms_conditions : userJSON.user_accepted_terms_conditions,
      password : userJSON.password,
      role : userJSON.role,
      password : userJSON.password,
      confirmPassword : userJSON.password,

      // company info
      ein :companyJSON.ein,
      companyName : companyJSON.company_name,

      // userJSON : lsUtils.getValue(constants.KEY_USER_OBJECT),
      city : addressJSON===null ? '' :addressJSON[0].city,
      zipcode : addressJSON===null ? '' :addressJSON[0].zipcode,
      streetAddress : addressJSON===null ? '' :addressJSON[0].streetAddress,
      state : addressJSON===null ? '' :addressJSON[0].state,

      // contact info
      phoneNumber: contactJSON===null ? '' :contactJSON[0].phoneNumber,
      fullName: contactJSON===null ? '' :contactJSON[0].fullName,

      user_id : userJSON.user_id,
      contact_id : userJSON.contact_id,
      address_id : userJSON.address_id,
      company_id : userJSON.company_id
    },
    userListJSON : userListJSON
  };
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

	// console.log('errors:'+JSON.stringify(errors));
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
  'fields': ['companyName', 'ein', 'role', 'streetAddress', 'city', 'state', 'zipcode', 'fullName', 'email', 'password', 'confirmPassword', 'phoneNumber', 'user_id', 'contact_id', 'address_id', 'company_id'],
  validate
}, mapStateToProps, mapDispatchToProps)(UserProfileForm);
