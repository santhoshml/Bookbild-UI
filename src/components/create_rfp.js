
import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { createRFPAction } from '../actions/index';
import { Link } from 'react-router';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';

class CreateRFP extends Component {

  static contextTypes = {
    router: PropTypes.object
  };

  onSubmit(props) {
      // var createdBy = JSON.parse(lsUtils.getValue(constants.KEY_USER_OBJECT)).user_id;
      // props.createdBy = createdBy;
      this.props.createRFPAction(props)
        .then(() => {
          // blog post has been created, navigate the user to the index
          // We navigate by calling this.context.router.push with the
          // new path to navigate to.
          this.context.router.push('/');
        });
    }

  render() {
    const { fields: { requestType, dealSize, tenor, category, product, sector
      , txnOverview, companyName, companyDesc, ltmRevenue, ltmEbitda, contactName
      , contactRole, contactEmail, createdBy }, handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <h3>Create RFP / Request Pitch</h3>
        <br/>

        <div className={`form-group ${requestType.touched && requestType.invalid ? 'has-danger' : ''}`}>
          <label>Request Type</label><br/>
          <label className="radio-inline"><input type="radio" {...requestType}/>New Financing</label>
          <label className="radio-inline"><input type="radio" {...requestType}/>Refinancing</label>
          <label className="radio-inline"><input type="radio" {...requestType}/>Restructuring</label>
          <label className="radio-inline"><input type="radio" {...requestType}/>M&A</label>
          <label className="radio-inline"><input type="radio" {...requestType}/>LBO</label>
          <div className="text-help">
            {requestType.touched ? requestType.error : ''}
          </div>
        </div>

        <div className={`form-group ${dealSize.touched && dealSize.invalid ? 'has-danger' : ''}`}>
          <label>Deal Size ($)</label>
          <input type="text" className="form-control" {...dealSize} />
          <div className="text-help">
            {dealSize.touched ? dealSize.error : ''}
          </div>
        </div>

        <div className={`form-group ${tenor.touched && tenor.invalid ? 'has-danger' : ''}`}>
          <label>Tenor</label>
          <input type="text" className="form-control" {...tenor} />
          <div className="text-help">
            {tenor.touched ? tenor.error : ''}
          </div>
        </div>

        <div className={`form-group ${category.touched && category.invalid ? 'has-danger' : ''}`}>
          <label>Category</label><br/>
          <label className="radio-inline"><input type="radio" {...category}/>ABL</label>
          <label className="radio-inline"><input type="radio" {...category}/>Cash Flow</label>
          <label className="radio-inline"><input type="radio" {...category}/>Open</label>
          <div className="text-help">
            {category.touched ? category.error : ''}
          </div>
        </div>

        <div className={`form-group ${product.touched && product.invalid ? 'has-danger' : ''}`}>
          <label>Product</label><br/>
          <label className="radio-inline"><input type="radio" {...product}/>Revolver</label>
          <label className="radio-inline"><input type="radio" {...product}/>Term Loan</label>
          <label className="radio-inline"><input type="radio" {...product}/>Mezzanine</label>
          <label className="radio-inline"><input type="radio" {...product}/>Multi-Tranche</label>
          <label className="radio-inline"><input type="radio" {...product}/>Uni-Tranche</label>
          <div className="text-help">
            {product.touched ? product.error : ''}
          </div>
        </div>

        <div className={`form-group ${sector.touched && sector.invalid ? 'has-danger' : ''}`}>
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

        <div className={`form-group ${txnOverview.touched && txnOverview.invalid ? 'has-danger' : ''}`}>
            <label>Transaction Overview / Use of Funds</label>
            <textarea className="form-control" {...txnOverview} />
            <div className="text-help">
              {txnOverview.touched ? txnOverview.error : ''}
            </div>
        </div>

        <div className={`form-group ${companyName.touched && companyName.invalid ? 'has-danger' : ''}`}>
          <label>Company Name</label>
          <input type="text" className="form-control" {...companyName} />
          <div className="text-help">
            {companyName.touched ? companyName.error : ''}
          </div>
        </div>

        <div className={`form-group ${companyDesc.touched && companyDesc.invalid ? 'has-danger' : ''}`}>
          <label>Company Description</label>
          <input type="text" className="form-control" {...companyDesc} />
          <div className="text-help">
            {companyDesc.touched ? companyDesc.error : ''}
          </div>
        </div>

        <div className={`form-group ${ltmRevenue.touched && ltmRevenue.invalid ? 'has-danger' : ''}`}>
          <label>LTM Revenue ($)</label>
          <input type="text" className="form-control" {...ltmRevenue} />
          <div className="text-help">
            {ltmRevenue.touched ? ltmRevenue.error : ''}
          </div>
        </div>

        <div className={`form-group ${ltmEbitda.touched && ltmEbitda.invalid ? 'has-danger' : ''}`}>
          <label>LTM EBITDA ($)</label>
          <input type="text" className="form-control" {...ltmEbitda} />
          <div className="text-help">
            {ltmEbitda.touched ? ltmEbitda.error : ''}
          </div>
        </div>

        <br/>
        <hr/>
        <h3>Company Management Contact</h3>

        <div className={`form-group ${contactName.touched && contactName.invalid ? 'has-danger' : ''}`}>
          <label>Name</label>
          <input type="text" className="form-control" {...contactName} />
          <div className="text-help">
            {contactName.touched ? contactName.error : ''}
          </div>
        </div>

        <div className={`form-group ${contactRole.touched && contactRole.invalid ? 'has-danger' : ''}`}>
          <label>Role</label>
          <input type="text" className="form-control" {...contactRole} />
          <div className="text-help">
            {contactRole.touched ? contactRole.error : ''}
          </div>
        </div>

        <div className={`form-group ${contactEmail.touched && contactEmail.invalid ? 'has-danger' : ''}`}>
          <label>Email</label>
          <input type="text" className="form-control" {...contactEmail} />
          <div className="text-help">
            {contactEmail.touched ? contactEmail.error : ''}
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Create RFP</button>
        <Link to="/" className="btn btn-danger">Cancel</Link>
      </form>
      );
    }
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
    errors.tenor = 'Select Category';
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
  if(!values.contactName) {
    errors.contactName = 'Enter Contact Name';
  }
  if(!values.contactRole) {
    errors.contactRole = 'Enter Contact Role';
  }
  if(!values.contactEmail) {
    errors.contactEmail = 'Enter Contact Email';
  }

  return errors;
}

export default reduxForm({
  form: 'CreateRFPForm',
  fields: ['requestType', 'dealSize', 'tenor', 'category', 'product', 'sector'
  , 'txnOverview', 'companyName', 'companyDesc', 'ltmRevenue', 'ltmEbitda'
  , 'contactName', 'contactRole', 'contactEmail', 'createdBy'],
  validate
}, null, { createRFPAction })(CreateRFP);
