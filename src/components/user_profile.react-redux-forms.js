import React, {Component} from 'react';
import {Field, reduxForm, initialize} from 'redux-form';
import { updateUserProfileAction, fetchAddressAction, fetchContactAction, fetchUserListAction} from '../actions/index';
import {Link} from 'react-router-dom';
import validator from 'validator';
import { connect } from "react-redux";
import { bindActionCreators, combineReducers } from 'redux';
import lsUtils from '../utils/ls_utils';
import cUtils from '../utils/common_utils';
import constants from '../utils/constants';
import NavBar from './sidebar';
import Header from './header';
import { createStore, applyMiddleware } from 'redux';
import { combineForms, createForms } from 'react-redux-form';
import { Form, Control, Errors } from 'react-redux-form';
import { isRequired, isEmpty } from 'validator';



// const { DOM: { input, select, textarea } } = React

const data = {
  email : '',
  isAdmin : '',
  userAcceptedTermsConditions : '',
  password : '',
  role : '',
  password : '',
  confirmPassword :  ''
};

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
  };

	setTheValuesReceivedFromBackend(results){
		let address = results[0].payload.data.data[0];
		let contact = results[1].payload.data.data[0];
		let userList = results[2].payload.data.data[0];
		let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
	  let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);

		// this.props.initialValues = {};

	  // user info
		if(user){
			this.props.initialValues.email = user.email;
			this.props.initialValues.isAdmin = user.isAdmin;
			this.props.initialValues.userAcceptedTermsConditions = user.userAcceptedTermsConditions;
			this.props.initialValues.password = user.password;
			this.props.initialValues.role = user.role;
			this.props.initialValues.password = user.password;
			this.props.initialValues.confirmPassword = user.password;

			this.props.initialValues.userId = user.userId;
			this.props.initialValues.contactId = user.contactId;
			this.props.initialValues.addressId = user.addressId;
			this.props.initialValues.companyId = user.companyId;
		}

	  // company info
		if(company){
			this.props.initialValues.ein = company.ein;
			this.props.initialValues.companyName = company.companyName;
		}

		if(contact){
			this.props.initialValues.fullName = contact.fullName;
			this.props.initialValues.phoneNumber = contact.phoneNumber;
			this.props.initialValues.contactRole = contact.contactRole;
		}

		if(address){
			this.props.initialValues.city = address.city;
			this.props.initialValues.zipcode = address.zipcode;
			this.props.initialValues.state = address.state;
			this.props.initialValues.streetAddress = address.streetAddress;
		}

		if(userList){
			this.setState({
				userList : userList
			});
		}

		this.props.initialize(this.props.initialValues);
	}

	componentDidMount() {
		var that = this;
    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);

    this.setState({
      user : user,
      company : company
    });

		if(this.props.initialValues){
			this.props.initialize(this.props.initialValues);
		}

		Promise.all([this.props.fetchAddressAction(user.addressId)
			, this.props.fetchContactAction(user.contactId)
			, this.props.fetchUserListAction(user.companyId)])
		.then(results => {
			that.setTheValuesReceivedFromBackend(results);
		})
	}


  onSubmit(props){
    this.props.updateUserProfileAction(props)
     .then(() => {
       // blog post has been created, navigate the user to the index
       // We navigate by calling this.context.router.push with the
       // new path to navigate to.
       	this.props.history.push(constants.ROUTES_MAP.RFP_MARKETPLACE);
				// this.props.history.push(constants.ROUTES_MAP.MY_PROFILE); // FOR LOCAL_TESTING
     });
  }
  
  render = () => {
    const {address, contact} = this.props;
    const { dispatch } = this.props

    return(
      <div>
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >
            <Form model="user" onSubmit={this.onSubmit.bind(this)}>
              <h3>User Details</h3>

              <div className={`row`}>
                <div className={`form-group col-xs-6 col-md-6`}>
                  <label>Full Name:</label>
                  <Control.text
                    model=".fullname"
                    validators={{
                      isRequired
                    }}
                  />
                  <Errors
                    className="errors"
                    model="user.fullname"
                    show="touched"
                    messages={{
                      isRequired: 'This is a required field'
                    }}
                  />
                </div>

                <div className={`form-group col-xs-6 col-md-6`}>
                  <label>Role of the user</label>
                  <Control.text
                    model=".role"
                    validators={{
                      isRequired
                    }}
                  />
                  <Errors
                    className="errors"
                    model="user.role"
                    show="touched"
                    messages={{
                      isRequired: 'This is a required field'
                    }}
                  />
                </div>

              </div>


              <br/>
              <button type="submit" className="btn btn-primary">Submit</button>&nbsp;&nbsp;
              <Link to={constants.ROUTES_MAP.RFP_MARKETPLACE} className="btn btn-danger">Cancel</Link>&nbsp;&nbsp;

            </Form>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
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

  displayUserList(){
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
    return this.state.userList.map((user, index)=>{
      return(
        <tr key={user.contactId}>
          <td> {index+1}</td>
          <td> {user.email} </td>
          <td> {user.isAdmin+''} </td>
          <td> {user.role} </td>
        </tr>
      );
    });
  }
}


function mapStateToProps(state) {
  var user = lsUtils.getValue(constants.KEY_USER_OBJECT);
  var company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
	return {
    initialValues : {
      // // user info
      // email : user.email,
      // isAdmin : user.isAdmin,
      // userAcceptedTermsConditions : user.userAcceptedTermsConditions,
      // password : user.password,
      // role : user.role,
      // password : user.password,
      // confirmPassword : user.password,
			//
      // // company info
      // ein :company.ein,
      // companyName : company.companyName,
			//
      // userId : user.userId,
      // contactId : user.contactId,
      // addressId : user.addressId,
      // companyId : user.companyId
    }
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
  return combineReducers({
    updateUserProfileAction   : updateUserProfileAction,
    fetchAddressAction    : fetchAddressAction,
    fetchContactAction    : fetchContactAction,
    fetchUserListAction : fetchUserListAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileForm);
