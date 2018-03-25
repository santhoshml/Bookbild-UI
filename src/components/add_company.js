import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { addLostDealAction, getAllCompanyListAction } from '../actions/index';
import { Link } from "react-router-dom";
import validator from 'validator';
import NavBar from './sidebar';
import * as actionCreators from '../actions/index';
import constants from '../utils/constants';
import lsUtils from '../utils/ls_utils';
import cUtils from '../utils/common_utils';
import Header from './header';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { ToastContainer, toast } from 'react-toastify';
import Datetime from "react-datetime";
import Autosuggest from 'react-bootstrap-autosuggest';

const stateOptions = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District Of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan'
	,'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island'
	,'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
const sectorOptions = ['IT', 'Financials', 'Health Care', 'Energy', 'Consumer Staples', 'Consumer Disc', 'Industrials', 'Materials', 'Utilities', 'Telecoms'];

class AddCompanyForm extends Component{

	constructor(props){
		super(props);
		this.handleToChange = this.handleToChange.bind(this);
	}

	componentWillMount() {
		this.props.getAllCompanyListAction();
    let user    = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    this.setState({
      user : user,
			company : company,
			disableCompanyEntry : false,
      selectedCompany : null
    });
  }

	handleToChange(value) {

    this.setState({
			selectedCompany : value,
			disableCompanyEntry : true
    });
  }

	onSubmit(props){
		let that = this;
		props.addedByUserId = this.state.user.userId;
		props.addedByUserContactId = this.state.user.contactId;
		props.addedByUserCompanyId = this.state.user.companyId;
		props.selectedCompanyId = this.state.selectedCompany ? (cUtils.getCompanyId(this.props.companyList, this.state.selectedCompany)).companyId : null;		
		this.props.addLostDealAction(props)
		 .then((data) => {
			if(data.payload.status === 200 && data.payload.data.status === 'SUCCESS'){
				that.props.history.push({
					pathname : constants.ROUTES_MAP.RFP_MARKETPLACE,
					state : constants.NOTIFICATIONS.ADD_COMPANY_SUCCESS
				});
			} else {
				that.props.history.push({
					pathname : constants.ROUTES_MAP.RFP_MARKETPLACE,
					state : constants.NOTIFICATIONS.ADD_COMPANY_FAILED
				});
			}
		 });
	}

	renderDatePicker(field){
    const { meta: { touched, error } } = field;
    const { size } = field;
    const className = `form-group ${size} ${touched && error ? "has-danger" : ""}`;

    return (
      <div className={className}>
        <label>{field.label}</label>
        <Datetime {...field.input}
					closeOnSelect={true}
					closeOnTab={true}
					timeFormat={false}				
				/>
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
	}
	
	renderDropdownField(field) {
    const { meta: { touched, error } } = field;
		const { size } = field;
		const disabled = field.disabled;
    const className = `form-group ${size} ${touched && error ? "has-danger" : ""}`;
    return (
      <span className={className}>
        <label>{field.label}</label>
        <select className="form-control" {...field.input} disabled={disabled}>
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

	renderTextArea(field) {
    const { meta: { touched, error } } = field;
		const { size } = field;
		const disabled = field.disabled;
    const className = `form-group ${size} ${touched && error ? "has-danger" : ""}`;

    return (
      <div className={className}>
        <label>{field.label}</label>
				<textarea 
					type="text" 
					className="form-control" 
					placeholder={field.placeholder} 
					{...field.input} 
					disabled = {disabled}
				/>
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

	renderRadioField(field) {
		const { meta: { touched, error } } = field;
		const className = `form-group ${touched && error ? "has-danger" : ""}`;
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
		const {handleSubmit} = this.props;

		return (
				<div>
					<ToastContainer />
					<Header/>
					<div style={{ display: 'flex' }}>
						<NavBar history={this.props.history}/>			
						<div className="container main-container-left-padding" >
							<form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
								<br/>
								<br/>
								<br/>
								<h4>Provide information below to automate prospect tracking (notifications), and to generate custom transaction data analytics. </h4>
								<br/>
								<h3>Select company</h3>
								<br/>
								<Autosuggest
									datalist = {this.props.condensedCompanyList}
									placeholder="Start typing the company name..."
									onChange = {this.handleToChange}
									value = {this.state.selectedCompany}
								/>
								<br/>
								<h3>OR</h3>
								<br/>
								<h4>Add a Company - Company Details</h4>
								<div className={`row`}>
									<Field
										name="companyName"
										label="Company Name"
										size="col-xs-4 col-md-4"
										component={this.renderField}
										disabled={this.state.disableCompanyEntry}
										placeholder="Enter a valid Company Name"
									/>

									<Field
										name="sector"
										label="Sector of the Company"
										size="col-xs-4 col-md-4"
										component={this.renderDropdownField}
										disabled={this.state.disableCompanyEntry}
										dpField={sectorOptions}
									/>

									<Field
										name="financialSponsors"
										label="Financial Sponsor(s)"
										size="col-xs-4 col-md-4"
										component={this.renderField}
										disabled={this.state.disableCompanyEntry}
										placeholder="Enter name of the financial sponsor"
									/>									
								</div>
								<div className={`row`}>
                <Field
                  label="Company Description"
                  name="companyDesc"
                  size="col-xs-12 col-md-12"
									component={this.renderTextArea}
									disabled={this.state.disableCompanyEntry}
                  placeholder={constants.COMPANY_DESC_SAMPLE}
                />
              </div>								
							<div className={`row`}>
									<Field
										name="fullName"
										label="Contact Full Name"
										size="col-xs-4 col-md-4"
										component={this.renderField}
										placeholder="Enter users full name"
									/>
									<Field
										name="role"
										label="Contact Role"
										size="col-xs-4 col-md-4"
										component={this.renderField}
										placeholder="Enter the role in the company"
									/>
									<Field
										name="email"
										label="Contact Email"
										type = "email"
										size="col-xs-4 col-md-4"
										component={this.renderField}
										placeholder="Enter a valid email"
									/>
								</div>
								<br/>
								<hr className={`col-xs-12 col-md-12`}/>
								<h3>Company Financials</h3>

								<div className={`row`}>
									<Field
										name="ltmEbitda"
										label="LTM EBITDA ($)"
										size="col-xs-4 col-md-4"
										component={this.renderField}
										placeholder="LTM EBITDA"
									/>
									<Field
										name="ltmRevenue"
										label="LTM Revenue ($)"
										size="col-xs-4 col-md-4"
										component={this.renderField}
										placeholder="LTM Revenue"
									/>
									<Field
										label="LTM Date"
										name="ltmDate"
										size="col-xs-4 col-md-4"
										component={this.renderDatePicker}
									/>
								</div>
								<br/>
								<button type="submit" className="btn btn-primary">Submit</button>
								<Link to={constants.ROUTES_MAP.RFP_MARKETPLACE} className="btn btn-danger">Cancel</Link>
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

  if(!values.companyName){
    errors.companyName='Enter a company name';
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

function mapStateToProps(state) {
  let rObject =  {};
  
  if(state.company.companyList){
		rObject.companyList = state.company.companyList;
		rObject.condensedCompanyList = cUtils.condensedCompanyList(state.company.companyList);
	}

  return rObject;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getAllCompanyListAction 	: getAllCompanyListAction,
    addLostDealAction  				: addLostDealAction
  }, dispatch);
}

export default reduxForm({
  'form': 'AddCompanyForm',
}) (connect(mapStateToProps, mapDispatchToProps)(AddCompanyForm));
