
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
      this.props.createRFPAction(props)
        .then(() => {
          // blog post has been created, navigate the user to the index
          // We navigate by calling this.context.router.push with the
          // new path to navigate to.
          this.context.router.push('/rfpMarketPlace');
        });
    }

  render() {
    const { fields: { requestType, dealSize, tenor, category, product, sector
      , txnOverview, companyName, companyDesc, ltmRevenue, ltmEbitda, fullName
      , contactRole, email, createdById, isSponsored, region, createdByCompanyId
     }, handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <h3>Create RFP / Request Pitch</h3>
        <br/>

        <input type="hidden" className="form-control" {...createdById} />
        <input type="hidden" className="form-control" {...createdByCompanyId} />

        <div className={`form-group ${requestType.touched && requestType.invalid ? 'has-danger' : ''}`}>
          <label>Request Type</label><br/>
          <label className="radio-inline"><input type="radio" value="newFinancing" {...requestType}/>New Financing</label>
          <label className="radio-inline"><input type="radio" value="refinancing" {...requestType}/>Refinancing</label>
          <label className="radio-inline"><input type="radio" value="restructuring" {...requestType}/>Restructuring</label>
          <label className="radio-inline"><input type="radio" value="ma" {...requestType}/>M&A</label>
          <label className="radio-inline"><input type="radio" value="lbo" {...requestType}/>LBO</label>
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
          <label className="radio-inline"><input type="radio" value="ABL" {...category}/>ABL</label>
          <label className="radio-inline"><input type="radio" value="Cash Flow" {...category}/>Cash Flow</label>
          <label className="radio-inline"><input type="radio" value="Open" {...category}/>Open</label>
          <div className="text-help">
            {category.touched ? category.error : ''}
          </div>
        </div>

        <div className={`form-group ${product.touched && product.invalid ? 'has-danger' : ''}`}>
          <label>Product</label><br/>
          <label className="radio-inline"><input type="radio" value="Revolver" {...product}/>Revolver</label>
          <label className="radio-inline"><input type="radio" value="Term Loan" {...product}/>Term Loan</label>
          <label className="radio-inline"><input type="radio" value="Mezzanine" {...product}/>Mezzanine</label>
          <label className="radio-inline"><input type="radio" value="Multi-Tranche" {...product}/>Multi-Tranche</label>
          <label className="radio-inline"><input type="radio" value="Uni-Tranche" {...product}/>Uni-Tranche</label>
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

        <div className={`form-group ${region.touched && region.invalid ? 'has-danger' : ''}`}>
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

        <div className={`form-group ${isSponsored.touched && isSponsored.invalid ? 'has-danger' : ''}`}>
          <label>Is this sponsered ?</label><br/>
          <label className="radio-inline"><input type="radio" value="yes" {...isSponsored}/>YES</label>
          <label className="radio-inline"><input type="radio" value="no" {...isSponsored}/>NO</label>
          <div className="text-help">
            {isSponsored.touched ? isSponsored.error : ''}
          </div>
        </div>

        <br/>
        <hr/>
        <h3>Company Management Contact</h3>

        <div className={`form-group ${fullName.touched && fullName.invalid ? 'has-danger' : ''}`}>
          <label>Name</label>
          <input type="text" className="form-control" {...fullName} />
          <div className="text-help">
            {fullName.touched ? fullName.error : ''}
          </div>
        </div>

        <div className={`form-group ${contactRole.touched && contactRole.invalid ? 'has-danger' : ''}`}>
          <label>Role</label>
          <input type="text" className="form-control" {...contactRole} />
          <div className="text-help">
            {contactRole.touched ? contactRole.error : ''}
          </div>
        </div>

        <div className={`form-group ${email.touched && email.invalid ? 'has-danger' : ''}`}>
          <label>Email</label>
          <input type="text" className="form-control" {...email} />
          <div className="text-help">
            {email.touched ? email.error : ''}
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Create RFP</button>
        <Link to="/" className="btn btn-danger">Cancel</Link>
      </form>
      );
    }
  }

function mapStateToProps(state) {
  var user = lsUtils.getValue(constants.KEY_USER_OBJECT);
  var company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);

  return {
    initialValues : {
      createdById           : user.userId,
      createdByCompanyId  : company.companyId
    }
  };
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

  return errors;
}

export default reduxForm({
  form: 'CreateRFPForm',
  fields: ['requestType', 'dealSize', 'tenor', 'category', 'product', 'sector'
  , 'txnOverview', 'companyName', 'companyDesc', 'ltmRevenue', 'ltmEbitda'
  , 'fullName', 'contactRole', 'email', 'createdById', 'isSponsored', 'region', 'createdByCompanyId'],
  validate
}, mapStateToProps, { createRFPAction })(CreateRFP);
