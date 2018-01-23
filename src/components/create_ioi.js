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

const trancheOptions = ['Delayed Draw', 'Accordion', 'Fixed Asset Subline', 'Uni-Tranche', 'Multi-Tranche', 'None'];
const loanStructOptions= ['ABL-Revolver', 'ABL-Term Loan', 'ABL-Both', 'CashFlow-Revolver', 'CashFlow-Term Loan', 'CashFlow-Both', '2nd Lien Term Loan', 'Sub Debt', 'Mezzanine'];
const governanceOptions = ['Yes', 'No'];
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
    let paramId = this.props.match.params.id;

    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    this.props.fetchRFPAction(paramId);

    this.setState({
      user    : user,
      company : company
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
    // console.log('createIOIAction:'+JSON.stringify(props));

    // console.log('will call createIOIAction :'+JSON.stringify(props));
    // props.ioiId = ioi.ioiId;
    props.rfpId = this.state.rfp.rfpId;
    props.createdById = this.state.user.userId;
    props.createdByCompanyId = this.state.company.companyId;
    props.forCompanyId = this.state.rfp.createdByCompanyId;
    props.createdByContactId = this.state.user.contactId;
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
            companyId : this.state.rfp.createdByCompanyId,
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
    if(this.state.rfp){
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
                <td>LTM Revenue : {cUtils.formatCurrencyToDisplay(this.state.rfp.ltmRevenue)}</td>
                <td>LTM EBITDA : {cUtils.formatCurrencyToDisplay(this.state.rfp.ltmEbitda)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  }

  displaySubtitle(){
    return (
      <div>
        <h4>Indication of Interest</h4>
        <br/>
      </div>
    );
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
                {cUtils.formatCurrencyToDisplay(this.state.collateral.acctReceivable.gross)}
              </td>
              <td>
                <Field
  		            name="acctRecvIneligiblePercent"
  		            component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'acctReceivable', 'ineligible')}
  		          />
              </td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.acctReceivable.netCollateral)}
              </td>
              <td>
                <Field
                  name="acctRecvAdvRate"
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
                  name="invtryIneligiblePercent"
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'inventry', 'ineligible')}
                />
              </td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.inventry.netCollateral)}
              </td>
              <td>
                <Field
                  name="invtryAdvRate"
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
                  name="ppeIneligiblePercent"
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'ppe', 'ineligible')}
                />
              </td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.ppe.netCollateral)}
              </td>
              <td>
                <Field
                  name="ppeAdvRate"
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
                  name="maeIneligiblePercent"
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'mae', 'ineligible')}
                />
              </td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.mae.netCollateral)}
              </td>
              <td>
                <Field
                  name="maeAdvRate"
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
                  name="realEstIneligiblePercent"
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'realEst', 'ineligible')}
                />
              </td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.realEst.netCollateral)}
              </td>
              <td>
                <Field
                  name="realEstAdvRate"
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
                  name="otherIneligiblePercent"
                  component={this.renderField}
                  onBlur={this.onChangeCollateralValue.bind(this, 'other', 'ineligible')}
                />
              </td>
              <td>
                {cUtils.formatCurrencyToDisplay(this.state.collateral.other.netCollateral)}
              </td>
              <td>
                <Field
                  name="otherAdvRate"
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
    fetchRFPAction : fetchRFPAction,
    sendAMsgFromAdminWithCompanyId : sendAMsgFromAdminWithCompanyId
  }, dispatch);
}

CreateIOIForm = reduxForm({
  'form': 'CreateIOIForm',
  validate
}) (CreateIOIForm)

CreateIOIForm = connect(mapStateToProps, mapDispatchToProps)(CreateIOIForm);

export default CreateIOIForm;