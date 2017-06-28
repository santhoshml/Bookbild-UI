import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import { updateUserProfileAction, fetchAddressAction, fetchContactAction, fetchUserListAction} from '../actions/index';
import {Link} from 'react-router';
import validator from 'validator';
import { bindActionCreators } from 'redux';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import Header from './header';

class UserProfileForm extends Component{
  static contextTypes ={
	    router : PropTypes.object
	};

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
       this.context.router.push(constants.ROUTES_MAP.RFP_MARKETPLACE);
     });

	}

  render(){
    console.log('I am in user profile');
    const {address, contact} = this.props;
    const {fields:{companyName, ein, role
			, streetAddress, city, state, zipcode
			, fullName, email, password, confirmPassword, phoneNumber
      , userId, contactId, addressId, companyId
			}, handleSubmit} = this.props;

    return(
      <div>
        <Header />
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <h3>User Details</h3>

          <div className={`row`}>
            <div className={`form-group col-xs-12 col-md-12 ${fullName.touched && fullName.invalid ? 'has-danger' : ''}`}>
              <label>Full Name</label>
              <input type="text" className="form-control" placeholder="Enter full name of the user" {...fullName} />
              <div className="text-help">
                {fullName.touched ? fullName.error : ''}
              </div>
            </div>
          </div>

          <div className={`row`}>
            <div className={`form-group col-xs-6 col-md-6 ${email.touched && email.invalid ? 'has-danger' : ''}`}>
              <label>Email</label>
              <input type="email" className="form-control" placeholder="Enter a valid email" {...email} />
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
              <label className="radio-inline"><input type="radio" {...role} value='Lender' />Lender</label>
              <label className="radio-inline"><input type="radio" {...role} value='Financial Sponsor' />Financial Sponsor</label>
              <label className="radio-inline"><input type="radio" {...role} value='Company' />Company</label>
              <label className="radio-inline"><input type="radio" {...role} value='Legal Counsel'/>Legal Counsel</label>
              <label className="radio-inline"><input type="radio" {...role} value='3rd Part Due Diligence'/>3rd Part Due Diligence</label>
              <label className="radio-inline"><input type="radio" {...role} value='Other'/>Other</label>
              <div className="text-help">
                {role.touched ? role.error : ''}
              </div>
            </div>
          </div>

          <hr className={`col-xs-12 col-md-12`}/>
          <br/>
          <h3>Company Details</h3>

          <div className={`row`}>
            <div className={`form-group col-xs-8 col-md-8 ${companyName.touched && companyName.invalid ? 'has-danger' : ''}`}>
              <label> Company Name </label>
              <input type="text" className="form-control" placeholder="Enter a valid Company Name" {...companyName} />
              <div className="text-help">
                {companyName.touched ? companyName.error : ''}
              </div>
            </div>

            <div className={`form-group col-xs-4 col-md-4 ${ein.touched && ein.invalid ? 'has-danger' : ''}`}>
              <label>EIN of the Company</label>
              <input type="text" className="form-control" placeholder="Enter a valid Company EIN" {...ein} />
              <div className="text-help">
                {ein.touched ? ein.error : ''}
              </div>
            </div>
          </div>
          <hr className={`col-xs-12 col-md-12`}/>
          <br/>
          <h3>Address Details</h3>

          <div className={`row`}>
            <div className={`form-group col-xs-12 col-md-12 ${streetAddress.touched && streetAddress.invalid ? 'has-danger' : ''}`}>
              <label> Street Address </label>
              <input type="text" className="form-control" placeholder="Enter a valid Street Address of the Company" {...streetAddress} />
              <div className="text-help">
                {streetAddress.touched ? streetAddress.error : ''}
              </div>
            </div>
          </div>

          <div className={`row`}>
            <div className={`form-group col-xs-6 col-md-6 ${city.touched && city.invalid ? 'has-danger' : ''}`}>
              <label>City</label>
              <input type="text" className="form-control" placeholder="Enter the City of the Company" {...city} />
              <div className="text-help">
                {city.touched ? city.error : ''}
              </div>
            </div>

            <div className={`form-group col-xs-3 col-md-3 ${state.touched && state.invalid ? 'has-danger' : ''}`}>
              <label>State</label>
              <input type="text" className="form-control" placeholder="Enter the State of the Company" {...state} />
              <div className="text-help">
                {state.touched ? state.error : ''}
              </div>
            </div>

            <div className={`form-group col-xs-3 col-md-3 ${zipcode.touched && zipcode.invalid ? 'has-danger' : ''}`}>
              <label>Zipcode</label>
              <input type="text" className="form-control" placeholder="Enter a valid zipcode of the Company" {...zipcode} />
              <div className="text-help">
                {zipcode.touched ? zipcode.error : ''}
              </div>
            </div>
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

  return {
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
    },
    userList : userList
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
  'fields': ['companyName', 'ein', 'role', 'streetAddress', 'city', 'state', 'zipcode', 'fullName', 'email', 'password', 'confirmPassword', 'phoneNumber', 'userId', 'contactId', 'addressId', 'companyId'],
  validate
}, mapStateToProps, mapDispatchToProps)(UserProfileForm);
