import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { sendInviteCompanyEmailAction } from '../actions/index';
import { Link } from "react-router-dom";
import validator from 'validator';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import Header from './header';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import * as actionCreators from '../actions/index';

class InviteCompanyForm extends Component{

  componentWillMount(){
    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    this.setState({
      message : null,
      user : user
    });
  }

	renderField(field) {
		const { meta: { touched, error } } = field;
		const { size } = field;
    const className = `form-group ${size} ${touched && error ? "has-danger" : ""}`;
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

	onSubmit(values){
    if(this.state.user){
      values.userEmail = this.state.user.email;
    }
    
		this.props.sendInviteCompanyEmailAction(values)
		 .then((data) => {
			 if(data.payload.status === 200 && data.payload.data.status === 'SUCCESS'){
         this.props.reset();
         this.setState({
           'message' : 'Your message sent. Thank you for doing this for us.'
         });
			 } else {
        this.setState({
          message : 'Error sending the email. Please try again.'
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

	render(){
    const {handleSubmit, pristine, reset, submitting} = this.props;    
		return (
      <div>
        <Header/>
        <div className="container main-container-left-padding" >
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
              <h3 className="align-center">Invite a friend/company to Bookbild platform</h3>
              <br/>
              {this.displayError()}
              <br/>
              <div className={`row`}>
                <Field
                  name="email"
                  label="To:"
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
                  placeholder = "<subject of your email>"
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
              <div className="text-center">             
                <button type="submit" className="btn btn-primary">Submit</button>&nbsp;&nbsp;
              </div>
            </form>
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

  if(!values.email || !validator.isEmail(values.email)){
    errors.email='Enter a valid email';
  }

  if(!values.fullName){
    errors.fullName='Enter full name of the user';
  }
  return errors;
}

function mapStateToProps(state) {
  let initValues = {
    subject : 'yyo',
    message : 'this is a test message' 
  }
  return {
    initalValues : initValues
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    sendInviteCompanyEmailAction   : sendInviteCompanyEmailAction
  }, dispatch);
}

InviteCompanyForm = reduxForm({
  form                : 'InviteCompanyForm',
  enableReinitialize  : true,
  validate
})(InviteCompanyForm);

InviteCompanyForm = connect(mapStateToProps, mapDispatchToProps)(InviteCompanyForm);

export default InviteCompanyForm;