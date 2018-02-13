import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { createIOIAction, deleteIOIAction, updateIOIAction, fetchIOIAction, fetchRFPByIOIAction, sendAMsgFromAdminWithCompanyId } from '../actions/index';
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
import { ToastContainer, toast } from 'react-toastify';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const trancheOptions = ['Delayed Draw', 'Accordion', 'Fixed Asset Subline', 'Uni-Tranche', 'Multi-Tranche', 'None'];
const loanStructOptions= ['ABL-Revolver', 'ABL-Term Loan', 'ABL-Both', 'CashFlow-Revolver', 'CashFlow-Term Loan', 'CashFlow-Both', '2nd Lien Term Loan', 'Sub Debt', 'Mezzanine'];
const governanceOptions = ['Yes', 'No'];
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

class EditIOIForm extends Component{

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
    let that = this;
    let paramId = this.props.match.params.id;

    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    this.props.fetchIOIAction(paramId)
    .then(data => {
      if(data.payload.status === 200 && data.payload.data.status === 'SUCCESS'){
        let ioiList = data.payload.data.data.Items;
        if(Array.isArray(ioiList) && ioiList.length > 1){
          that.setState({
            displayTwoLoanStructures : true
          });
        }
      }
    });
    this.props.fetchRFPByIOIAction(paramId);

    this.setState({
      user    : user,
      company : company,
      displayCollateralAnalysis : false,
      displayTwoLoanStructures : false
    });
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.rfp){
      let collateral = ioiUtils.getCollataralArr(nextProps.rfp, this.state.collateral);
      let totalGross = ioiUtils.getTotalGross(nextProps.rfp);

      this.setState({
        collateral : collateral,
        totalGross : totalGross
      });
    }
  }

  onSubmit(props){
    let that = this;

    props.rfpId = this.props.rfp.rfpId;
    props.createdById = this.state.user.userId;
    props.createdByCompanyId = this.state.company.companyId;
    props.ioiId = this.props.ioi.ioiId;
    props.forCompanyId = this.props.rfp.createdByCompanyId;
    props.createdByContactId = this.state.user.contactId;

    if(this.state.displayTwoLoanStructures){
      // copy props into 2 diffrent datastructures
      let props_1 = {}, props_2 = {};
      let keys = Object.keys(props);
      for(let i=0; i<keys.length; i++){        
        if(keys[i].indexOf("_1") >= 0){
          let eKey = keys[i].substr(0, keys[i].length-2);
          props_1[eKey] = props[keys[i]];
          delete props[keys[i]];
        } else if(keys[i].indexOf("_2") >= 0){
          let eKey = keys[i].substr(0, keys[i].length-2);
          props_2[eKey] = props[keys[i]];
          delete props[keys[i]];
        }
      }
      // populate Id's
      props_1.rfpId = this.props.rfp.rfpId;
      props_1.createdById = this.state.user.userId;
      props_1.createdByCompanyId = this.state.company.companyId;
      props_1.forCompanyId = this.props.rfp.createdByCompanyId;
      props_1.createdByContactId = this.state.user.contactId;

      props_2.rfpId = this.props.rfp.rfpId;
      props_2.createdById = this.state.user.userId;
      props_2.createdByCompanyId = this.state.company.companyId;
      props_2.forCompanyId = this.props.rfp.createdByCompanyId;
      props_2.createdByContactId = this.state.user.contactId;

      props.childIOIList = [props_1, props_2];
    } else {
      let keys = Object.keys(props);      
      for(let key of keys){
        if(key.indexOf("_1") >= 0){
          let eKey = key.substr(0, key.length-2);
          if(eKey !== 'loanStructure'){ // this is an exception
            props[eKey] = props[key];
          }
          delete props[key];
        }
      }
    }

    let updateDBData = false;
    // find if any fields changed and then set the flags
    if(this.state.displayTwoLoanStructures){

      if(this.isValuesUpdated(props.childIOIList[0], "_1")){
        props.childIOIList[0].updateData = true;
        updateDBData = true;
      } else {
        props.childIOIList[0].updateData = false;
      }

      if(this.isValuesUpdated(props.childIOIList[1], "_2")){
        props.childIOIList[1].updateData = true;
        updateDBData = true;
      } else {
        props.childIOIList[1].updateData = false;
      }

      if(props.loanStructure !== this.props.initialValues.loanStructure
        || updateDBData){
        props.updateData = true;
        updateDBData = true;
      }
    } else {
      // there is only 1 IOI, so just check the main props
      if(this.isValuesUpdated(props, "_1")
        || props.loanStructure !== this.props.initialValues.loanStructure){
        props.updateData = true;
        updateDBData = true;
      } else {
        props.updateData = false;
      }      
    }

    
    if(updateDBData){
      if(this.props.ioi.childIOIList && !props.childIOIList){
        // initially there were 2 IOI's, now has only 1 IOI
        // delete the first one and create a new one
        this.props.deleteIOIAction(this.props.ioi.ioiId);
        this.props.deleteIOIAction(this.props.ioi.childIOIList[0]);
        this.props.deleteIOIAction(this.props.ioi.childIOIList[1]);
        // use the id of the parent IOI which got deleted, since it may have links to other things
        props.ioiId=this.props.ioi.ioiId;
        this.props.createIOIAction(props)
        .then(data => that.sendMsgsAndRedirect( data
          , that.props.ioi.ioiId
          , that.state.user.companyId
          , that.props.rfp.createdByCompanyId)
        );
      } else if(!this.props.ioi.childIOIList && props.childIOIList){
        // initially there was 1 IOI, now has 2 IOI's
        // delete the first one and create 3 new one's
        this.props.deleteIOIAction(this.props.ioi.ioiId);
        // use the id of the parent IOI which got deleted, since it may have links to other things
        props.ioiId=this.props.ioi.ioiId;
        this.props.createIOIAction(props)
        .then(data => that.sendMsgsAndRedirect( data
          , that.props.ioi.ioiId
          , that.state.user.companyId
          , that.props.rfp.createdByCompanyId)
        );
      } else {
        // initially there were 2 and now we have 2
        this.props.updateIOIAction(props)  
        .then(data => that.sendMsgsAndRedirect( data
          , that.props.ioi.ioiId
          , that.state.user.companyId
          , that.props.rfp.createdByCompanyId)
        );
      }
    } else {
      that.props.history.push({
        pathname : constants.ROUTES_MAP.RFP_MARKETPLACE,
        state : constants.NOTIFICATIONS.EDIT_IOI_SUCCESS
      });
    }
  }
  
  sendMsgsAndRedirect(data, ioiId, lCompanyId, bCompanyId){
    if(data.payload.status === 200 && data.payload.data.status === 'SUCCESS'){
      // send a msg to lender's company
      let lProps = {
        companyId : lCompanyId,
        msg : constants.MESSAGES.IOI_EDITED,
        ID : ioiId
      };
      this.props.sendAMsgFromAdminWithCompanyId(lProps);

      // now send msg to the borrower's company
      let bProps={
        companyId : bCompanyId,
        msg : constants.MESSAGES.IOI_EDITED,
        ID : ioiId
      };
      this.props.sendAMsgFromAdminWithCompanyId(bProps);

      this.props.history.push({
        pathname : constants.ROUTES_MAP.RFP_MARKETPLACE,
        state : constants.NOTIFICATIONS.EDIT_IOI_SUCCESS
      });
    } else {
      toast(constants.NOTIFICATIONS.EDIT_IOI_FAILED, {
        className : "notification-error"
      });
    }    
  }

  isValuesUpdated(ioi, suffix){
    if(ioi.maxDebtAllowed !== this.props.initialValues['maxDebtAllowed'+suffix]
      || ioi.loanSize !== this.props.initialValues['loanSize'+suffix]
      || ioi.tranche !== this.props.initialValues['tranche'+suffix]
      || ioi.loanStructure !== this.props.initialValues['loanStructure'+suffix]
      || ioi.maturity !== this.props.initialValues['maturity'+suffix]
      || ioi.upfrontFee !== this.props.initialValues['upfrontFee'+suffix]
      || ioi.governance !== this.props.initialValues['governance'+suffix]
      || ioi.warrants !== this.props.initialValues['warrants'+suffix]
      || ioi.covenants !== this.props.initialValues['covenants'+suffix]
      || ioi.cashInterest !== this.props.initialValues['cashInterest'+suffix]
      || ioi.pikIntreset !== this.props.initialValues['pikIntreset'+suffix]
      || ioi.liborFloor !== this.props.initialValues['liborFloor'+suffix]
      || ioi.year1 !== this.props.initialValues['year1'+suffix]
      || ioi.year2 !== this.props.initialValues['year2'+suffix]
      || ioi.year3 !== this.props.initialValues['year3'+suffix]
      || ioi.year4 !== this.props.initialValues['year4'+suffix]
      || ioi.year5 !== this.props.initialValues['year5'+suffix]
    )
    return true;
    return false;
  }

  displayRFPSummary(){
    if(this.props.rfp){
      return (
        <div>
          <h4>Related RFP Details : </h4>
          {this.props.rfp.companyDesc}
          <br/>
          <br/>
          {this.props.rfp.txnOverview}
          <br/>
          <br/>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>Sector: {this.props.rfp.sector}</td>
                <td>Deal Size : {this.props.rfp.dealSize} &nbsp; {cUtils.getDisplayValue(this.props.rfp.product)}</td>
              </tr>
              <tr>
                <td>LTM Revenue : {cUtils.formatCurrencyToDisplay(this.props.rfp.ltmRevenue)}</td>
                <td>LTM EBITDA : {cUtils.formatCurrencyToDisplay(this.props.rfp.ltmEbitda)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  }

  onSelectCovenant(option) {
      this.setState({
        selectedCovenant: this.state.selectedCovenant.push(option)
      });
    }

  onChangeCollateralValue(element, field, event){
    var updValue = this.state.collateral;
    updValue[element][field] = event.target.value;

    // re-calculate the
    if(field === 'ineligible'){
      updValue[element]['netCollateral'] = (100 - cUtils.parseNumber(event.target.value)) * (cUtils.parseNumber(updValue[element]['gross'])) / 100;
    }
    updValue[element]['available'] = cUtils.parseNumber(updValue[element]['netCollateral']) * cUtils.parseNumber(updValue[element]['advRate']) / 100;
    updValue[element]['netEffective'] = cUtils.parseNumber(updValue[element]['available']) / (cUtils.parseNumber(updValue[element]['gross']));

    this.setState({
      collateral: updValue,
      totalAvailable : this.state.totalAvailable + updValue[element]['available']
    });
  }

  displayCollateralAnalysis(suffix){
    var rfp = this.props.rfp;
    if(rfp){
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
                {cUtils.formatCurrencyToDisplay(this.state.collateral.acctReceivable.gross)}
              </td>
              <td>
                <Field
  		            name={"acctRecvIneligiblePercent"+suffix}
  		            component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'acctReceivable', 'ineligible')}
  		          />
              </td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.acctReceivable.netCollateral)}
              </td>
              <td>
                <Field
                  name={"acctRecvAdvRate"+suffix}
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'acctReceivable', 'advRate')}
                />
              </td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.acctReceivable.available)}
              </td>
              <td>
                {cUtils.formatPercentToDisplay(this.state.collateral.acctReceivable.netEffective * 100)}
              </td>
            </tr>
            <tr>
              <td>Inventory</td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.inventry.gross)}
              </td>
              <td>
                <Field
                  name={"invtryIneligiblePercent"+suffix}
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'inventry', 'ineligible')}
                />
              </td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.inventry.netCollateral)}
              </td>
              <td>
                <Field
                  name={"invtryAdvRate"+suffix}
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'inventry', 'advRate')}
                />
              </td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.inventry.available)}
              </td>
              <td>
                {cUtils.formatPercentToDisplay(this.state.collateral.inventry.netEffective * 100)}
              </td>
            </tr>
            <tr>
              <td>PP&E</td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.ppe.gross)}
              </td>
              <td>
                <Field
                  name={"ppeIneligiblePercent"+suffix}
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'ppe', 'ineligible')}
                />
              </td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.ppe.netCollateral)}
              </td>
              <td>
                <Field
                  name={"ppeAdvRate"+suffix}
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'ppe', 'advRate')}
                />
              </td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.ppe.netCollateral)}
              </td>
              <td>
                {cUtils.formatPercentToDisplay(this.state.collateral.ppe.netEffective * 100)}
              </td>
            </tr>
            <tr>
              <td>Machinery & Equipment :</td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.mae.gross)}
              </td>
              <td>
                <Field
                  name={"maeIneligiblePercent"+suffix}
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'mae', 'ineligible')}
                />
              </td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.mae.netCollateral)}
              </td>
              <td>
                <Field
                  name={"maeAdvRate"+suffix}
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'mae', 'advRate')}
                />
              </td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.mae.available)}
              </td>
              <td>
                {cUtils.formatPercentToDisplay(this.state.collateral.mae.netEffective * 100)}
              </td>
            </tr>
            <tr>
              <td>Real Estate</td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.realEst.gross)}
              </td>
              <td>
                <Field
                  name={"realEstIneligiblePercent"+suffix}
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'realEst', 'ineligible')}
                />
              </td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.realEst.netCollateral)}
              </td>
              <td>
                <Field
                  name={"realEstAdvRate"+suffix}
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'realEst', 'advRate')}
                />
              </td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.realEst.available)}
              </td>
              <td>
                {cUtils.formatPercentToDisplay(this.state.collateral.realEst.netEffective * 100)}
              </td>
            </tr>
            <tr>
              <td>Other</td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.other.gross)}
              </td>
              <td>
                <Field
                  name={"otherIneligiblePercent"+suffix}
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'other', 'ineligible')}
                />
              </td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.other.netCollateral)}
              </td>
              <td>
                <Field
                  name={"otherAdvRate"+suffix}
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'other', 'advRate')}
                />
              </td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.other.available)}
              </td>
              <td>
                {cUtils.formatPercentToDisplay(this.state.collateral.other.netEffective * 100)}
              </td>
            </tr>
            <tr>
              <td><b>Total</b></td>
              <td><b>{cUtils.formatCurrencyToDisplay(this.state.totalGross)}</b></td>
              <td></td>
              <td></td>
              <td></td>
              <td><b>{cUtils.formatCurrencyToDisplay(this.state.totalAvailable)}</b></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>);
    }
  }

  flipDisplayCollateralAnalysis(){
    this.setState({
      displayCollateralAnalysis : !this.state.displayCollateralAnalysis
    });
  }

  displayStructureFor2Loans(suffix){
    if(this.state.displayTwoLoanStructures){
      return(<span>
        <div className={`row`}>
          <Field
            label="Tranche? (e.g. Delayed Draw)"
            name={"tranche"+suffix}
            size="col-xs-6 col-md-6"
            component={this.renderDropdownField}
            dpField={trancheOptions}
          />
          <Field
            label="Loan Structure"
            name={"loanStructure"+suffix}
            size="col-xs-6 col-md-6"
            component={this.renderDropdownField}
            dpField={loanStructOptions}
            />
        </div>

        <div className={`row`}>
          <Field
            name={"maturity"+suffix}
            label="Maturity (years)"
            size="col-xs-6 col-md-6"
            component={this.renderField}
          />
          <Field
            name={"upfrontFee"+suffix}
            label="OID / Upfront Fee (%)"
            size="col-xs-6 col-md-6"
            component={this.renderField}
          />
        </div>        
        </span>);
    } else {
      // there is only 1 IOI
      return (
        <div className={`row`}>
          <Field
            label="Tranche? (e.g. Delayed Draw)"
            name={"tranche"+suffix}
            size="col-xs-4 col-md-4"
            component={this.renderDropdownField}
            dpField={trancheOptions}
          />
          <Field
            name={"maturity"+suffix}
            label="Maturity (years)"
            size="col-xs-4 col-md-4"
            component={this.renderField}
          />
          <Field
            name={"upfrontFee"+suffix}
            label="OID / Upfront Fee (%)"
            size="col-xs-4 col-md-4"
            component={this.renderField}
          />
        </div>
      )
    }
  }  

  displayIOIFields(suffix){
    return(<div>
      {
        this.state.displayCollateralAnalysis 
        ? <a href="#" onClick={this.flipDisplayCollateralAnalysis.bind(this)}> Hide Collateral Analysis</a> 
        : <a href="#" onClick={this.flipDisplayCollateralAnalysis.bind(this)}> Show Collateral Analysis</a> 
      }
      <br/>
      {this.state.displayCollateralAnalysis ? this.displayCollateralAnalysis(suffix) : ''}
      <br/>

      <h3>Indication of Interest</h3>
      <br/>
      <div className={`row`}>
        <Field
          name={"maxDebtAllowed"+suffix}
          label="Maximum Debt Allowed"
          size="col-xs-6 col-md-6"
          component={this.renderField}
        />
        <Field
          name={"loanSize"+suffix}
          label="Loan Size"
          size="col-xs-6 col-md-6"
          component={this.renderField}
        />
      </div>

      {this.displayStructureFor2Loans(suffix)}

      <div className={`row`}>
        <Field
          label="Governance"
          name={"governance"+suffix}
          size="col-xs-6 col-md-6"
          component={this.renderDropdownField}
          dpField={governanceOptions}
        />

        <Field
          label="Warrants"
          name={"warrants"+suffix}
          size="col-xs-6 col-md-6"
          component={this.renderDropdownField}
          dpField={governanceOptions}
        />
      </div>
      <br/>

      <div className={`row`}>
        <Field
          name={"covenants"+suffix}
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
            name={"cashInterest"+suffix}
            label="Cash Interest"
            component={this.renderField}
          />
          <br/>
          <Field
            name={"pikIntreset"+suffix}
            label="PIK Interest"
            component={this.renderField}
          />
          <br/>
          <Field
            name={"liborFloor"+suffix}
            label="LIBOR Floor"
            component={this.renderField}
          />
        </fieldset>

        <div className={`form-group col-xs-1 col-md-1`}>
        </div>

        <fieldset className="form-group col-xs-3 col-md-3 scheduler-border">
          <legend className="scheduler-border">Amortization (%)</legend>
          <Field
            name={"year1"+suffix}
            label="Year 1"
            component={this.renderField}
          />
          <br/>
          <Field
            name={"year2"+suffix}
            label="Year 2"
            component={this.renderField}
          />
          <br/>
          <Field
            name={"year3"+suffix}
            label="Year 3"
            component={this.renderField}
          />
          <br/>
          <Field
            name={"year4"+suffix}
            label="Year 4"
            component={this.renderField}
          />
          <br/>
          <Field
            name={"year5"+suffix}
            label="Year 5"
            component={this.renderField}
          />
        </fieldset>

        <div className={`form-group col-xs-1 col-md-1`}>
        </div>

        <fieldset className="form-group col-xs-3 col-md-3 scheduler-border">
          <legend className="scheduler-border">Call Protection(%)</legend>
          <Field
            name={"cpYear1"+suffix}
            label="Year 1"
            component={this.renderField}
          />
          <br/>
          <Field
            name={"cpYear2"+suffix}
            label="Year 2"
            component={this.renderField}
          />
          <br/>
          <Field
            name={"cpYear3"+suffix}
            label="Year 3"
            component={this.renderField}
          />
          <br/>
          <Field
            name={"cpYear4"+suffix}
            label="Year 4"
            component={this.renderField}
          />
          <br/>
          <Field
            name={"cpYear5"+suffix}
            label="Year 5"
            component={this.renderField}
          />
        </fieldset>
      </div>
      <br/>
      <br/>
    </div>);
  }

  displayTwoIOIFields(){
    return(
      <Tabs>
        <TabList>
          <Tab>
            First Tranche
          </Tab>
          <Tab>
            Second Tranche
          </Tab>
        </TabList>
        <TabPanel>
          {this.displayIOIFields("_1")}
        </TabPanel>
        <TabPanel>
          {this.displayIOIFields("_2")}
        </TabPanel>
      </Tabs>
    );
  }

  onSelectLoanStructure(props){
    if((props.target.value === 'ABL-Both' || props.target.value === 'CashFlow-Both') && !this.state.displayTwoLoanStructures) {
      this.setState({
        displayTwoLoanStructures : true
      });
    } else if(this.state.displayTwoLoanStructures){
      this.setState({
        displayTwoLoanStructures : false
      });
    }
  }

  render(){
    const {handleSubmit} = this.props;
    return(
      <div>
        <ToastContainer />
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >
            <h3>IOI Revisions</h3>
            <br/>
            <p>Modify IOI terms below and submit. Update Collateral Analysis where applicable.</p>
            <br/>
            <hr/>
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
              {this.displayRFPSummary()}
              <br/>
              <hr/>
              <div className={`row`}>
                <Field
                  label="Loan Structure"
                  name="loanStructure"
                  size="col-xs-12 col-md-12"
                  onChange={this.onSelectLoanStructure.bind(this)}
                  component={this.renderDropdownField}
                  dpField={loanStructOptions}
                />
              </div>
              <br/>
              <hr/>
              {this.state.displayTwoLoanStructures ? this.displayTwoIOIFields() : this.displayIOIFields("_1")}

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
  let intializedData = {};

  if(state.ioiList.ioi){
    let initData= {};
    let ioi = {};
    if(Array.isArray(state.ioiList.ioi)){
      ioi = state.ioiList.ioi[0];
      intializedData.ioi = ioi;
  
      let childIOIList = [];
      if(state.ioiList.ioi[1])
        childIOIList.push(state.ioiList.ioi[1]);
  
      if(state.ioiList.ioi[2])
        childIOIList.push(state.ioiList.ioi[2]);
      
      initData = {
        ...setInitData(childIOIList[0], "_1"),
        ...setInitData(childIOIList[1], "_2")
      }
    } else {
      ioi = state.ioiList.ioi;
      intializedData.ioi = ioi;
      initData = setInitData(state.ioiList.ioi, "_1");
    }

    initData.loanStructure = ioi.loanStructure;
    intializedData.initialValues = initData;
  }

  if(state.rfpList.rfpList){
    intializedData.rfp = state.rfpList.rfpList[0];
  }

  return intializedData;
}

function setInitData(ioi, suffix){
  let params = {};
  params['ioiId'+suffix] = ioi.ioiId;
  params['loanSize'+suffix] = ioi.loanSize;
  params['liborFloor'+suffix] = ioi.liborFloor;
  params['pikIntreset'+suffix] = ioi.pikIntreset;
  params['maxDebtAllowed'+suffix] = ioi.maxDebtAllowed;
  params['warrants'+suffix] = ioi.warrants;
  params['governance'+suffix] = ioi.governance;
  params['covenants'+suffix] = ioi.covenants;
  params['upfrontFee'+suffix] = ioi.upfrontFee;
  params['maturity'+suffix] = ioi.maturity;
  params['tranche'+suffix] = ioi.tranche;
  params['loanStructure'+suffix] = ioi.loanStructure;
  params['cashInterest'+suffix] = ioi.cashInterest;
  params['cpYear1'+suffix] = ioi.cpYear1;
  params['cpYear2'+suffix] = ioi.cpYear2;
  params['cpYear3'+suffix] = ioi.cpYear3;
  params['cpYear4'+suffix] = ioi.cpYear4;
  params['cpYear5'+suffix] = ioi.cpYear5;
  params['year1'+suffix] = ioi.year1;
  params['year2'+suffix] = ioi.year2;
  params['year3'+suffix] = ioi.year3;
  params['year4'+suffix] = ioi.year4;
  params['year5'+suffix] = ioi.year5;

  return params;
}

function validate(values){
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
  return bindActionCreators({
    sendAMsgFromAdminWithCompanyId   : sendAMsgFromAdminWithCompanyId,
    updateIOIAction : updateIOIAction,
    fetchIOIAction : fetchIOIAction,
    fetchRFPByIOIAction : fetchRFPByIOIAction,
    createIOIAction   : createIOIAction,
    deleteIOIAction   : deleteIOIAction
  }, dispatch);
}

EditIOIForm = reduxForm({
  'form': 'EditIOIForm',
  enableReinitialize  : true,
  validate
}) (EditIOIForm)

EditIOIForm = connect(mapStateToProps, mapDispatchToProps)(EditIOIForm);

export default EditIOIForm;