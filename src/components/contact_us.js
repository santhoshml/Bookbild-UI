import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { sendContactUsEmailAction, getLinksWithCompanyIdAction } from '../actions/index';
import { Link } from "react-router-dom";
import validator from 'validator';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import Header from './header';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import * as actionCreators from '../actions/index';
import { ToastContainer, toast } from 'react-toastify';

class ContactUsForm extends Component{

  componentWillMount(){
    this.setState({
      message : null
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
		this.props.sendContactUsEmailAction(values)
		 .then((data) => {
			 if(data.payload.status === 200 && data.payload.data.status === 'SUCCESS'){
         this.props.reset();
         toast(constants.NOTIFICATIONS.CONTACTUS_SUCCESS, {
					className : "notification-success"
				});
			 } else {
				toast(constants.NOTIFICATIONS.CONTACTUS_FAILED, {
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

	render(){
    const {handleSubmit, errors, pristine, reset, submitting} = this.props;    

		return (
      <div>
        <ToastContainer />
        <Header/>
        <div className="container main-container-left-padding" >
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
              <h3 className="align-center">Contact Us</h3>
              <br/>
              {this.displayError()}
              <br/>
              <div className={`row`}>
                <Field
                  name="fullName"
                  label="Full Name"
                  size="col-xs-6 col-md-6"
                  component={this.renderField}
                  placeholder="Name to address you"
                />
                <Field
                  name="email"
                  label="Email"
                  type="email"
                  size="col-xs-6 col-md-6"
                  component={this.renderField}
                  placeholder="Enter a valid email"
                />
              </div>
              
              <div className={`row`}>
                <Field
                  name="phoneNumber"
                  label="Phone Number"
                  size="col-xs-6 col-md-6"
                  type="text"
                  component={this.renderField}
                  placeholder="Phone number to reach you"
                />
                <Field
                name="companyName"
                label="Company Name"
                size="col-xs-6 col-md-6"
                type="text"
                component={this.renderField}
                placeholder="Company Name to assosiate with"
              />
              </div>
              
              <div className={`row`}>
                <Field
                  label="Message"
                  name="message"
                  size="col-xs-12 col-md-12"
                  component={this.renderTextArea}
                  placeholder="Message for Bookbild from the user ...."
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
  return {
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    sendContactUsEmailAction   : sendContactUsEmailAction,
    getLinksWithCompanyIdAction : getLinksWithCompanyIdAction
  }, dispatch);
}

export default reduxForm({
  validate,
  'form': 'ContactUsForm'
}) (connect(null, {sendContactUsEmailAction})(ContactUsForm));