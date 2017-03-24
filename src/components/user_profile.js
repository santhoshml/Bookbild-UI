import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import { updateProfileAction, fetchAddressAction, fetchContactAction} from '../actions/index';
import {Link} from 'react-router';
import validator from 'validator';
import { bindActionCreators } from 'redux';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';

class UserProfileForm extends Component{

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
  }

  onSubmit(props){
		console.log('In onSubmit:'+JSON.stringify(props));
	}


  render(){
    console.log('I am in user profile');
    const {addressJSON, contactJSON} = this.props;
    const {fields:{companyName, ein, role
			, streetAddress, city, state, zipcode
			, fullName, email, password, confirmPassword, phoneNumber
			}, handleSubmit} = this.props;

    return(
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
      <h3>User Details</h3>

      <div className={`form-group ${fullName.touched && fullName.invalid ? 'has-danger' : ''}`}>
        <label>Full Name</label>
        <input type="text" className="form-control" placeholder="Enter full name of the user" {...fullName} value={contactJSON === null ? '' : contactJSON[0].fullName}/>
        <div className="text-help">
          {fullName.touched ? fullName.error : ''}
        </div>
      </div>

      <div className={`form-group ${email.touched && email.invalid ? 'has-danger' : ''}`}>
        <label>Email</label>
        <input type="email" className="form-control" placeholder="Enter a valid email" {...email} value={this.state.userJSON.email}/>
        <div className="text-help">
          {email.touched ? email.error : ''}
        </div>
      </div>

      <div className={`form-group ${phoneNumber.touched && phoneNumber.invalid ? 'has-danger' : ''}`}>
        <label>Phone Number</label>
        <input type="text" className="form-control" placeholder="Enter a valid phone number" {...phoneNumber} value={contactJSON === null ? '' : contactJSON[0].phoneNumber}/>
        <div className="text-help">
          {phoneNumber.touched ? phoneNumber.error : ''}
        </div>
      </div>

      <div className={`form-group ${role.touched && role.invalid ? 'has-danger' : ''}`}>
        <label>Role of the user</label><br/>
        <label className="radio-inline"><input type="radio" {...role} checked={this.state.userJSON.role === 'lender'}/>Lender</label>
        <label className="radio-inline"><input type="radio" {...role} checked={this.state.userJSON.role === 'financial_sponsor'}/>Financial Sponsor</label>
        <label className="radio-inline"><input type="radio" {...role} checked={this.state.userJSON.role === 'company'}/>Company</label>
        <label className="radio-inline"><input type="radio" {...role} checked={this.state.userJSON.role === 'legal_counsel'}/>Legal Counsel</label>
        <label className="radio-inline"><input type="radio" {...role} checked={this.state.userJSON.role === '3pdd'}/>3rd Part Due Diligence</label>
        <label className="radio-inline"><input type="radio" {...role} checked={this.state.userJSON.role === 'other'}/>Other</label>
        <div className="text-help">
          {role.touched ? role.error : ''}
        </div>
      </div>

      <hr/>
      <h3>Company Details</h3>

      <div className={`form-group ${companyName.touched && companyName.invalid ? 'has-danger' : ''}`}>
        <label> Company Name </label>
        <input type="text" className="form-control" placeholder="Enter a valid Company Name" {...companyName} value={this.state.companyJSON.company_name}/>
        <div className="text-help">
          {companyName.touched ? companyName.error : ''}
        </div>
      </div>

      <div className={`form-group ${ein.touched && ein.invalid ? 'has-danger' : ''}`}>
        <label>EIN of the Company</label>
        <input type="text" className="form-control" placeholder="Enter a valid Company EIN" {...ein} value={this.state.companyJSON.ein}/>
        <div className="text-help">
          {ein.touched ? ein.error : ''}
        </div>
      </div>

      <hr/>
      <h3>Address Details</h3>

      <div className={`form-group ${streetAddress.touched && streetAddress.invalid ? 'has-danger' : ''}`}>
        <label> Street Address </label>
        <input type="text" className="form-control" placeholder="Enter a valid Street Address of the Company" {...streetAddress} value={addressJSON === null ? '' : addressJSON[0].streetAddress}/>
        <div className="text-help">
          {streetAddress.touched ? streetAddress.error : ''}
        </div>
      </div>

      <div className={`form-group ${city.touched && city.invalid ? 'has-danger' : ''}`}>
        <label>City</label>
        <input type="text" className="form-control" placeholder="Enter the City of the Company" {...city}  value={addressJSON === null ? '' : addressJSON[0].city}/>
        <div className="text-help">
          {city.touched ? city.error : ''}
        </div>
      </div>

      <div className={`form-group ${state.touched && state.invalid ? 'has-danger' : ''}`}>
        <label>State</label>
        <input type="text" className="form-control" placeholder="Enter the State of the Company" {...state}  value={addressJSON === null ? '' : addressJSON[0].state}/>
        <div className="text-help">
          {state.touched ? state.error : ''}
        </div>
      </div>

      <div className={`form-group ${zipcode.touched && zipcode.invalid ? 'has-danger' : ''}`}>
        <label>Zipcode</label>
        <input type="text" className="form-control" placeholder="Enter a valid zipcode of the Company" {...zipcode} value={addressJSON === null ? '' : addressJSON[0].zipcode}/>
        <div className="text-help">
          {zipcode.touched ? zipcode.error : ''}
        </div>
      </div>

      <Link to="/" className="btn btn-primary">Home</Link>&nbsp;&nbsp;
      <button type="submit" className="btn btn-primary">Submit</button>&nbsp;&nbsp;
      <button type="submit" className="btn btn-primary">Add a User</button>

      </form>
    );
  }
}

function mapStateToProps(state) {
  // console.log('In mapStateToProps:'+JSON.stringify(state));
  return {
    addressJSON: state.userProfile.addressJSON,
    contactJSON: state.userProfile.contactJSON
  };
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    updateProfileAction   : updateProfileAction,
    fetchAddressAction    : fetchAddressAction,
    fetchContactAction    : fetchContactAction
  }, dispatch);
}

export default reduxForm({
  'form': 'UserProfileForm',
  'fields': ['companyName', 'ein', 'role', 'streetAddress', 'city', 'state', 'zipcode', 'fullName', 'email', 'password', 'confirmPassword', 'phoneNumber']
}, mapStateToProps, mapDispatchToProps)(UserProfileForm);
