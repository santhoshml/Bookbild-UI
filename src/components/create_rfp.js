
import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { createRFPAction, fetchContactAction, updateRFPAction } from '../actions/index';
import { Link } from 'react-router';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import Datetime from "react-datetime";
import numeral from "numeral";
import Header from './header';

var gType=null;
class CreateRFP extends Component {

  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props){
    super(props);
    this.state = {
			type : props.params.type
		}
  }

  componentWillMount() {
    // console.log('I am in componentWillMount');
    gType = this.props.params.type;
    this.setState({
      type : this.props.params.type
    });

    if(gType === constants.RFP_EDIT){
      var rfp = lsUtils.getValue(constants.KEY_RFP_OBJECT);
      this.props.fetchContactAction(rfp.contactId)
        .then(() => {
          // console.log('I am in the get result');
          this.setState({
            isFavorite : this.props.isFavorite,
            favorite : this.props.favorite
          });
        });
    }
  }

  onSubmit(props) {
      // console.log('In onSubmit, props:'+JSON.stringify(props));
      if(gType === constants.RFP_EDIT){
        var rfp = lsUtils.getValue(constants.KEY_RFP_OBJECT);
        props.rfpId = rfp.rfpId;
        props.contactId = rfp.contactId;

        // sanitize the currency values
        props.dealSize = numeral(props.dealSize).value();
        props.ltmRevenue = numeral(props.ltmRevenue).value();
        props.ltmEbitda = numeral(props.ltmEbitda).value();

        this.props.updateRFPAction(props)
          .then(() => {
            // blog post has been created, navigate the user to the index
            // We navigate by calling this.context.router.push with the
            // new path to navigate to.
            this.context.router.push('/rfpMarketPlace');
        });
      } else {
        this.props.createRFPAction(props)
          .then(() => {
            // blog post has been created, navigate the user to the index
            // We navigate by calling this.context.router.push with the
            // new path to navigate to.
            this.context.router.push('/rfpMarketPlace');
        });
      }
    }

  checkRequestTypeValue(){

  }

  render() {
    const { fields: { requestType, dealSize, tenor, category, product, sector
      , txnOverview, companyName, companyDesc, ltmRevenue, ltmEbitda, fullName
      , contactRole, email, createdById, isSponsored, region, createdByCompanyId
      , phoneNumber, expiryDt}, handleSubmit } = this.props;

    return (
      <div>
        <Header />
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <h3>Create RFP / Request Pitch</h3>
          <br/>

          <input type="hidden" className="form-control" {...createdById} />
          <input type="hidden" className="form-control" {...createdByCompanyId} />

          <div className={`row`}>
            <div className={`form-group col-xs-12 col-md-12 ${requestType.touched && requestType.invalid ? 'has-danger' : ''}`}>
              <label>Request Type</label><br/>
              <label className="radio-inline"><input type="radio" value="New Financing" {...requestType}/>New Financing</label>
              <label className="radio-inline"><input type="radio" value="Refinancing" {...requestType}/>Refinancing</label>
              <label className="radio-inline"><input type="radio" value="Restructuring" {...requestType}/>Restructuring</label>
              <label className="radio-inline"><input type="radio" value="M&A" {...requestType}/>M&A</label>
              <label className="radio-inline"><input type="radio" value="LBO" {...requestType}/>LBO</label>
              <label className="radio-inline"><input type="radio" value="LBO" {...requestType}/>Market Check</label>
              <div className="text-help">
                {requestType.touched ? requestType.error : ''}
              </div>
            </div>
          </div>

          <div className={`row`}>
            <div className={`form-group col-xs-12 col-md-12 ${companyName.touched && companyName.invalid ? 'has-danger' : ''}`}>
              <label>Company Name</label>
              <input type="text" className="form-control" {...companyName} />
              <div className="text-help">
                {companyName.touched ? companyName.error : ''}
              </div>
            </div>
          </div>

          <div className={`row`}>
            <div className={`form-group col-xs-6 col-md-6 ${dealSize.touched && dealSize.invalid ? 'has-danger' : ''}`}>
              <label>Deal Size ($)</label>
              <input type="text" className="form-control" {...dealSize} />
              <div className="text-help">
                {dealSize.touched ? dealSize.error : ''}
              </div>
            </div>

            <div className={`form-group col-xs-6 col-md-6 ${tenor.touched && tenor.invalid ? 'has-danger' : ''}`}>
              <label>Tenor</label>
              <input type="text" className="form-control" {...tenor} />
              <div className="text-help">
                {tenor.touched ? tenor.error : ''}
              </div>
            </div>
          </div>

          <div className={`row`}>
            <div className={`form-group col-xs-6 col-md-6 ${category.touched && category.invalid ? 'has-danger' : ''}`}>
              <label>Category</label><br/>
              <select className="form-control" {...category}>
                <option value="ABL">ABL</option>
                <option value="Cash Flow">Cash Flow</option>
                <option value="Open">Open</option>
              </select>
              <div className="text-help">
                {category.touched ? category.error : ''}
              </div>
            </div>

            <div className={`form-group col-xs-6 col-md-6 ${product.touched && product.invalid ? 'has-danger' : ''}`}>
              <label>Product</label><br/>
              <select className="form-control" {...product}>
                <option value="Revolver">Revolver</option>
                <option value="Term Loan">Term Loan</option>
                <option value="Mezzanine">Mezzanine</option>
                <option value="Multi-Tranche">Multi-Tranche</option>
                <option value="Uni-Tranche">Uni-Tranche</option>
              </select>
              <div className="text-help">
                {product.touched ? product.error : ''}
              </div>
            </div>
          </div>

          <div className={`row`}>
            <div className={`form-group col-xs-6 col-md-6 ${sector.touched && sector.invalid ? 'has-danger' : ''}`}>
              <label>Sector</label>
              <select className="form-control" {...sector}>
                <option value=""> --- select one --- </option>
                <option value="IT">IT</option>
                <option value="Financials">Financials</option>
                <option value="Health Care">Health Care</option>
                <option value="Energy">Energy</option>
                <option value="Consumer Staples">Consumer Staples</option>
                <option value="Consumer Disc">Consumer Disc</option>
                <option value="Industrials">Industrials</option>
                <option value="Materials">Materials</option>
                <option value="Utilities">Utilities</option>
                <option value="Telecoms">Telecoms</option>
              </select>
              <div className="text-help">
                {sector.touched ? sector.error : ''}
              </div>
            </div>

            <div className={`form-group col-xs-6 col-md-6 ${region.touched && region.invalid ? 'has-danger' : ''}`}>
              <label>Region</label>
              <select className="form-control" {...region}>
                <option value=""> --- select one --- </option>
                <option value="West Coast">West Coast</option>
                <option value="Mid Atlantic">Mid Atlantic</option>
                <option value="Great Lakes">Great Lakes</option>
                <option value="South">South</option>
                <option value="Mountain">Mountain</option>
                <option value="Southeast">Southeast</option>
                <option value="New England">New England</option>
                <option value="Midwest">Midwest</option>
              </select>
              <div className="text-help">
                {region.touched ? region.error : ''}
              </div>
            </div>
          </div>

          <div className={`row`}>
            <div className={`form-group col-xs-6 col-md-6 ${ltmRevenue.touched && ltmRevenue.invalid ? 'has-danger' : ''}`}>
              <label>LTM Revenue ($)</label>
              <input type="text" className="form-control" {...ltmRevenue} />
              <div className="text-help">
                {ltmRevenue.touched ? ltmRevenue.error : ''}
              </div>
            </div>

            <div className={`form-group col-xs-6 col-md-6 ${ltmEbitda.touched && ltmEbitda.invalid ? 'has-danger' : ''}`}>
              <label>LTM EBITDA ($)</label>
              <input type="text" className="form-control" {...ltmEbitda} />
              <div className="text-help">
                {ltmEbitda.touched ? ltmEbitda.error : ''}
              </div>
            </div>
          </div>

          <div className={`row`}>
            <div className={`form-group col-xs-12 col-md-12 ${txnOverview.touched && txnOverview.invalid ? 'has-danger' : ''}`}>
                <label>Transaction Overview / Use of Funds</label>
                <textarea className="form-control" {...txnOverview} />
                <div className="text-help">
                  {txnOverview.touched ? txnOverview.error : ''}
                </div>
            </div>
          </div>

          <div className={`row`}>
            <div className={`form-group col-xs-12 col-md-12 ${companyDesc.touched && companyDesc.invalid ? 'has-danger' : ''}`}>
              <label>Company Description</label>
              <textarea type="text" className="form-control" {...companyDesc} />
              <div className="text-help">
                {companyDesc.touched ? companyDesc.error : ''}
              </div>
            </div>
          </div>

          <div className={`row`}>
            <div className={`form-group col-xs-6 col-md-6 ${expiryDt.touched && expiryDt.invalid ? 'has-danger' : ''}`}>
              <label>Expiry date for this RFP </label><br/>
              <Datetime {...expiryDt}/>
              <div className="text-help">
                {expiryDt.touched ? expiryDt.error : ''}
              </div>
            </div>

            <div className={`form-group col-xs-6 col-md-6 ${isSponsored.touched && isSponsored.invalid ? 'has-danger' : ''}`}>
              <label>Is this sponsered ?</label><br/>
              <label className="radio-inline"><input type="radio" value="yes" {...isSponsored}/>YES</label>
              <label className="radio-inline"><input type="radio" value="no" {...isSponsored}/>NO</label>
              <div className="text-help">
                {isSponsored.touched ? isSponsored.error : ''}
              </div>
            </div>
          </div>

          <br/>
          <hr/>
          <h3>Company Management Contact</h3>

          <div className={`row`}>
            <div className={`form-group col-xs-6 col-md-6 ${fullName.touched && fullName.invalid ? 'has-danger' : ''}`}>
              <label>Name</label>
              <input type="text" className="form-control" {...fullName} />
              <div className="text-help">
                {fullName.touched ? fullName.error : ''}
              </div>
            </div>

            <div className={`form-group col-xs-6 col-md-6 ${contactRole.touched && contactRole.invalid ? 'has-danger' : ''}`}>
              <label>Role</label>
              <input type="text" className="form-control" {...contactRole} />
              <div className="text-help">
                {contactRole.touched ? contactRole.error : ''}
              </div>
            </div>
          </div>

          <div className={`row`}>
            <div className={`form-group col-xs-6 col-md-6 ${phoneNumber.touched && phoneNumber.invalid ? 'has-danger' : ''}`}>
              <label>Phone</label>
              <input type="text" className="form-control" {...phoneNumber} />
              <div className="text-help">
                {phoneNumber.touched ? phoneNumber.error : ''}
              </div>
            </div>

            <div className={`form-group col-xs-6 col-md-6 ${email.touched && email.invalid ? 'has-danger' : ''}`}>
              <label>Email</label>
              <input type="text" className="form-control" {...email} />
              <div className="text-help">
                {email.touched ? email.error : ''}
              </div>
            </div>
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
    console.log('rfp:'+JSON.stringify(rfp));
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
  }

  if(gType === constants.RFP_EDIT && state.userProfile.contact && state.userProfile.contact[0]){
    let contact = state.userProfile.contact[0];
    intializedData.phoneNumber = contact.phoneNumber;
    intializedData.fullName = contact.fullName;
    intializedData.email = contact.email;
    intializedData.contactRole = contact.contactRole;
  }

  return {
    initialValues : intializedData
  };
}


function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    createRFPAction : createRFPAction,
    fetchContactAction : fetchContactAction,
    updateRFPAction : updateRFPAction
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


  return errors;
}

export default reduxForm({
  form: 'CreateRFPForm',
  fields: ['requestType', 'dealSize', 'tenor', 'category', 'product', 'sector'
  , 'txnOverview', 'companyName', 'companyDesc', 'ltmRevenue', 'ltmEbitda'
  , 'fullName', 'contactRole', 'email', 'createdById', 'isSponsored', 'region'
  , 'createdByCompanyId', 'phoneNumber', 'expiryDt'],
  validate
}, mapStateToProps, mapDispatchToProps)(CreateRFP);
