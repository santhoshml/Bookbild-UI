import React, {Component} from 'react';
import {Field, reduxForm, initialize} from 'redux-form';
import { sendInviteCompanyEmailAction
  ,  fetchContactAction } from '../actions/index';
import {Link} from 'react-router-dom';
import validator from 'validator';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import lsUtils from '../utils/ls_utils';
import cUtils from '../utils/common_utils';
import constants from '../utils/constants';
import NavBar from './sidebar';
import Header from './header';
import { ToastContainer, toast } from 'react-toastify';

class InviteCompanyForm extends Component{
  constructor(props){
    super(props);
    this.state = {
      message : null,
      user : null,
      company : null
    };
  };

  componentWillMount(){
    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    if(user){
      this.props.fetchContactAction(user.contactId);

      this.setState({
        user : user,
        company : company
      });
    }
  }

  renderField(field){
    const { meta: { touched, error } } = field;
    const disabled = field.disabled;
		const { size } = field;
		const className = `form-group ${size} ${touched && error ? "has-danger" : ""}`;
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

  renderTextArea(field) {
    const { meta: { touched, error } } = field;
    const { size } = field;
    const className = `form-group ${size} ${touched && error ? "has-danger" : ""}`;

    return (
      <div className={className}>
        <label>{field.label}</label>
        <textarea type="text" className="form-control" rows="10" placeholder={field.placeholder} {...field.input} />
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

  
  onSubmit(props){
    if(this.state.user){
      props.userEmail = this.state.user.email;
    }
    
		this.props.sendInviteCompanyEmailAction(props)
		 .then((data) => {
			 if(data.payload.status === 200 && data.payload.data.status === 'SUCCESS'){
         this.props.reset();
         toast(constants.NOTIFICATIONS.INVITE_COMPANY_SUCCESS, {
            className : "notification-success"
          });         
         this.setState({
           'message' : 'Your message sent. Thank you for doing this for us.'
         });
			 } else {
        toast(constants.NOTIFICATIONS.INVITE_COMPANY_FAILED, {
					className : "notification-error"
				});
			 }
		 });
  }
  
  displayError(){
    if(this.state.message !== null){
      return(
        <div className="alert alert-danger">
          <h5 className="align-center">{this.state.message}</h5>
        </div>
      );
    }
  }


  render = () => {
    const { handleSubmit, pristine, reset, submitting } = this.props

    return(
      <div>
        <ToastContainer />
        <Header/>
        <div style={{ display: 'flex' }}>
          {this.state.user ? <NavBar history={this.props.history}/> : ''}
          <div className="container main-container-left-padding" >
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
            <h3 className="align-center">Invite a friend/company to Bookbild platform</h3>
              <br/>
              {this.displayError()}
              <br/>
              <div className={`row`}>
                <Field
                  name="email"
                  type="email"
                  label="To"
                  size="col-xs-12 col-md-12"
                  component={this.renderField}
                  placeholder="Enter emails address. use comma to separate multiple"
                />
              </div>
              <div className={`row`}>
              <Field
                name="subject"
                label="Subject"
                size="col-xs-12 col-md-12"
                component={this.renderField}
              />
            </div>
            <div className={`row`}>
              <Field
                label="Message"
                name="message"
                size="col-xs-12 col-md-12"
                component={this.renderTextArea}
                placeholder="Message to your friends/collegues ...."
              />
            </div>
            <br/>
            <button type="submit" className="btn btn-primary">Submit</button>&nbsp;&nbsp;
            </form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let initValues = {
      // // user info
      subject : 'Invitation To Join Bookbild',
      message : 'Hi there, \n\nGoing forward, we will be using Bookbild for select transactions. We invite you to engage with us on this platform. '
        +' \n\nBookbild contact: sales@bookbild.com.'
        + ' \n\nBest regards,'

  };

  let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
  let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
  if(user){
    // user is logged in , so we can sign with user name and company name
    if(state.userProfile.contact){
      let contact = state.userProfile.contact[0];
      initValues.message = initValues.message + '\n'+contact.fullName
      initValues.message = initValues.message + '\n'+company.companyName

      return {
        initialValues : initValues,
      };
    } else {
      return {};
    }
  } else {
    return {
      initialValues : initValues,
    };
  }
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
    sendInviteCompanyEmailAction   : sendInviteCompanyEmailAction,
    fetchContactAction             : fetchContactAction
  }, dispatch);
}

InviteCompanyForm = reduxForm({
  form                : 'InviteCompanyForm',
  enableReinitialize  : true,
  validate
}) (InviteCompanyForm)

InviteCompanyForm = connect(mapStateToProps, mapDispatchToProps)(InviteCompanyForm);

export default InviteCompanyForm;