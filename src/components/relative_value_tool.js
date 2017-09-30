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

class RelativeValueTool extends Component {

  componentWillMount() {
    console.log('I am in relative_value_tool componentWillMount');
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
          <option value="">Select one</option>
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
            options={constants.SECTOR_OPTIONS}
          />
          <Field
            label="Your Role in the deal"
            name="role"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Your role in the deal"
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
          <Field
            label="You are Borrower or Lender ? *"
            name="type"
            size="col-xs-3 col-md-3"
            component={this.renderDropdown}
            options={constants.CUSTOMER_TYPE_OPTIONS}
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
            options={constants.TXN_TYPE_OPTIONS}
          />
          <Field
            label="Transaction Link"
            name="txnLink"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="URL of the press release"
          />
        </div>
        <div className={`row`}>
          <Field
            name="revolverAmt"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Revolver Amount"
          />
          <Field
            name="revolverPricing"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Revolver Pricing"
          />
          <Field
            name="revolverTenor"
            size="col-xs-2 col-md-2"
            component={this.renderField}
            placeholder="Revolver Tenor"
          />
          <Field
            name="revolverLiborFloor"
            size="col-xs-2 col-md-2"
            component={this.renderField}
            placeholder="Revolver LIBOR Floor"
          />
          <Field
            name="isRevolverABL"
            size="col-xs-2 col-md-2"
            component={this.renderDropdown}
            options={constants.YES_NO_OPTIONS}
          />
        </div>
        <div className={`row`}>
          <Field
            name="firstLienAmt"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="1st Lien TL Amount"
          />
          <Field
            name="firstLienPricing"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="1st Lien TL Pricing"
          />
          <Field
            name="firstLienTenor"
            size="col-xs-2 col-md-2"
            component={this.renderField}
            placeholder="1st Lien TL Tenor"
          />
          <Field
            name="firstLienLiborFloor"
            size="col-xs-2 col-md-2"
            component={this.renderField}
            placeholder="1st Lien TL LIBOR Floor"
          />
          <Field
            name="isFirstLienLiborABL"
            size="col-xs-2 col-md-2"
            component={this.renderDropdown}
            options={constants.YES_NO_OPTIONS}
          />
        </div>
        <div className={`row`}>
          <Field
            name="secondLienAmt"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="2nd Lien TL Amount"
          />
          <Field
            name="secondLienPricing"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="2nd Lien TL Pricing"
          />
          <Field
            name="secondLienTenor"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="2nd Lien TL Tenor"
          />
        </div>
        <div className={`row`}>
          <Field
            name="subDebtAmt"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Sub Debt Amount"
          />
          <Field
            name="subDebtPricing"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Sub Debt Pricing"
          />
          <Field
            name="subDebtTenor"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Sub Debt Tenor"
          />
        </div>
        <div className={`row`}>
          <Field
            name="mezzanineAmt"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Mezzanine Amount"
          />
          <Field
            name="mezzaninePricing"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Mezzanine Pricing"
          />
          <Field
            name="mezzanineTenor"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Mezzanine Tenor"
          />
        </div>
      </div>
    );
  }

  onSubmit(values) {
    console.log('In onSubmit, props:'+JSON.stringify(values));
    this.props.reset();
    this.props.saveComparisionToolData(values)
      .then((data) => {
        console.log('I am in then, data:'+JSON.stringify(data));
        let rData = data.payload.data.data;
        if(rData){
          this.setState({
            countPercent : rData.countPercent,
            avgAmt  : rData.avgAmt,
            singleLenderPercent : rData.singleLenderPercent,
            companyName : values.companyName
          });
        }
      });
  }

  renderDealCompStats(){
    return(<div>
        <p>Your deal comparison results:</p>
        <br/>
        <p>1. Over the last 5 quarters, your sector accounted for {roundTo(this.state.countPercent,2)}% of transactions.</p>
        <br/>
        <p>2. Your deal size was {roundTo(this.state.avgAmt,2)}% {this.state.avgAmt > 0 ? 'higher' : 'lower'} than the average deal size.</p>
        <br/>
        <p>3. For your sector {roundTo(this.state.singleLenderPercent, 2)}% of transactions were single lender deals.</p>
        <br/>
        <p>If you'd like to see more detailed analysis, please contact <a href="mailto:sales@bookbild.com">sales@bookbild.com</a> and our team will process your subscription. We look forward to partnering with {this.state.companyName}!</p>
        <br/>
        <br/>
        <hr/>
      </div>);
  }

  render(){
    const { handleSubmit } = this.props;
    return(
      <div>
        {this.state.countPercent !== null ? this.renderDealCompStats() : ''}
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <h1 className="align-center">Deal Comparison Tool</h1>
          <br/>
          <p>Submit the below info about the most recent transaction to see data about your transaction</p>
          <br/>
          {this.renderPersonalInfo()}
          <hr/>
          {this.renderCompanyInfo()}
          <hr/>
          {this.renderTxnInfo()}
          <br/>
          <button type="submit" className="btn btn-primary">Submit</button>
          <Link to="/" className="btn btn-danger">Cancel</Link>
        </form>
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

  if (!values.lenders) {
    errors.lenders = 'Lenders cannot be empty';
  }

  if (!values.revenue) {
    errors.revenue = 'LTM Revenue cannot be empty';
  }

  if (!values.ebitda) {
    errors.ebitda = 'LTM EBITDA cannot be empty';
  }

  if (!values.type || values.type.toLowerCase() === 'select one') {
    errors.type = 'Select if you are Borrower or Lender';
  }

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
