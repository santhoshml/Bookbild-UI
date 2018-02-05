import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { createIOIAction, fetchRFPAction, sendAMsgFromAdminWithCompanyId } from '../actions/index';
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
    let paramId = this.props.match.params.id;

    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    this.props.fetchRFPAction(paramId);

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
        rfp : nextProps.rfp,
        collateral : collateral,
        totalGross : totalGross
      });
    }

    if(nextProps.ioi){
      this.setState({
        ioi : nextProps.ioi
      });
    }
  }

  onSubmit(props){
    let that = this;
    props.rfpId = this.props.rfp.rfpId;
    props.createdById = this.state.user.userId;
    props.createdByCompanyId = this.state.company.companyId;
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
          props[eKey] = props[key];
          delete props[key];
        }
      }
    }

    //remove _1 from the props object

    this.props.createIOIAction(props)
      .then((data) => {
        if(data.payload.status === 200 && data.payload.data.status === 'SUCCESS'){
          // send a msg to lender's company
          let lProps = {
            companyId : that.state.user.companyId,
            msg : constants.MESSAGES.IOI_CREATED_LENDER,
            ID : data.payload.data.data
          };
          that.props.sendAMsgFromAdminWithCompanyId(lProps);

          // now send msg to the borrower's company
          let bProps={
            companyId : that.props.rfp.createdByCompanyId,
            msg : constants.MESSAGES.IOI_CREATED_BORROWER,
            ID : data.payload.data.data
          };
          that.props.sendAMsgFromAdminWithCompanyId(bProps);
          
          that.props.history.push({
            pathname : constants.ROUTES_MAP.RFP_MARKETPLACE,
            state : constants.NOTIFICATIONS.CREATE_IOI_SUCCESS
          });
        } else {
          toast(constants.NOTIFICATIONS.CREATE_IOI_FAILED, {
            className : "notification-error"
          });  
        }
      });

	}

  displayRFPSummary(){
    let {rfp} = this.props;
    if(rfp){
      return (
        <div>
          <h4>RFP Details : </h4>
          <br/>
          {rfp.companyDesc}
          <br/>
          <br/>
          {rfp.txnOverview}
          <br/>
          <br/>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>Sector: {rfp.sector}</td>
                <td>Deal Size : {rfp.dealSize} &nbsp; {cUtils.getDisplayValue(rfp.product)}</td>
              </tr>
              <tr>
                <td>LTM Revenue : {cUtils.formatCurrencyToDisplay(rfp.ltmRevenue)}</td>
                <td>LTM EBITDA : {cUtils.formatCurrencyToDisplay(rfp.ltmEbitda)}</td>
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
    var {rfp} = this.props;
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
            First Loan
          </Tab>
          <Tab>
            SecondLoan
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
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
              {this.displayRFPSummary()}
              <br/>
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
    intializedData.ioi = state.ioiList.ioi[0];
  }

  if(state.rfpList.rfpList){
    intializedData.rfp = state.rfpList.rfpList[0];
  }

  return intializedData;
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
    createIOIAction   : createIOIAction,
    fetchRFPAction : fetchRFPAction,
    sendAMsgFromAdminWithCompanyId : sendAMsgFromAdminWithCompanyId
  }, dispatch);
}

CreateIOIForm = reduxForm({
  'form': 'CreateIOIForm'
  // validate
}) (CreateIOIForm)

CreateIOIForm = connect(mapStateToProps, mapDispatchToProps)(CreateIOIForm);

export default CreateIOIForm;