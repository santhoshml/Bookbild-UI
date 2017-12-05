
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { createRFPAction, fetchContactAction, updateRFPAction, fetchAllCompanyListForRFP } from '../actions/index';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import Datetime from "react-datetime";
import numeral from "numeral";
import NavBar from './sidebar';
import Header from './header';

var gType=null;
const categoryOptions = ['Open', 'ABL', 'Cash Flow'];
const productOptions = ['Revolver', 'Term Loan', 'Mezzanine', 'Multi-Tranche', 'Uni-Tranche'];
const sectorOptions = ['IT', 'Financials', 'Health Care', 'Energy', 'Consumer Staples', 'Consumer Disc', 'Industrials', 'Materials', 'Utilities', 'Telecoms'];
const regionOptions=['West Coast', 'Mid Atlantic', 'Great Lakes', 'South', 'Mountain', 'Southeast', 'New England', 'Midwest'];
const sponsoredOptions=['yes', 'no'];
const requestTypeOptions=['New Financing', 'Refinancing', 'Restructuring', 'M&A', 'LBO', 'Market Check'];
class CreateRFP extends Component {

  componentWillMount() {
    var that = this;
    // console.log('I am in createRFP componentWillMount');
    gType = this.props.match.params.type;
    let user= lsUtils.getValue(constants.KEY_USER_OBJECT);
    this.setState({
      type : this.props.match.params.type,
      renderCollateral :false,
      user : user
    });

    
    if(user.isSuperAdmin && user.isSuperAdmin === true){
      this.props.fetchAllCompanyListForRFP();
    }

    if(gType === constants.RFP_EDIT){
      var rfp = lsUtils.getValue(constants.KEY_RFP_OBJECT);
      this.props.fetchContactAction(rfp.contactId)
        .then(() => {
          // console.log('I am in the get result');
          that.setState({
            isFavorite : this.props.isFavorite,
            favorite : this.props.favorite,
            renderCollateral :false
          });

          // console.log('that.props.initialValues:'+JSON.stringify(that.props.initialValues));

          that.props.initialize(that.props.initialValues);
        });
    }
  }

  onSubmit(values) {
      // console.log('In onSubmit, props:'+JSON.stringify(values));

      // values.createdById = this.props.createdById;
      // values.createdByCompanyId=this.props.createdByCompanyId;
      // values.numOfIOI = this.props.numOfIOI;

      values.createdById = this.state.user.userId;
      values.createdByCompanyId=this.state.user.companyId;
      values.numOfIOI = this.props.numOfIOI; // I don't know what todo with this

      if(values.category.toUpperCase() !== 'ABL'){
        //erase the values in Collateral
        values.acctRecvGrossAmt  = '';
        values.acctRecvComment   = '';
        values.invtryGrossAmt    = '';
        values.invtryComment     = '';
        values.ppeGrossAmt       = '';
        values.ppeComment        = '';
        values.maeGrossAmt       = '';
        values.maeComment        = '';
        values.realEstGrossAmt   = '';
        values.realEstComment    = '';
        values.otherGrossAmt     = '';
        values.otherComment      = '';
      }

      if(gType === constants.RFP_EDIT){
        var rfp = lsUtils.getValue(constants.KEY_RFP_OBJECT);
        values.rfpId = rfp.rfpId;
        values.contactId = rfp.contactId;

        // sanitize the currency values
        values.dealSize = numeral(values.dealSize).value();
        values.ltmRevenue = numeral(values.ltmRevenue).value();
        values.ltmEbitda = numeral(values.ltmEbitda).value();

        this.props.updateRFPAction(values)
          .then(() => {
            // blog post has been created, navigate the user to the index
            // We navigate by calling this.context.router.push with the
            // new path to navigate to.
            this.props.history.push(constants.ROUTES_MAP.RFP_MARKETPLACE);
            // this.props.history.push(constants.ROUTES_MAP.MY_PROFILE); // FOR LOCAL_TESTING
        });
      } else {
        let user= lsUtils.getValue(constants.KEY_USER_OBJECT);
        if(user.isSuperAdmin && user.isSuperAdmin === true){
          values.createdByCompanyId = values.createdForCompany;
        }
        this.props.createRFPAction(values)
          .then(() => {
            // blog post has been created, navigate the user to the index
            // We navigate by calling this.context.router.push with the
            // new path to navigate to.

            this.props.history.push(constants.ROUTES_MAP.RFP_MARKETPLACE);
            // this.props.history.push(constants.ROUTES_MAP.MY_PROFILE); // FOR LOCAL_TESTING
        });
      }
    }

  displayCompanyDropdown(){
    if(this.props.companyList){
      const { fields: {createdForCompany}} = this.props;
      var makeOptions = function(company){
        return <option value={company.companyId}>{company.companyName}</option>
      };

      return(<div>
        <div className={`row`}>
          <div className={`form-group col-xs-12 col-md-12`}>
            <label>Select a Company this RFP belongs to</label><br/>
            <select className="form-control" {...createdForCompany}>
              {this.props.companyList.map(makeOptions)}
            </select>
          </div>
        </div>
      </div>);
    }
  }

  displayABLDetails(){
    if(this.state.renderCollateral && this.state.renderCollateral === true){
      return(<div className="div-border">
        <h4 className="display-center">Collateral</h4>
        <br/>
        <div className={`row`}>
          <div className={`form-group col-xs-3 col-md-3`}>
            <label>Accounts Receivable :</label><br/>
          </div>
          <Field
            name="acctRecvGrossAmt"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Gross Amount ($)"
          />
          <Field
            name="acctRecvComment"
            size="col-xs-6 col-md-6"
            component={this.renderField}
            placeholder="Comments..."
          />
        </div>
        <div className={`row`}>
          <div className={`form-group col-xs-3 col-md-3`}>
            <label>Inventory :</label><br/>
          </div>
          <Field
            name="invtryGrossAmt"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Gross Amount ($)"
          />
          <Field
            name="invtryComment"
            size="col-xs-6 col-md-6"
            component={this.renderField}
            placeholder="Comments..."
          />
        </div>
        <div className={`row`}>
          <div className={`form-group col-xs-3 col-md-3`}>
            <label>PP&E :</label><br/>
          </div>
          <Field
            name="ppeGrossAmt"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Gross Amount ($)"
          />
          <Field
            name="ppeComment"
            size="col-xs-6 col-md-6"
            component={this.renderField}
            placeholder="Comments..."
          />
        </div>
        <div className={`row`}>
          <div className={`form-group col-xs-3 col-md-3`}>
            <label>Machinery & Equipment :</label><br/>
          </div>
          <Field
            name="maeGrossAmt"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Gross Amount ($)"
          />
          <Field
            name="maeComment"
            size="col-xs-6 col-md-6"
            component={this.renderField}
            placeholder="Comments..."
          />
        </div>
        <div className={`row`}>
          <div className={`form-group col-xs-3 col-md-3`}>
            <label>Real Estate :</label><br/>
          </div>
          <Field
            name="realEstGrossAmt"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Gross Amount ($)"
          />
          <Field
            name="realEstComment"
            size="col-xs-6 col-md-6"
            component={this.renderField}
            placeholder="Comments..."
          />
        </div>
        <div className={`row`}>
          <div className={`form-group col-xs-3 col-md-3`}>
            <label>Other :</label><br/>
          </div>
          <Field
            name="otherGrossAmt"
            size="col-xs-3 col-md-3"
            component={this.renderField}
            placeholder="Gross Amount ($)"
          />
          <Field
            name="otherComment"
            size="col-xs-6 col-md-6"
            component={this.renderField}
            placeholder="Comments..."
          />
        </div>
        <br/>
      </div>);
    }
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

  renderTextArea(field) {
    // console.log('field:'+JSON.stringify(field));
    const { meta: { touched, error } } = field;
    const { size } = field;
    const className = `form-group ${size} ${touched && error ? "has-danger" : ""}`;

    return (
      <div className={className}>
        <label>{field.label}</label>
        <textarea type="text" className="form-control" placeholder={field.placeholder} {...field.input} />
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

  renderDatePicker(field){
    const { meta: { touched, error } } = field;
    const { size } = field;
    const className = `form-group ${size} ${touched && error ? "has-danger" : ""}`;

    return (
      <div className={className}>
        <label>{field.label}</label>
        <Datetime {...field.input}/>
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

  renderRadioField(field) {
    // console.log('field:'+JSON.stringify(field));
		const { meta: { touched, error } } = field;
    const { size } = field;
		const className = `form-group ${size} ${touched && error ? "has-danger" : ""}`;
		return (
      <div className={className}>
        <label>{field.label}</label><br/>
        {field.options.map(function(val){
          // console.log('val:'+val);
          return(
            <span key={val}>
              <input
    						type="radio"
                value={val}
                key={val}
                {...field.input}
    						/>
                &nbsp;
              {val}
              &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          )
        })}
      </div>
		);
	}

  onBlurCategory(values){
    if(values.currentTarget.value === 'ABL'){
      this.setState({
        'renderCollateral' : true
      });
    } else {
      this.setState({
        'renderCollateral' : false
      });
    }
  }

  render() {
    // console.log('I am in create RFP render');
    const { handleSubmit } = this.props;
    return (
      <div>
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >
            {this.displayCompanyDropdown()}
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
              <h3>Create RFP / Request Pitch</h3>
              <br/>
              <div className={`row`}>
                <Field
                  label="Request Type"
                  name="requestType"
                  size="col-xs-12 col-md-12"
                  component={this.renderDropdown}
                  options={requestTypeOptions}
                />
              </div>
              <div className={`row`}>
                <Field
                  label="Company Name"
                  name="companyName"
                  size="col-xs-12 col-md-12"
                  component={this.renderField}
                />
              </div>
              <div className={`row`}>
                <Field
                  label="Deal Size ($)"
                  name="dealSize"
                  size="col-xs-6 col-md-6"
                  component={this.renderField}
                />
                <Field
                  label="Tenor"
                  name="tenor"
                  size="col-xs-6 col-md-6"
                  component={this.renderField}
                />
              </div>
              <div className={`row`}>
                <Field
                  label="Category"
                  name="category"
                  onBlur={this.onBlurCategory.bind(this)}
                  size="col-xs-6 col-md-6"
                  component={this.renderDropdown}
                  options={categoryOptions}
                />
                <Field
                  label="Product"
                  name="product"
                  size="col-xs-6 col-md-6"
                  component={this.renderDropdown}
                  options={productOptions}
                />
              </div>
              {this.displayABLDetails()}
              <div className={`row`}>
                <Field
                  label="Sector"
                  name="sector"
                  size="col-xs-6 col-md-6"
                  component={this.renderDropdown}
                  options={sectorOptions}
                />
                <Field
                  label="Region"
                  name="region"
                  size="col-xs-6 col-md-6"
                  component={this.renderDropdown}
                  options={regionOptions}
                />
              </div>
              <div className={`row`}>
                <Field
                  label="LTM Revenue ($)"
                  name="ltmRevenue"
                  size="col-xs-6 col-md-6"
                  component={this.renderField}
                />
                <Field
                  label="LTM EBITDA ($)"
                  name="ltmEbitda"
                  size="col-xs-6 col-md-6"
                  component={this.renderField}
                />
              </div>
              <div className={`row`}>
                <Field
                  label="Transaction Overview / Use of Funds"
                  name="txnOverview"
                  size="col-xs-12 col-md-12"
                  component={this.renderTextArea}
                  placeholder={constants.TXN_OVERVIEW_SAMPLE}
                />
              </div>
              <div className={`row`}>
                <Field
                  label="Company Description"
                  name="companyDesc"
                  size="col-xs-12 col-md-12"
                  component={this.renderTextArea}
                  placeholder={constants.COMPANY_DESC_SAMPLE}
                />
              </div>
              <div className={`row`}>
                <Field
                  label="Expiry date for this RFP"
                  name="expiryDt"
                  size="col-xs-6 col-md-6"
                  component={this.renderDatePicker}
                />
                <Field
                  label="Is this sponsored ?"
                  name="isSponsored"
                  size="col-xs-6 col-md-6"
                  component={this.renderDropdown}
                  options={sponsoredOptions}
                />
              </div>
              <br/>
              <hr/>
              <h3>Company Management Contact</h3>
              <div className={`row`}>
                <Field
                  label="Name"
                  name="fullName"
                  size="col-xs-6 col-md-6"
                  component={this.renderField}
                />
                <Field
                  label="Role"
                  name="contactRole"
                  size="col-xs-6 col-md-6"
                  component={this.renderField}
                />
              </div>
              <div className={`row`}>
                <Field
                  label="Phone"
                  name="phoneNumber"
                  size="col-xs-6 col-md-6"
                  component={this.renderField}
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  size="col-xs-6 col-md-6"
                  component={this.renderField}
                />
              </div>

              <button type="submit" className="btn btn-primary">{gType === constants.RFP_EDIT ? 'Edit RFP' : 'Create RFP'}</button>
              <Link to="/rfpMarketPlace" className="btn btn-danger">Cancel</Link>
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

function mapStateToProps(state) {
  // console.log('In mapStateToProps, gType:'+gType);
  // console.log('In mapStateToProps, state:'+JSON.stringify(state));
  var user = lsUtils.getValue(constants.KEY_USER_OBJECT);
  var company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
  var intializedData = {
    createdById           : user.userId,
    createdByCompanyId    : company.companyId
  };

  if(gType === constants.RFP_EDIT){
    var rfp = lsUtils.getValue(constants.KEY_RFP_OBJECT);
    // console.log('rfp:'+JSON.stringify(rfp));
    intializedData.requestType = rfp.requestType;
    intializedData.dealSize = rfp.dealSize;
    intializedData.tenor = rfp.tenor;
    intializedData.category = rfp.category;
    intializedData.product = rfp.product;
    intializedData.sector = rfp.sector;
    intializedData.txnOverview = rfp.txnOverview;
    intializedData.companyName = rfp.companyName;
    intializedData.companyDesc = rfp.companyDesc;
    intializedData.ltmRevenue = rfp.ltmRevenue;
    intializedData.ltmEbitda = rfp.ltmEbitda;
    intializedData.fullName = rfp.fullName;
    intializedData.contactRole = rfp.contactRole;
    intializedData.email = rfp.email;
    intializedData.isSponsored = rfp.isSponsored;
    intializedData.region = rfp.region;
    intializedData.phoneNumber = rfp.phoneNumber;
    intializedData.expiryDt = rfp.expiryDt;
    intializedData.numOfIOI = rfp.numOfIOI;
  }

  if(gType === constants.RFP_EDIT && state.userProfile.contact && state.userProfile.contact[0]){
    let contact = state.userProfile.contact[0];
    intializedData.phoneNumber = contact.phoneNumber;
    intializedData.fullName = contact.fullName;
    intializedData.email = contact.email;
    intializedData.contactRole = contact.contactRole;
  }

  return {
    initialValues : intializedData,
    companyList : state.rfpList.companyListForRFP
  };
}


function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    createRFPAction : createRFPAction,
    fetchContactAction : fetchContactAction,
    updateRFPAction : updateRFPAction,
    fetchAllCompanyListForRFP : fetchAllCompanyListForRFP
  }, dispatch);
}


function validate(values) {
  const errors = {};

  if (!values.requestType) {
    errors.requestType = 'Select Request Type';
  }
  if (!values.dealSize) {
    errors.dealSize = 'Enter deal size';
  }
  if(!values.tenor) {
    errors.tenor = 'Enter Tenor';
  }
  if(!values.category) {
    errors.category = 'Select Category';
  }
  if(!values.product) {
    errors.product = 'Select Product';
  }
  if(!values.sector) {
    errors.sector = 'Select Sector';
  }
  if(!values.txnOverview) {
    errors.txnOverview = 'Enter transaction overview';
  }
  if(!values.companyName) {
    errors.companyName = 'Enter Company Name';
  }
  if(!values.companyDesc) {
    errors.companyDesc = 'Enter Company Description';
  }
  if(!values.ltmRevenue) {
    errors.ltmRevenue = 'Enter LTM Revenue';
  }
  if(!values.ltmEbitda) {
    errors.ltmEbitda = 'Enter LTM EBITDA';
  }
  if(!values.fullName) {
    errors.fullName = 'Enter Contact Name';
  }
  if(!values.contactRole) {
    errors.contactRole = 'Enter Contact Role';
  }
  if(!values.email) {
    errors.email = 'Enter Contact Email';
  }
  if(!values.isSponsored) {
    errors.isSponsored = 'Select the sponsored value';
  }
  if(!values.region) {
    errors.region = 'Select the Region value';
  }
  if(!values.phoneNumber) {
    errors.phoneNumber = 'Enter phone# for contact';
  }
  if(!values.expiryDt) {
    errors.expiryDt = 'Select a expiry Date for the RFP';
  }

  // console.log('errors:'+JSON.stringify(errors));
  return errors;
}

export default reduxForm({
  validate,
  form: 'CreateRFPForm',
  enableReinitialize: true
}) (connect(mapStateToProps, mapDispatchToProps)(CreateRFP));
