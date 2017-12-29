import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { saveComparisionToolData } from '../actions/index';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import Datetime from "react-datetime";
import roundTo from "round-to";
import Header from './header';

class RelativeValueTool extends Component {

  componentWillMount() {
    // console.log('I am in relative_value_tool componentWillMount');
    this.setState({
      countPercent : null,
      avgAmt  : null,
      singleLenderPercent : null
    });
  }

  renderDatePicker(field){
    const { meta: { touched, error } } = field;
    const { size } = field;
    const className = `form-group ${size} ${touched && error ? "has-danger" : ""}`;

    return (
      <div className={className}>
        <label>{field.label}</label>
        <Datetime timeFormat={false} {...field.input}/>
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

  renderDropdown(field) {
    const { meta: { touched, error } } = field;
    const { size } = field;
    const className = `form-group ${size} ${touched && error ? "has-danger" : ""}`;
    return (
      <div className={className}>
        <label>{field.label}</label>
        <select className="form-control" {...field.input}>
          <option value="">{field.title}</option>
          {field.options.map(fOption =>
            <option value={fOption} key={fOption}>
              {fOption}
            </option>
          )}
        </select>
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
  }


  renderField(field) {
    // console.log('field:'+JSON.stringify(field));
    const { meta: { touched, error } } = field;
    const { size } = field;
    const className = `form-group ${size} ${touched && error ? "has-danger" : ""}`;

    return (
      <div className={className}>
        <label>{field.label}</label>
        <input type="text" className="form-control" placeholder={field.placeholder} {...field.input} />
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

  renderPersonalInfo(){
    return(
      <div>
        <div className={`row`}>
          <Field
            label="FirstName *"
            name="firstName"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Your first name"
          />
          <Field
            label="LastName *"
            name="lastName"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Your last name"
          />
          <Field
            label="Company Name *"
            name="companyName"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Your company name"
          />
          <Field
            label="Company Email *"
            name="email"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Company Email"
          />
        </div>
      </div>
    );
  }

  renderCompanyInfo(){
    return(
      <div>
        <div className={`row`}>
          <Field
            label="Issuer Name *"
            name="issuerName"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Company/Issuer Name"
          />
          <Field
            label="Issuer URL"
            name="companyURL"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="URL of the company/Issuer"
          />
          <Field
            label="Sector *"
            name="sector"
            size="col-xs-3 col-md-3"
            component={this.renderDropdown}
            title="Select one"
            options={constants.SECTOR_OPTIONS}
          />
          <Field
          label="Industry *"
          name="industry"
          size="col-xs-3 col-md-3"
          component={this.renderDropdown}
          title="Select one"
          options={constants.INDUSTRY_OPTIONS}
        />          
        </div>
        <div className={`row`}>
          <Field
            label="Lender(s) *"
            name="lenders"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="comma-separated Lender names"
          />
          <Field
          label="Transaction Sponsor"
          name="txnSponsor"
          size="col-xs-3 col-md-3"
          component={this.renderField}
          placeholder="PE firm name"
          />
          <Field
            label="LTM Revenue *"
            name="revenue"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="LTM Revenue in $"
          />
          <Field
            label="LTM EBITDA *"
            name="ebitda"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="LTM EBITDA in $"
          />
        </div>
      </div>
    );
  }

  renderTxnInfo(){
    return(
      <div>
        <div className={`row`}>
          <Field
            label="Transaction Date *"
            name="txnDt"
            size="col-xs-3 col-md-3"
            component={this.renderDatePicker}
          />
          <Field
            label="Transaction Type *"
            name="txnType"
            size="col-xs-3 col-md-3"
            component={this.renderDropdown}
            title="Select one"
            options={constants.TXN_TYPE_OPTIONS}
          />
          <Field
            label="Transaction Link"
            name="txnLink"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="URL of the press release"
          />
          <Field
          label="Your Role in the deal"
          name="role"
          size="col-xs-3 col-md-3"
          component={this.renderField}
          placeholder="eg: Sole Lender, Admin Agent, Club, etc"
        />        
        </div>
        <div className={`row`}>
          <Field
            name="revolverAmt"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Revolver Amount ($10,000,000)"
          />
          <Field
            name="revolverPricing"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Revolver Pricing (L+2.30%)"
          />
          <Field
            name="revolverTenor"
            size="col-xs-2 col-md-2"
            component={this.renderField}
            placeholder="Revolver Tenor (5)"
          />
          <Field
            name="revolverLiborFloor"
            size="col-xs-2 col-md-2"
            component={this.renderField}
            placeholder="Revolver LIBOR Floor (2.3%)"
          />
          <Field
            name="isRevolverABL"
            size="col-xs-2 col-md-2"
            component={this.renderDropdown}
            title="ABL ?"
            options={constants.YES_NO_OPTIONS}
          />
        </div>
        <div className={`row`}>
          <Field
            name="firstLienAmt"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="1st Lien TL Amount ($10,000,000)"
          />
          <Field
            name="firstLienPricing"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="1st Lien TL Pricing (L+2.30%)"
          />
          <Field
            name="firstLienTenor"
            size="col-xs-2 col-md-2"
            component={this.renderField}
            placeholder="1st Lien TL Tenor (5)"
          />
          <Field
            name="firstLienLiborFloor"
            size="col-xs-2 col-md-2"
            component={this.renderField}
            placeholder="1st Lien TL LIBOR Floor (2.3%)"
          />
          <Field
            name="isFirstLienLiborABL"
            size="col-xs-2 col-md-2"
            component={this.renderDropdown}
            title="ABL ?"
            options={constants.YES_NO_OPTIONS}
          />
        </div>
        <div className={`row`}>
          <Field
            name="secondLienAmt"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="2nd Lien TL Amount ($10,000,000)"
          />
          <Field
            name="secondLienPricing"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="2nd Lien TL Pricing (2.3%)"
          />
          <Field
            name="secondLienTenor"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="2nd Lien TL Tenor (5)"
          />
        </div>
        <div className={`row`}>
          <Field
            name="subDebtAmt"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Sub Debt Amount ($10,000,000)"
          />
          <Field
            name="subDebtPricing"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Sub Debt Pricing (2.3%)"
          />
          <Field
            name="subDebtTenor"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Sub Debt Tenor (5)"
          />
        </div>
        <div className={`row`}>
          <Field
            name="mezzanineAmt"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Mezzanine Amount ($10,000,000)"
          />
          <Field
            name="mezzaninePricing"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Mezzanine Pricing (2.3%)"
          />
          <Field
            name="mezzanineTenor"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Mezzanine Tenor (5)"
          />
        </div>
      </div>
    );
  }

  onSubmit(values) {
    // console.log('In onSubmit, props:'+JSON.stringify(values));
    this.props.reset();
    this.props.saveComparisionToolData(values)
      .then((data) => {
        // console.log('I am in then, data:'+JSON.stringify(data));
        let rData = data.payload.data.data;
        if(rData){
          this.setState({
            countPercent : rData.countPercent,
            percentileVal  : rData.percentileVal,
            singleLenderPercent : rData.singleLenderPercent,
            companyName : values.companyName
          });
        }
      });
  }

  renderDealCompStats(){
    return(<div>
        <p>Preliminary comparative results:</p>
        <br/>
        <p>1. Over the last 5 quarters, your sector accounted for {roundTo(this.state.countPercent,2)}% of transactions.</p>
        <br/>
        <p>2. Your deal size was in the {roundTo(Math.abs(this.state.percentileVal),2)}th percentile of all transaction sizes.</p>
        <br/>            
        <p>2. For your sector, {roundTo(this.state.singleLenderPercent, 2)}% of transactions were single lender deals.</p>
        <br/>
        <p>If you'd like to see more detailed analysis (e.g. comparative results for LTM financials, loan structures, etc), please contact <a href="mailto:sales@bookbild.com">sales@bookbild.com</a> and our team will process your subscription. We look forward to partnering with you!</p>
        <br/>
        <br/>
        <hr/>
      </div>);
  }

  render(){
    const { handleSubmit } = this.props;
    return(
      <div>
        <Header/>
        <div className="container main-container-left-padding" >
          {this.state.countPercent !== null ? this.renderDealCompStats() : ''}
          <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
            <h1 className="align-center">Deal Comparison Tool</h1>
            <br/>
            <p>Use our proprietary database of private debt transactions for comparative deal analytics.To compare your debt transaction to other closed transactions, please enter your details below (all data is kept private, and aggregated anonymously).</p>
            <br/>
            {this.renderPersonalInfo()}
            <hr/>
            {this.renderCompanyInfo()}
            <hr/>
            {this.renderTxnInfo()}
            <br/>
            <button type="submit" className="btn btn-primary">Submit</button>
            <Link to="/" className="btn btn-danger">Cancel</Link>
            <br/>
            <br/>
            <br/>
            <br/>
          </form>
        </div>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    saveComparisionToolData : saveComparisionToolData
  }, dispatch);
}

function validate(values){
  const errors = {};

  if (!values.firstName) {
    errors.firstName = 'First Name cannot be empty';
  }

  if (!values.lastName) {
    errors.lastName = 'Last Name cannot be empty';
  }

  if (!values.companyName) {
    errors.companyName = 'Company Name cannot be empty';
  }

  if (!values.email || values.email.indexOf('gmail') > 0 || values.email.indexOf('yahoo') > 0
    || values.email.indexOf('aol') > 0 || values.email.indexOf('hotmail') > 0) {
    errors.email = 'Company Email cannot be empty & no personal emails please';
  }

  if (!values.issuerName) {
    errors.issuerName = 'IssuerName cannot be empty';
  }

  if (!values.sector || values.sector.toLowerCase() === 'select one') {
    errors.sector = 'Sector cannot be empty';
  }

  if (!values.industry || values.industry.toLowerCase() === 'select one') {
    errors.industry = 'Industry cannot be empty';
  }

  if (!values.lenders) {
    errors.lenders = 'Lenders cannot be empty';
  }

  if (!values.revenue) {
    errors.revenue = 'LTM Revenue cannot be empty';
  }

  if (!values.ebitda) {
    errors.ebitda = 'LTM EBITDA cannot be empty';
  }

  // if (!values.type || values.type.toLowerCase() === 'select one') {
  //   errors.type = 'Select if you are Borrower or Lender';
  // }

  if (!values.txnDt) {
    errors.txnDt = 'Transaction Date cannot be empty';
  }

  if (!values.txnType || values.txnType.toLowerCase() === 'select one') {
    errors.txnType = 'Select Transaction Type';
  }

  if ((!values.revolverAmt || !values.revolverPricing || !values.revolverTenor || !values.revolverLiborFloor)
    && (!values.firstLienAmt || !values.firstLienPricing || !values.firstLienTenor || !values.firstLienLiborFloor)
    && (!values.secondLienAmt || !values.secondLienPricing || !values.secondLienTenor)
    && (!values.subDebtAmt || !values.subDebtPricing || !values.subDebtTenor)
    && (!values.mezzanineAmt || !values.mezzaninePricing || !values.mezzanineTenor)) {
    errors.revolverAmt = 'Enter values for atleast one Transaction type';
    errors.firstLienAmt = 'Enter values for atleast one Transaction type';
    errors.secondLienAmt = 'Enter values for atleast one Transaction type';
    errors.subDebtAmt = 'Enter values for atleast one Transaction type';
    errors.mezzanineAmt = 'Enter values for atleast one Transaction type';
  }

  return errors;
}

export default reduxForm({
  validate,
  form: 'RVToolForm',
  enableReinitialize: true
}) (connect(mapStateToProps, mapDispatchToProps)(RelativeValueTool));
