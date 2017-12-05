import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { createIOIAction, updateIOIAction } from '../actions/index';
import {Link} from 'react-router-dom';
import validator from 'validator';
import { bindActionCreators } from 'redux';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import cUtils from '../utils/common_utils';
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
    // console.log('gType :'+ gType);
    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    let rfp = lsUtils.getValue(constants.KEY_RFP_OBJECT);
    let collateral = {
            acctReceivable : {
              gross         : cUtils.parseNumber(rfp.acctRecvGrossAmt),
              ineligible    : 0,
              netCollateral : this.state.collateral ? ((100 - cUtils.parseNumber(this.state.collateral.acctReceivable.ineligible)) * (cUtils.parseNumber(rfp.acctRecvGrossAmt)) / 100) : 0,
              advRate       : 0,
              available     : this.state.collateral ? (cUtils.parseNumber(this.state.collateral.acctReceivable.netCollateral) * cUtils.parseNumber(this.state.collateral.acctReceivable.advRate) / 100) : 0,
              netEffective  : this.state.collateral ? (cUtils.parseNumber(this.state.collateral.acctReceivable.available) / (cUtils.parseNumber(rfp.acctRecvGrossAmt))) : 0
            },
            inventry : {
              gross         : cUtils.parseNumber(rfp.invtryGrossAmt),
              ineligible    : 0,
              netCollateral : this.state.collateral ? ((100 - cUtils.parseNumber(this.state.collateral.inventry.ineligible)) * (cUtils.parseNumber(rfp.invtryGrossAmt)) / 100) : 0,
              advRate       : 0,
              available     : this.state.collateral ? (cUtils.parseNumber(this.state.collateral.inventry.netCollateral) * cUtils.parseNumber(this.state.collateral.inventry.advRate) / 100) : 0,
              netEffective  : this.state.collateral ? (cUtils.parseNumber(this.state.collateral.inventry.available) / (cUtils.parseNumber(rfp.invtryGrossAmt))) : 0
            },
            ppe : {
              gross         : cUtils.parseNumber(rfp.ppeGrossAmt),
              ineligible    : 0,
              netCollateral : this.state.collateral ? ((100 - cUtils.parseNumber(this.state.collateral.ppe.ineligible)) * (cUtils.parseNumber(rfp.ppeGrossAmt)) / 100) : 0,
              advRate       : 0,
              available     : this.state.collateral ? (cUtils.parseNumber(this.state.collateral.ppe.netCollateral) * cUtils.parseNumber(this.state.collateral.ppe.advRate) / 100) : 0,
              netEffective  : this.state.collateral ? (cUtils.parseNumber(this.state.collateral.ppe.available) / (cUtils.parseNumber(rfp.ppeGrossAmt))) : 0
            },
            mae : {
              gross         : cUtils.parseNumber(rfp.maeGrossAmt),
              ineligible    : 0,
              netCollateral : this.state.collateral ? ((100 - cUtils.parseNumber(this.state.collateral.mae.ineligible)) * (cUtils.parseNumber(rfp.maeGrossAmt)) / 100) : 0,
              advRate       : 0,
              available     : this.state.collateral ? (cUtils.parseNumber(this.state.collateral.mae.netCollateral) * cUtils.parseNumber(this.state.collateral.mae.advRate) / 100) : 0,
              netEffective  : this.state.collateral ? (cUtils.parseNumber(this.state.collateral.mae.available) / (cUtils.parseNumber(rfp.maeGrossAmt))) : 0
            },
            realEst : {
              gross         : cUtils.parseNumber(rfp.realEstGrossAmt),
              ineligible    : 0,
              netCollateral : this.state.collateral ? ((100 - cUtils.parseNumber(this.state.collateral.realEst.ineligible)) * (cUtils.parseNumber(rfp.realEstGrossAmt)) / 100) : 0,
              advRate       : 0,
              available     : this.state.collateral ? (cUtils.parseNumber(this.state.collateral.realEst.netCollateral) * cUtils.parseNumber(this.state.collateral.realEst.advRate) / 100) : 0,
              netEffective  : this.state.collateral ? (cUtils.parseNumber(this.state.collateral.realEst.available) / (cUtils.parseNumber(rfp.realEstGrossAmt))) : 0
            },
            other : {
              gross         : cUtils.parseNumber(rfp.otherGrossAmt),
              ineligible    : 0,
              netCollateral : this.state.collateral ? ((100 - cUtils.parseNumber(this.state.collateral.other.ineligible)) * (cUtils.parseNumber(rfp.otherGrossAmt)) / 100) : 0,
              advRate       : 0,
              available     : this.state.collateral ? (cUtils.parseNumber(this.state.collateral.other.netCollateral) * cUtils.parseNumber(this.state.collateral.other.advRate) / 100) : 0,
              netEffective  : this.state.collateral ? (cUtils.parseNumber(this.state.collateral.other.available) / (cUtils.parseNumber(rfp.otherGrossAmt))) : 0
            }
          };
      let totalGross = cUtils.parseNumber(rfp.acctRecvGrossAmt)
        + cUtils.parseNumber(rfp.invtryGrossAmt)
        + cUtils.parseNumber(rfp.ppeGrossAmt)
        + cUtils.parseNumber(rfp.maeGrossAmt)
        + cUtils.parseNumber(rfp.realEstGrossAmt)
        + cUtils.parseNumber(rfp.otherGrossAmt);
      // console.log('collateral:'+JSON.stringify(collateral));

    this.setState({
      rfp                 : rfp,
      user                : user,
      createdById         : user.userId,
      createdByCompanyId  : company.companyId,
      collateral          : collateral,
      totalGross          : totalGross
    });

    if(gType === constants.IOI_EDIT){
      var ioi = lsUtils.getValue(constants.KEY_SELECTED_IOI_OBJECT);
      // console.log('');
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
      var ioi = lsUtils.getValue(constants.KEY_SELECTED_IOI_OBJECT);
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
  let rfp = lsUtils.getValue(constants.KEY_RFP_OBJECT);

  let intializedData = {
    user : user,
    initialValues : {
      rfpId               : rfp.rfpId,
      createdById         : user.userId,
      createdByCompanyId  : company.companyId
    }
  };

  if(gType == constants.IOI_EDIT){
    let ioi = lsUtils.getValue(constants.KEY_SELECTED_IOI_OBJECT);
    // console.log('ioi to be edited :'+JSON.stringify(ioi));

    intializedData.initialValues.maxDebtAllowed = ioi.maxDebtAllowed;
    intializedData.initialValues.loanSize = ioi.loanSize;
    intializedData.initialValues.tranche = ioi.tranche;
    intializedData.initialValues.loanStructure = ioi.loanStructure;
    intializedData.initialValues.cashInterest = ioi.cashInterest;
    intializedData.initialValues.pikIntreset = ioi.pikIntreset;
    intializedData.initialValues.liborFloor = ioi.liborFloor;
    intializedData.initialValues.maturity = ioi.maturity;
    intializedData.initialValues.year1 = ioi.year1;
    intializedData.initialValues.year2 = ioi.year2;
    intializedData.initialValues.year3 = ioi.year3;
    intializedData.initialValues.year4 = ioi.year4;
    intializedData.initialValues.year5  = ioi.year5;
    intializedData.initialValues.upfrontFee = ioi.upfrontFee;
    intializedData.initialValues.governance = ioi.governance;
    intializedData.initialValues.warrants = ioi.warrants;
    intializedData.initialValues.covenants = ioi.covenants;
    intializedData.initialValues.rfpId = ioi.rfpId;
    intializedData.initialValues.createdById = ioi.createdById;
    intializedData.initialValues.createdByCompanyId = ioi.createdByCompanyId;
    intializedData.initialValues.cpYear1 = ioi.cpYear1 ? ioi.cpYear1 : 0;
    intializedData.initialValues.cpYear2 = ioi.cpYear2 ? ioi.cpYear2 : 0;
    intializedData.initialValues.cpYear3 = ioi.cpYear3 ? ioi.cpYear3 : 0;
    intializedData.initialValues.cpYear4 = ioi.cpYear4 ? ioi.cpYear4 : 0;
    intializedData.initialValues.cpYear5  = ioi.cpYear5 ? ioi.cpYear5 : 0;

  } else {
    intializedData.initialValues.maxDebtAllowed = 0;
    intializedData.initialValues.loanSize = 0;
    intializedData.initialValues.tranche = 'N/A';
    intializedData.initialValues.loanStructure = 'N/A';
    intializedData.initialValues.cashInterest = 0;
    intializedData.initialValues.pikIntreset = 0;
    intializedData.initialValues.liborFloor = 0;
    intializedData.initialValues.maturity = 0;
    intializedData.initialValues.year1 = 0;
    intializedData.initialValues.year2 = 0;
    intializedData.initialValues.year3 = 0;
    intializedData.initialValues.year4 = 0;
    intializedData.initialValues.year5  = 0;
    intializedData.initialValues.upfrontFee = 0;
    intializedData.initialValues.governance = 'N/A';
    intializedData.initialValues.warrants = 'N/A';
    intializedData.initialValues.covenants = 'Other';
    // intializedData.initialValues.rfpId = '0';
    // intializedData.initialValues.createdById = '0';
    // intializedData.initialValues.createdByCompanyId = '0';
    intializedData.initialValues.cpYear1 = 0;
    intializedData.initialValues.cpYear2 = 0;
    intializedData.initialValues.cpYear3 = 0;
    intializedData.initialValues.cpYear4 = 0;
    intializedData.initialValues.cpYear5  = 0;

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
    updateIOIAction : updateIOIAction
  }, dispatch);
}

export default reduxForm({
  'form': 'CreateIOIForm',
  validate
}) (connect(mapStateToProps, mapDispatchToProps)(CreateIOIForm));