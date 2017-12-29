import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { createIOIAction, updateIOIAction, fetchIOIAction, fetchRFPByIOIAction, fetchRFPAction } from '../actions/index';
import {Link} from 'react-router-dom';
import validator from 'validator';
import { bindActionCreators } from 'redux';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import cUtils from '../utils/common_utils';
import ioiUtils from '../utils/ioi_utils';
import NavBar from './sidebar';
import NumberFormat from 'react-number-format';
import Select from 'react-select';
import Header from './header';
import { connect } from "react-redux";

var gType=null;
const trancheOptions = ['Delayed Draw', 'Accordion', 'Fixed Asset Subline', 'Uni-Tranche', 'Multi-Tranche', 'None'];
const loanStructOptions= ['ABL-Revolver', 'ABL-Term Loan', 'ABL-Both', 'CashFlow-Revolver', 'CashFlow-Term Loan', 'CashFlow-Both', '2nd Lien Term Loan', 'Sub Debt', 'Mezzanine'];
const governanceOptions = ['YES', 'NO'];
class CreateIOIForm extends Component{

  constructor(props){
    super(props);
    this.state = {
      user : null,
      rfp : null,
      type : props.match.params.type,
      selectedCovenant: [],
      collateral : null,
      totalAvailable : 0,
      totalGross : 0
    };
  }

  renderDropdownField(field) {
    const { meta: { touched, error } } = field;
    const { size } = field;
    const className = `form-group ${size} ${touched && error ? "has-danger" : ""}`;

    return (
      <span className={className}>
        <label>{field.label}</label>
        <select className="form-control" {...field.input}>
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
		const className = `form-group ${size} ${touched && error ? "has-danger" : ""}`;
		// console.log('className:'+JSON.stringify(className));
		// console.log('field:'+JSON.stringify(field));
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

  componentWillMount() {
    gType = this.props.match.params.type;
    let paramId = this.props.match.params.id;

    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);

    if(gType === constants.IOI_EDIT){
      // when gType === edit, paramId = ioiId
      this.props.fetchIOIAction(paramId);
      this.props.fetchRFPByIOIAction(paramId);
    } else if(gType === constants.IOI_NEW){
      // when gType === new, paramId = rfpId
      this.props.fetchRFPAction(paramId);
    }
    
    this.setState({
      user                : user,
      createdById         : user.userId,
      createdByCompanyId  : company.companyId
    });
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.rfp){
      let collateral = ioiUtils.getCollataralArr(nextProps.rfp, this.state.collateral);
      let totalGross = ioiUtils.getTotalGross(nextProps.rfp);        
      this.setState({
        rfp : rfp,
        collateral : collateral,
        totalGross : totalGross
      });
    }

    if(nextProps.ioi){
      this.setState({
        ioi : ioi
      });
    }
  }

  onSubmit(props){
    // <input type="hidden" className="form-control" {...rfpId} />
    // <input type="hidden" className="form-control" {...createdById} />
    // <input type="hidden" className="form-control" {...createdByCompanyId} />

    // console.log('createIOIAction:'+JSON.stringify(props));
    if(gType === constants.IOI_EDIT){
      let ioi = this.state.ioi;
      props.ioiId = ioi.ioiId;
      props.createdById = this.state.createdById;
      // below 2 may not be nessary
      props.rfpId = this.state.rfp.rfpId;
      props.createdByCompanyId = this.state.createdByCompanyId;

      this.props.updateIOIAction(props)
        .then(() => {
          // blog post has been created, navigate the user to the index
          // We navigate by calling this.context.router.push with the
          // new path to navigate to.
          this.props.history.push(constants.ROUTES_MAP.RFP_MARKETPLACE);
      });
    } else {
      // console.log('will call createIOIAction :'+JSON.stringify(props));
      // props.ioiId = ioi.ioiId;
      props.rfpId = this.state.rfp.rfpId;
      props.createdById = this.state.createdById;
      props.createdByCompanyId = this.state.createdByCompanyId;
      props.forCompanyId = this.state.rfp.createdByCompanyId;
      
      this.props.createIOIAction(props)
       .then(() => {
         // blog post has been created, navigate the user to the index
         // We navigate by calling this.context.router.push with the
         // new path to navigate to.
         this.props.history.push(constants.ROUTES_MAP.RFP_MARKETPLACE);
       });
     }
	}

  displayRFPSummary(){
    if(gType === constants.IOI_EDIT || gType === constants.IOI_NEW){
      return (
        <div>
          <h4>RFP Details : </h4>
          <br/>
          {this.state.rfp.companyDesc}
          <br/>
          <br/>
          {this.state.rfp.txnOverview}
          <br/>
          <br/>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>Sector: {this.state.rfp.sector}</td>
                <td>Deal Size : {this.state.rfp.dealSize} &nbsp; {cUtils.getDisplayValue(this.state.rfp.product)}</td>
              </tr>
              <tr>
                <td>LTM Revenue : <NumberFormat value={this.state.rfp.ltmRevenue} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
                <td>LTM EBITDA:<NumberFormat value={this.state.rfp.ltmEbitda} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  }

  displaySubtitle(){
    if(gType === constants.IOI_EDIT || gType === constants.IOI_NEW){
      return (
        <div>
          <h4>Indication of Interest</h4>
          <br/>
        </div>
      );
    } else {
      <div>
        <h4>Make a Pitch</h4>
        <br/>
      </div>
    }
  }

  onSelectCovenant(option) {
      // console.log('You selected '+JSON.stringify(option));
      this.setState({
        selectedCovenant: this.state.selectedCovenant.push(option)
      });
    }

  onChangeCollateralValue(element, field, event){
    // console.log('In onChangeCollateralValue, field:'+field+', value:'+event.target.value);
    var updValue = this.state.collateral;
    updValue[element][field] = event.target.value;

    // re-calculate the
    if(field === 'ineligible'){
      updValue[element]['netCollateral'] = (100 - cUtils.parseNumber(event.target.value)) * (cUtils.parseNumber(updValue[element]['gross'])) / 100;
    }
    updValue[element]['available'] = cUtils.parseNumber(updValue[element]['netCollateral']) * cUtils.parseNumber(updValue[element]['advRate']) / 100;
    updValue[element]['netEffective'] = cUtils.parseNumber(updValue[element]['available']) / (cUtils.parseNumber(updValue[element]['gross']));

    // console.log('updValue:'+JSON.stringify(updValue));

    this.setState({
      collateral: updValue,
      totalAvailable : this.state.totalAvailable + updValue[element]['available']
    });
  }

  displayCollateralAnalysis(){
    // console.log('I am in displayCollateralAnalysis');
    // console.log('thisValue:'+JSON.stringify(thisValue));
    var rfp = this.state.rfp;
    if(rfp && rfp.category.toUpperCase() === 'ABL'){
      // console.log('rfp:'+JSON.stringify(rfp));
      return(<div>
        <h3>Borrowing Base</h3>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Gross</th>
              <th>Ineligible %</th>
              <th>Net Collateral</th>
              <th>Advance Rate</th>
              <th>Availabe</th>
              <th>Net Eff Adv Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Accounts Receivable</td>
              <td>
                <NumberFormat value={this.state.collateral.acctReceivable.gross} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </td>
              <td>
                <Field
  		            name="acctRecvIneligiblePercent"
  		            component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'acctReceivable', 'ineligible')}
  		          />
              </td>
              <td>
                <NumberFormat value={this.state.collateral.acctReceivable.netCollateral} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </td>
              <td>
                <Field
                  name="acctRecvAdvRate"
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'acctReceivable', 'advRate')}
                />
              </td>
              <td>
                <NumberFormat value={this.state.collateral.acctReceivable.available} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </td>
              <td>
                <NumberFormat value={this.state.collateral.acctReceivable.netEffective * 100} displayType={'text'} thousandSeparator={true} suffix={'%'} d/>
              </td>
            </tr>
            <tr>
              <td>Inventory</td>
              <td>
                <NumberFormat value={this.state.collateral.inventry.gross} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </td>
              <td>
                <Field
                  name="invtryIneligiblePercent"
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'inventry', 'ineligible')}
                />
              </td>
              <td>
                <NumberFormat value={this.state.collateral.inventry.netCollateral} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </td>
              <td>
                <Field
                  name="invtryAdvRate"
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'inventry', 'advRate')}
                />
              </td>
              <td>
                <NumberFormat value={this.state.collateral.inventry.available} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </td>
              <td>
                <NumberFormat value={this.state.collateral.inventry.netEffective * 100} displayType={'text'} thousandSeparator={true} suffix={'%'} />
              </td>
            </tr>
            <tr>
              <td>PP&E</td>
              <td>
                <NumberFormat value={this.state.collateral.ppe.gross} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </td>
              <td>
                <Field
                  name="ppeIneligiblePercent"
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'ppe', 'ineligible')}
                />
              </td>
              <td>
                <NumberFormat value={this.state.collateral.ppe.netCollateral} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </td>
              <td>
                <Field
                  name="ppeAdvRate"
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'ppe', 'advRate')}
                />
              </td>
              <td>
                <NumberFormat value={this.state.collateral.ppe.netCollateral} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </td>
              <td>
                <NumberFormat value={this.state.collateral.ppe.netEffective * 100} displayType={'text'} thousandSeparator={true} suffix={'%'} />
              </td>
            </tr>
            <tr>
              <td>Machinery & Equipment :</td>
              <td>
                <NumberFormat value={this.state.collateral.mae.gross} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </td>
              <td>
                <Field
                  name="maeIneligiblePercent"
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'mae', 'ineligible')}
                />
              </td>
              <td>
                <NumberFormat value={this.state.collateral.mae.netCollateral} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </td>
              <td>
                <Field
                  name="maeAdvRate"
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'mae', 'advRate')}
                />
              </td>
              <td>
                <NumberFormat value={this.state.collateral.mae.available} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </td>
              <td>
                <NumberFormat value={this.state.collateral.mae.netEffective * 100} displayType={'text'} thousandSeparator={true} suffix={'%'} />
              </td>
            </tr>
            <tr>
              <td>Real Estate</td>
              <td>
                <NumberFormat value={this.state.collateral.realEst.gross} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </td>
              <td>
                <Field
                  name="realEstIneligiblePercent"
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'realEst', 'ineligible')}
                />
              </td>
              <td>
                <NumberFormat value={this.state.collateral.realEst.netCollateral} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </td>
              <td>
                <Field
                  name="realEstAdvRate"
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'realEst', 'advRate')}
                />
              </td>
              <td>
                <NumberFormat value={this.state.collateral.realEst.available} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </td>
              <td>
                <NumberFormat value={this.state.collateral.realEst.netEffective * 100} displayType={'text'} thousandSeparator={true} suffix={'%'} />
              </td>
            </tr>
            <tr>
              <td>Other</td>
              <td>
                <NumberFormat value={this.state.collateral.other.gross} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </td>
              <td>
                <Field
                  name="otherIneligiblePercent"
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'other', 'ineligible')}
                />
              </td>
              <td>
                <NumberFormat value={this.state.collateral.other.netCollateral} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </td>
              <td>
                <Field
                  name="otherAdvRate"
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'other', 'advRate')}
                />
              </td>
              <td>
                <NumberFormat value={this.state.collateral.other.available} displayType={'text'} thousandSeparator={true} prefix={'$'} />
              </td>
              <td>
                <NumberFormat value={this.state.collateral.other.netEffective * 100} displayType={'text'} thousandSeparator={true} suffix={'%'} />
              </td>
            </tr>
            <tr>
              <td><b>Total</b></td>
              <td><b><NumberFormat value={this.state.totalGross} displayType={'text'} thousandSeparator={true} prefix={'$'} /></b></td>
              <td></td>
              <td></td>
              <td></td>
              <td><b><NumberFormat value={this.state.totalAvailable} displayType={'text'} thousandSeparator={true} prefix={'$'} /></b></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>);
    }
  }

  render(){
    // console.log('I am in create IOI');
    const {handleSubmit} = this.props;

      const covenantsOptions = [
        {value: 'Max Senior Leverage', label: 'Max Senior Leverage'},
        {value: 'Max Total Leverage', label: 'Max Total Leverage'},
        {value: 'Minimum EBITDA', label: 'Minimum EBITDA'},
        {value: 'Minimum Revenue', label: 'Minimum Revenue'},
        {value: 'Minimum Recurring Revenue', label: 'Minimum Recurring Revenue'},
        {value: 'Minimum Interest Coverage', label: 'Minimum Interest Coverage'},
        {value: 'Fixed Charge Coverage', label: 'Fixed Charge Coverage'},
        {value: 'Springing Fixed Charge Coverage', label: 'Springing Fixed Charge Coverage'},
        {value: 'Minimum Liquidity', label: 'Minimum Liquidity'},
        {value: 'Minimum Excess Availability', label: 'Minimum Excess Availability'},
        {value: 'Other', label: 'Other'}
      ];

      // console.log('this.state.selectedCovenants:'+JSON.stringify(this.state.selectedCovenant));

      // <div className={`row`}>
      //   <label>Covenants</label>
      //   <Select multi={true} simpleValue={true} value={this.state.selectedCovenant} options={covenantsOptions} onChange={this.onSelectCovenant.bind(this)} />
      // </div>
      // <br/>

    return(
      <div>
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>

              {this.displayRFPSummary()}
              <br/>

              {this.displayCollateralAnalysis()}
              <br/>

              {this.displaySubtitle()}
              <br/>

              <div className={`row`}>
                <Field
                  name="maxDebtAllowed"
                  label="Maximum Debt Allowed"
                  size="col-xs-6 col-md-6"
                  component={this.renderField}
                />
                <Field
                  name="loanSize"
                  label="Loan Size"
                  size="col-xs-6 col-md-6"
                  component={this.renderField}
                />
              </div>

              <div className={`row`}>
                <Field
                  label="Tranche? (e.g. Delayed Draw)"
                  name="tranche"
                  size="col-xs-6 col-md-6"
                  component={this.renderDropdownField}
                  dpField={trancheOptions}
                />
                <Field
                  label="Loan Structure"
                  name="loanStructure"
                  size="col-xs-6 col-md-6"
                  component={this.renderDropdownField}
                  dpField={loanStructOptions}
                />
              </div>

              <div className={`row`}>
                <Field
                  name="maturity"
                  label="Maturity (years)"
                  size="col-xs-6 col-md-6"
                  component={this.renderField}
                />
                <Field
                  name="upfrontFee"
                  label="OID / Upfront Fee (%)"
                  size="col-xs-6 col-md-6"
                  component={this.renderField}
                />
              </div>

              <div className={`row`}>
                <Field
                  label="Governance"
                  name="governance"
                  size="col-xs-6 col-md-6"
                  component={this.renderDropdownField}
                  dpField={governanceOptions}
                />

                <Field
                  label="Warrants"
                  name="warrants"
                  size="col-xs-6 col-md-6"
                  component={this.renderDropdownField}
                  dpField={governanceOptions}
                />
              </div>
              <br/>

              <div className={`row`}>
                <Field
                  name="covenants"
                  label="Covenants"
                  size="col-xs-12 col-md-12"
                  component={this.renderField}
                  placeholder={constants.COVENANTS_SAMPLE}
                />
              </div>

              <div className={`row`}>
                <fieldset className="form-group col-xs-3 col-md-3 scheduler-border">
                  <legend className="scheduler-border">Loan Pricing(%)</legend>
                  <Field
                    name="cashInterest"
                    label="Cash Interest"
                    component={this.renderField}
                  />
                  <br/>
                  <Field
                    name="pikIntreset"
                    label="PIK Interest"
                    component={this.renderField}
                  />
                  <br/>
                  <Field
                    name="liborFloor"
                    label="LIBOR Floor"
                    component={this.renderField}
                  />
                </fieldset>

                <div className={`form-group col-xs-1 col-md-1`}>
                </div>

                <fieldset className="form-group col-xs-3 col-md-3 scheduler-border">
                  <legend className="scheduler-border">Amortization (%)</legend>
                  <Field
                    name="year1"
                    label="Year 1"
                    component={this.renderField}
                  />
                  <br/>
                  <Field
                    name="year2"
                    label="Year 2"
                    component={this.renderField}
                  />
                  <br/>
                  <Field
                    name="year3"
                    label="Year 3"
                    component={this.renderField}
                  />
                  <br/>
                  <Field
                    name="year4"
                    label="Year 4"
                    component={this.renderField}
                  />
                  <br/>
                  <Field
                    name="year5"
                    label="Year 5"
                    component={this.renderField}
                  />
                </fieldset>

                <div className={`form-group col-xs-1 col-md-1`}>
                </div>

                <fieldset className="form-group col-xs-3 col-md-3 scheduler-border">
                  <legend className="scheduler-border">Call Protection(%)</legend>
                  <Field
                    name="cpYear1"
                    label="Year 1"
                    component={this.renderField}
                  />
                  <br/>
                  <Field
                    name="cpYear2"
                    label="Year 2"
                    component={this.renderField}
                  />
                  <br/>
                  <Field
                    name="cpYear3"
                    label="Year 3"
                    component={this.renderField}
                  />
                  <br/>
                  <Field
                    name="cpYear4"
                    label="Year 4"
                    component={this.renderField}
                  />
                  <br/>
                  <Field
                    name="cpYear5"
                    label="Year 5"
                    component={this.renderField}
                  />
                </fieldset>
              </div>
              <br/>
              <br/>

              <div className={`row`}>
                <button type="submit" className="btn btn-primary">SUBMIT</button>&nbsp;&nbsp;
                <Link to="/rfpMarketPlace" className="btn btn-danger">Cancel</Link>
              </div>

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
  let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
  let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);

  let intializedData = {
    user : user,
    initialValues : {
      createdById         : user.userId,
      createdByCompanyId  : company.companyId
    }
  };

  if(state.ioiList.ioi){
    intializedData.ioi = state.ioiList.ioi[0];
  }

  if(state.rfpList.rfpList){
    intializedData.rfp = state.rfpList.rfpList[0];
  }

  return intializedData;
}

function validate(values){
  // console.log('values:'+JSON.stringify(values));
  const errors={};

  if(!values.loanSize || values.loanSize == 0){
    errors.loanSize='Enter value of loan size';
  }

  if(!values.loanStructure || values.loanStructure === 'N/A'){
    errors.loanStructure='Enter value for loan structure';
  }

  if(!values.cashInterest){
    errors.cashInterest='Enter value for cash interest';
  }

  if(!values.pikIntreset){
    errors.pikIntreset='Enter value for PIK interest';
  }

  if(!values.liborFloor ){
    errors.liborFloor='Enter value for LIBOR floor';
  }

  if(!values.maturity || values.maturity == 0){
    errors.maturity='Enter value for maturity';
  }

  if(!values.upfrontFee){
    errors.upfrontFee='Enter value for upfront fee';
  }

	if(!values.covenants || values.covenants === 'N/A'){
    errors.covenants='Enter value for covenants';
  }

  return errors;
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    createIOIAction   : createIOIAction,
    updateIOIAction : updateIOIAction,
    fetchIOIAction : fetchIOIAction,
    fetchRFPByIOIAction : fetchRFPByIOIAction,
    fetchRFPAction : fetchRFPAction
  }, dispatch);
}

export default reduxForm({
  'form': 'CreateIOIForm',
  validate
}) (connect(mapStateToProps, mapDispatchToProps)(CreateIOIForm));