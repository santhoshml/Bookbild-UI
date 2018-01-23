
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { fetchRFPAction, 
  fetchContactAction, 
  updateRFPAction, 
  updateContactAction,
  sendAMsgFromAdminWithCompanyId } from '../actions/index';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import Datetime from "react-datetime";
import numeral from "numeral";
import NavBar from './sidebar';
import Header from './header';
import { ToastContainer, toast } from 'react-toastify';
import { CircleLoader } from 'react-spinners';

const categoryOptions = ['Open', 'ABL', 'Cash Flow'];
const productOptions = ['Revolver', 'Term Loan', 'Mezzanine', 'Multi-Tranche', 'Uni-Tranche'];
const sectorOptions = ['IT', 'Financials', 'Health Care', 'Energy', 'Consumer Staples', 'Consumer Disc', 'Industrials', 'Materials', 'Utilities', 'Telecoms'];
const regionOptions=['West Coast', 'Mid Atlantic', 'Great Lakes', 'South', 'Mountain', 'Southeast', 'New England', 'Midwest'];
const sponsoredOptions=['yes', 'no'];
const requestTypeOptions=['New Financing', 'Refinancing', 'Restructuring', 'M&A', 'LBO', 'Market Check'];

class EditRFPForm extends Component {

  componentWillMount() {
    var that = this;
    // console.log('I am in createRFP componentWillMount');
    let paramId = this.props.match.params.id;
    let user= lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    this.props.fetchRFPAction(paramId);

    this.setState({
      type : this.props.match.params.type,
      user : user,
      company : company,
      loading : true,
      showCollateral : false
    });    
  }

  onSubmit(values) {
      let that = this;
      // console.log('In onSubmit, props:'+JSON.stringify(values));

      // values.createdById = this.props.createdById;
      // values.createdByCompanyId=this.props.createdByCompanyId;
      // values.numOfIOI = this.props.numOfIOI;

      values.createdById = this.state.user.userId;
      values.createdByCompanyId=this.state.user.companyId;
      values.numOfIOI = this.props.numOfIOI; // I don't know what todo with this

      // if(values.category.toUpperCase() !== 'ABL'){
      //   //erase the values in Collateral
      //   values.acctRecvGrossAmt  = '';
      //   values.acctRecvComment   = '';
      //   values.invtryGrossAmt    = '';
      //   values.invtryComment     = '';
      //   values.ppeGrossAmt       = '';
      //   values.ppeComment        = '';
      //   values.maeGrossAmt       = '';
      //   values.maeComment        = '';
      //   values.realEstGrossAmt   = '';
      //   values.realEstComment    = '';
      //   values.otherGrossAmt     = '';
      //   values.otherComment      = '';
      // }

      let promiseArr = [];
      let initValues = this.props.initialValues;
      values.rfpId = initValues.rfpId;
      values.contactId = initValues.contactId;

      // sanitize the currency values
      values.dealSize = numeral(values.dealSize).value();
      values.ltmRevenue = numeral(values.ltmRevenue).value();
      values.ltmEbitda = numeral(values.ltmEbitda).value();

      // check if the contact values have changed
      if(initValues.phoneNumber !== values.phoneNumber
        || initValues.fullName !== values.fullName
        || initValues.email !== values.email
        || initValues.contactRole !== values.contactRole){
          let uProps = {
            email : values.email,
            contactId : initValues.contactId,
            fullName : values.fullName,
            phoneNumber : values.phoneNumber,
            contactRole : values.contactRole
          };
          promiseArr.push(this.props.updateContactAction(uProps));
        }

      // check if the rfp field values changed
      if(initValues.requestType !== values.requestType
        || initValues.companyName !== values.companyName
        || initValues.dealSize !== values.dealSize
        || initValues.tenor !== values.tenor
        || initValues.category !== values.category
        || initValues.product !== values.product
        || initValues.sector !== values.sector
        || initValues.region !== values.region
        || initValues.ltmRevenue !== values.ltmRevenue
        || initValues.ltmEbitda !== values.ltmEbitda
        || initValues.txnOverview !== values.txnOverview
        || initValues.companyDesc !== values.companyDesc
        || initValues.expiryDt !== values.expiryDt
        || initValues.isSponsored !== values.isSponsored){
          let uProps = {
            rfpId : initValues.rfpId,
            contactId : initValues.contactId,
            requestType : values.requestType,
            companyName : values.companyName,
            dealSize : values.dealSize,
            tenor : values.tenor,
            category : values.category,
            product : values.product,
            sector : values.sector,
            region : values.region,
            ltmRevenue : values.ltmRevenue,
            ltmEbitda : values.ltmEbitda,
            txnOverview : values.txnOverview,
            companyDesc : values.companyDesc,
            expiryDt : values.expiryDt,
            isSponsored : values.isSponsored
          }
          promiseArr.push(this.props.updateRFPAction(values));
        }

        if(promiseArr.length > 0){
          Promise.all(promiseArr)
          .then((data)=> {
            if(data[0].payload.status === 200 && data[0].payload.data.status === 'SUCCESS'){
              let mProps = {
                companyId : that.state.company.companyId,
                msg : constants.MESSAGES.RFP_UPDATED,
                ID : that.props.initialValues.rfpId
              };
              this.props.sendAMsgFromAdminWithCompanyId(mProps);
              this.props.history.push({
                pathname : constants.ROUTES_MAP.RFP_MARKETPLACE,
                state : constants.NOTIFICATIONS.EDIT_RFP_SUCCESS
              });
            } else {
              toast(constants.NOTIFICATIONS.EDIT_RFP_FAILED, {
                className : "notification-error"
              });
            }
          });
        }
    }

  displayABLDetails(){
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

  flipCollateralLink(){
    this.setState({
      showCollateral : !this.state.showCollateral
    });
  }

  render() {
    // console.log('I am in create RFP render');
    const { handleSubmit } = this.props;
    return (
      <div>
        <ToastContainer />
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >
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
              <h3><a onClick={this.flipCollateralLink.bind(this)} href="#">Click here to enter data for Collateral</a></h3>
              {this.state.showCollateral ? this.displayABLDetails() : ''}
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

              <button type="submit" className="btn btn-primary">Edit RFP</button>
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
  let initialValues = {};
  
  if(state.rfpList.rfpList){
    let rfp = state.rfpList.rfpList[0];
    // console.log('rfp :'+JSON.stringify(rfp));

    initialValues.rfpId = rfp.rfpId;
    initialValues.requestType = rfp.requestType;
    initialValues.companyName = rfp.companyName;
    initialValues.dealSize = rfp.dealSize;
    initialValues.tenor = rfp.tenor;
    initialValues.category = rfp.category;
    initialValues.product = rfp.product;
    initialValues.sector = rfp.sector;
    initialValues.region = rfp.region;
    initialValues.ltmRevenue = rfp.ltmRevenue;
    initialValues.ltmEbitda = rfp.ltmEbitda;
    initialValues.txnOverview = rfp.txnOverview;
    initialValues.companyDesc = rfp.companyDesc
    initialValues.expiryDt = rfp.expiryDt;
    initialValues.isSponsored = rfp.isSponsored;
    
    // set the company management contact values
    initialValues.fullName = rfp.contactObject.fullName;
    initialValues.contactRole = rfp.contactObject.contactRole;
    initialValues.phoneNumber = rfp.contactObject.phoneNumber;
    initialValues.email = rfp.contactObject.email;
    initialValues.contactId = rfp.contactId;

    return {
      initialValues : initialValues
    };
  }

  return {};
}


function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    fetchContactAction : fetchContactAction,
    updateRFPAction : updateRFPAction,
    fetchRFPAction : fetchRFPAction,
    updateContactAction : updateContactAction,
    sendAMsgFromAdminWithCompanyId : sendAMsgFromAdminWithCompanyId
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

EditRFPForm = reduxForm({
  validate,
  form: 'EditRFPForm',
  enableReinitialize: true
}) (EditRFPForm)

EditRFPForm = connect(mapStateToProps, mapDispatchToProps)(EditRFPForm);

export default EditRFPForm;