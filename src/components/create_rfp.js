
import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { createRFPAction, fetchContactAction, updateRFPAction, fetchAllCompanyListForRFP } from '../actions/index';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import Datetime from "react-datetime";
import numeral from "numeral";
import Header from './header';

var gType=null;
class CreateRFP extends Component {

  // static contextTypes = {
  //   router: PropTypes.object
  // };

  // constructor(props){
  //   super(props);
  //   this.state = {
	// 		type : props.params.type,
  //     companyList : null
	// 	}
  // }

  componentWillMount() {
    // console.log('I am in componentWillMount');
    gType = this.props.params.type;
    this.setState({
      type : this.props.params.type
    });

    let user= lsUtils.getValue(constants.KEY_USER_OBJECT);
    if(user.isSuperAdmin && user.isSuperAdmin === true){
      this.props.fetchAllCompanyListForRFP();
    }

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

      if(props.category.toUpperCase() !== 'ABL'){
        //erase the values in Collateral
        props.acctRecvGrossAmt  = '';
        props.acctRecvComment   = '';
        props.invtryGrossAmt    = '';
        props.invtryComment     = '';
        props.ppeGrossAmt       = '';
        props.ppeComment        = '';
        props.maeGrossAmt       = '';
        props.maeComment        = '';
        props.realEstGrossAmt   = '';
        props.realEstComment    = '';
        props.otherGrossAmt     = '';
        props.otherComment      = '';
      }

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
            this.context.router.push(constants.ROUTES_MAP.RFP_MARKETPLACE);
        });
      } else {
        let user= lsUtils.getValue(constants.KEY_USER_OBJECT);
        if(user.isSuperAdmin && user.isSuperAdmin === true){
          props.createdByCompanyId = props.createdForCompany;
        }
        this.props.createRFPAction(props)
          .then(() => {
            // blog post has been created, navigate the user to the index
            // We navigate by calling this.context.router.push with the
            // new path to navigate to.

            this.context.router.push(constants.ROUTES_MAP.RFP_MARKETPLACE);
            // this.context.router.push(constants.ROUTES_MAP.MY_PROFILE); // FOR LOCAL_TESTING
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

  displayABLDetails(val){
    const { fields: { acctRecvGrossAmt, acctRecvComment
      , invtryGrossAmt, invtryComment, ppeGrossAmt, ppeComment, maeGrossAmt
      , maeComment, realEstGrossAmt, realEstComment, otherGrossAmt
      , otherComment}} = this.props;

    // console.log('In displayABLDetails, this.props.category :'+this.props.category);
    // console.log('val:'+ JSON.stringify(val));
    if(val && val.value && val.value.toUpperCase() === 'ABL'){
      return(<div className="div-border">
        <h4 className="display-center">Collateral</h4>
        <br/>
        <div className={`row`}>
          <div className={`form-group col-xs-3 col-md-3`}>
            <label>Accounts Receivable :</label><br/>
          </div>
          <div className={`form-group col-xs-3 col-md-3`}>
            <input type="text" className="form-control" {...acctRecvGrossAmt} placeholder="Gross Amount ($)"/>
          </div>
          <div className={`form-group col-xs-6 col-md-6`}>
            <input type="text" className="form-control" {...acctRecvComment} placeholder="Comments..."/>
          </div>
        </div>
        <div className={`row`}>
          <div className={`form-group col-xs-3 col-md-3`}>
            <label>Inventory :</label><br/>
          </div>
          <div className={`form-group col-xs-3 col-md-3`}>
            <input type="text" className="form-control" {...invtryGrossAmt} placeholder="Gross Amount ($)"/>
          </div>
          <div className={`form-group col-xs-6 col-md-6`}>
            <input type="text" className="form-control" {...invtryComment} placeholder="Comments..."/>
          </div>
        </div>
        <div className={`row`}>
          <div className={`form-group col-xs-3 col-md-3`}>
            <label>PP&E :</label><br/>
          </div>
          <div className={`form-group col-xs-3 col-md-3`}>
            <input type="text" className="form-control" {...ppeGrossAmt} placeholder="Gross Amount ($)"/>
          </div>
          <div className={`form-group col-xs-6 col-md-6`}>
            <input type="text" className="form-control" {...ppeComment} placeholder="Comments..."/>
          </div>
        </div>
        <div className={`row`}>
          <div className={`form-group col-xs-3 col-md-3`}>
            <label>Machinery & Equipment :</label><br/>
          </div>
          <div className={`form-group col-xs-3 col-md-3`}>
            <input type="text" className="form-control" {...maeGrossAmt} placeholder="Gross Amount ($)"/>
          </div>
          <div className={`form-group col-xs-6 col-md-6`}>
            <input type="text" className="form-control" {...maeComment} placeholder="Comments..."/>
          </div>
        </div>
        <div className={`row`}>
          <div className={`form-group col-xs-3 col-md-3`}>
            <label>Real Estate :</label><br/>
          </div>
          <div className={`form-group col-xs-3 col-md-3`}>
            <input type="text" className="form-control" {...realEstGrossAmt} placeholder="Gross Amount ($)"/>
          </div>
          <div className={`form-group col-xs-6 col-md-6`}>
            <input type="text" className="form-control" {...realEstComment} placeholder="Comments..."/>
          </div>
        </div>
        <div className={`row`}>
          <div className={`form-group col-xs-3 col-md-3`}>
            <label>Other :</label><br/>
          </div>
          <div className={`form-group col-xs-3 col-md-3`}>
            <input type="text" className="form-control" {...otherGrossAmt} placeholder="Gross Amount ($)"/>
          </div>
          <div className={`form-group col-xs-6 col-md-6`}>
            <input type="text" className="form-control" {...otherComment} placeholder="Comments..."/>
          </div>
        </div>
      </div>);
    }
  }

  renderField(field) {
    const { meta: { touched, error } } = field;
    const { size } = field;
    const className = `form-group ${size} ${touched && error ? "has-danger" : ""}`;

    return (
      <div className={className}>
        <label>{field.label}</label>
        <input type="text" className="form-control" {...field.input} />
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

  render() {
    const { fields: { requestType, dealSize, tenor, category, product, sector
      , txnOverview, companyName, companyDesc, ltmRevenue, ltmEbitda, fullName
      , contactRole, email, createdById, isSponsored, region, createdByCompanyId
      , phoneNumber, expiryDt, numOfIOI}, handleSubmit } = this.props;

    return (
      <div>
        <Header />

        {this.displayCompanyDropdown()}

        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <h3>Create RFP / Request Pitch</h3>
          <br/>

          <input type="hidden" className="form-control" {...createdById} />
          <input type="hidden" className="form-control" {...createdByCompanyId} />
          <input type="hidden" className="form-control" {...numOfIOI} />



          <div className={`row`}>
            <Field
              label="Company Name"
              name="companyName"
              size="col-xs-12 col-md-12"
              component={this.renderField}
            />
          </div>


          <br/>
          <hr/>
          <h3>Company Management Contact</h3>


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
    // intializedData.isSponsored = rfp.isSponsored;
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


  return errors;
}

export default reduxForm({
  validate,
  form: 'CreateRFPForm'
})( connect(mapStateToProps, mapDispatchToProps)(CreateRFP));
