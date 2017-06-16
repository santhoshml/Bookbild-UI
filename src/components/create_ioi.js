import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import { createIOIAction, updateIOIAction } from '../actions/index';
import {Link} from 'react-router';
import validator from 'validator';
import { bindActionCreators } from 'redux';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import cUtils from '../utils/common_utils';
import Header from './header';
import NumberFormat from 'react-number-format';
import Select from 'react-select';

var gType=null;
class CreateIOIForm extends Component{
  static contextTypes ={
	    router : PropTypes.object
	};

  constructor(props){
    super(props);
    this.state = {
      user : null,
      rfp : null,
      type : props.params.type,
      selectedCovenant: []
    };
  }

  componentWillMount() {
    gType = this.props.params.type;
    console.log('gType :'+ gType);
    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    let rfp = lsUtils.getValue(constants.KEY_RFP_OBJECT);

    this.setState({
      rfp                 : rfp,
      user                : user,
      createdById         : user.userId,
      createdByCompanyId  : company.companyId
    });

    if(gType === constants.IOI_EDIT){
      var ioi = lsUtils.getValue(constants.KEY_SELECTED_IOI_OBJECT);
      console.log('');
      this.setState({
        ioi : ioi
      });
    }
  }

  onSubmit(props){
    console.log('createIOIAction:'+JSON.stringify(props));
    if(gType === constants.IOI_EDIT){
      var ioi = lsUtils.getValue(constants.KEY_SELECTED_IOI_OBJECT);
      props.ioiId = ioi.ioiId;
      props.createdById = this.state.createdById;

      this.props.updateIOIAction(props)
        .then(() => {
          // blog post has been created, navigate the user to the index
          // We navigate by calling this.context.router.push with the
          // new path to navigate to.
          this.context.router.push('/rfpMarketPlace');
      });
    } else {
      this.props.createIOIAction(props)
       .then(() => {
         // blog post has been created, navigate the user to the index
         // We navigate by calling this.context.router.push with the
         // new path to navigate to.
         this.context.router.push('/rfpMarketPlace');
       });
     }
	}

  displayRFPSummary(){
    if(gType === constants.IOI_EDIT || gType === constants.IOI_NEW){
      return (
        <div>
          <h4>RFP Details : </h4>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>Sector: {this.state.rfp.sector}</td>
                <td>Deal Size : {this.state.rfp.dealSize} &nbsp; {cUtils.getDisplayValue(this.state.rfp.product)}</td>
              </tr>
              <tr>
                <td>LTM Revenue : <NumberFormat value={this.state.rfp.ltmRevenue} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalPrecision={false}/></td>
                <td>LTM EBITDA:<NumberFormat value={this.state.rfp.ltmEbitda} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalPrecision={false}/></td>
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
      console.log('You selected '+JSON.stringify(option));
      this.setState({
        selectedCovenant: this.state.selectedCovenant.push(option)
      });
    }

  render(){
    console.log('I am in create IOI');
    const {fields:{maxDebtAllowed, loanSize, tranche, loanStructure, cashInterest
      , pikIntreset, liborFloor, maturity, year1, year2, year3, year4, year5
      , upfrontFee, governance, warrants, covenants, rfpId, createdById
      , createdByCompanyId, cpYear1, cpYear2, cpYear3, cpYear4, cpYear5}, handleSubmit} = this.props;

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

      console.log('this.state.selectedCovenants:'+JSON.stringify(this.state.selectedCovenant));

      // <div className={`row`}>
      //   <label>Covenants</label>
      //   <Select multi={true} simpleValue={true} value={this.state.selectedCovenant} options={covenantsOptions} onChange={this.onSelectCovenant.bind(this)} />
      // </div>
      // <br/>

    return(
      <div>
        <Header />
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <input type="hidden" className="form-control" {...rfpId} />
          <input type="hidden" className="form-control" {...createdById} />
          <input type="hidden" className="form-control" {...createdByCompanyId} />

          {this.displayRFPSummary()}

          <br/>
          {this.displaySubtitle()}

          <div className={`row`}>
            <div className={`form-group col-xs-6 col-md-6 no-padding ${maxDebtAllowed.touched && maxDebtAllowed.invalid ? 'has-danger' : ''}`}>
              <label>Maximum Debt Allowed</label>
              <input type="text" className="form-control" {...maxDebtAllowed} />
              <div className="text-help">
                {maxDebtAllowed.touched ? maxDebtAllowed.error : ''}
              </div>
            </div>

            <div className={`form-group col-xs-6 col-md-6 no-padding ${loanSize.touched && loanSize.invalid ? 'has-danger' : ''}`}>
              <label>Loan Size</label>
              <input type="text" className="form-control" {...loanSize} />
              <div className="text-help">
                {loanSize.touched ? loanSize.error : ''}
              </div>
            </div>
          </div>

          <div className={`row`}>
            <div className={`form-group col-xs-6 col-md-6 ${tranche.touched && tranche.invalid ? 'has-danger' : ''}`}>
              <label>Tranche? (e.g. Delayed Draw)</label>
              <select className="form-control" {...tranche}>
                <option>Choose...</option>
                <option value="Delayed Draw">Delayed Draw</option>
                <option value="Accordion">Accordion</option>
                <option value="Fixed Asset Subline">Fixed Asset Subline</option>
                <option value="Uni-Tranche">Uni-Tranche</option>
                <option value="Multi-Tranche">Multi-Tranche</option>
                <option value="None">None</option>
              </select>
              <div className="text-help">
                {tranche.touched ? tranche.error : ''}
              </div>
            </div>

            <div className={`form-group col-xs-6 col-md-6 ${loanStructure.touched && loanStructure.invalid ? 'has-danger' : ''}`}>
              <label>Loan Structure</label>
              <select className="form-control" {...loanStructure}>
                <option>Choose...</option>
                <option value="ABL-Revolver">ABL-Revolver</option>
                <option value="ABL-Term Loan">ABL-Term Loan</option>
                <option value="ABL-Both">ABL-Both</option>
                <option value="CashFlow-Revolver">CashFlow-Revolver</option>
                <option value="CashFlow-Term Loan">CashFlow-Term Loan</option>
                <option value="CashFlow-Both">CashFlow-Both</option>
              </select>
              <div className="text-help">
                {loanStructure.touched ? loanStructure.error : ''}
              </div>
            </div>
          </div>

          <div className={`row`}>
            <div className={`form-group col-xs-6 col-md-6 ${maturity.touched && maturity.invalid ? 'has-danger' : ''}`}>
              <label>Maturity (years)</label>
              <input type="text" className="form-control" {...maturity} />
              <div className="text-help">
                {maturity.touched ? maturity.error : ''}
              </div>
            </div>

            <div className={`form-group col-xs-6 col-md-6 ${upfrontFee.touched && upfrontFee.invalid ? 'has-danger' : ''}`}>
              <label>OID / Upfront Fee (%)</label>
              <input type="text" className="form-control" {...upfrontFee} />
              <div className="text-help">
                {upfrontFee.touched ? upfrontFee.error : ''}
              </div>
            </div>
          </div>

          <div className={`row`}>
            <div className={`form-group col-xs-6 col-md-6 ${governance.touched && governance.invalid ? 'has-danger' : ''}`}>
              <label>Governance</label>
              <select className="form-control" {...governance}>
                <option>Choose...</option>
                <option value="One">YES</option>
                <option value="Two">NO</option>
              </select>
              <div className="text-help">
                {governance.touched ? governance.error : ''}
              </div>
            </div>

            <div className={`form-group col-xs-6 col-md-6 ${warrants.touched && warrants.invalid ? 'has-danger' : ''}`}>
              <label>Warrants</label>
              <select className="form-control" {...warrants}>
                <option>Choose...</option>
                <option value="One">YES</option>
                <option value="Two">NO</option>
              </select>
              <div className="text-help">
                {warrants.touched ? warrants.error : ''}
              </div>
            </div>
          </div>
          <br/>

          <div className={`row`}>
            <div className={`form-group col-xs-12 col-md-12 ${covenants.touched && covenants.invalid ? 'has-danger' : ''}`}>
              <label>Covenants</label>
              <input type="text" className="form-control" placeholder={constants.COVENANTS_SAMPLE} {...covenants} />
              <div className="text-help">
                {covenants.touched ? covenants.error : ''}
              </div>
            </div>
          </div>

          <div className={`row`}>
            <fieldset className="form-group col-xs-3 col-md-3 scheduler-border">
              <legend className="scheduler-border">Loan Pricing(%)</legend>
              <div className={`${cashInterest.touched && cashInterest.invalid ? 'has-danger' : ''}`}>
                <label>Cash Interest</label>
                <input type="text" className="form-control" {...cashInterest} />
                <div className="text-help">
                  {cashInterest.touched ? cashInterest.error : ''}
                </div>
              </div>
              <br/>

              <div className={`${pikIntreset.touched && pikIntreset.invalid ? 'has-danger' : ''}`}>
                <label>PIK Interest</label>
                <input type="text" className="form-control" {...pikIntreset} />
                <div className="text-help">
                  {pikIntreset.touched ? pikIntreset.error : ''}
                </div>
              </div>
              <br/>

              <div className={`${liborFloor.touched && liborFloor.invalid ? 'has-danger' : ''}`}>
                <label>LIBOR Floor</label>
                <input type="text" className="form-control" {...liborFloor} />
                <div className="text-help">
                  {liborFloor.touched ? liborFloor.error : ''}
                </div>
              </div>
            </fieldset>

            <div className={`form-group col-xs-1 col-md-1`}>
            </div>

            <fieldset className="form-group col-xs-3 col-md-3 scheduler-border">
              <legend className="scheduler-border">Amortization (%)</legend>
              <div className={`${year1.touched && year1.invalid ? 'has-danger' : ''}`}>
                <label>Year 1</label>
                <input type="text" className="form-control" {...year1} />
                <div className="text-help">
                  {year1.touched ? year1.error : ''}
                </div>
              </div>
              <br/>

              <div className={`${year2.touched && year2.invalid ? 'has-danger' : ''}`}>
                <label>Year 2</label>
                <input type="text" className="form-control" {...year2} />
                <div className="text-help">
                  {year2.touched ? year2.error : ''}
                </div>
              </div>
              <br/>

              <div className={`${year3.touched && year3.invalid ? 'has-danger' : ''}`}>
                <label>Year 3</label>
                  <input type="text" className="form-control" {...year3} />
                  <div className="text-help">
                    {year3.touched ? year3.error : ''}
                  </div>
              </div>
              <br/>

              <div className={`${year4.touched && year4.invalid ? 'has-danger' : ''}`}>
                <label>Year 4</label>
                <input type="text" className="form-control" {...year4} />
                <div className="text-help">
                  {year4.touched ? year4.error : ''}
                </div>
              </div>
              <br/>

              <div className={`${year5.touched && year5.invalid ? 'has-danger' : ''}`}>
                <label>Year 5</label>
                <input type="text" className="form-control" {...year5} />
                <div className="text-help">
                  {year5.touched ? year5.error : ''}
                </div>
              </div>
            </fieldset>

            <div className={`form-group col-xs-1 col-md-1`}>
            </div>

            <fieldset className="form-group col-xs-3 col-md-3 scheduler-border">
              <legend className="scheduler-border">Call Protection(%)</legend>
              <div className={`${cpYear1.touched && cpYear1.invalid ? 'has-danger' : ''}`}>
                <label>Year 1</label>
                <input type="text" className="form-control" {...cpYear1} />
                <div className="text-help">
                  {cpYear1.touched ? cpYear1.error : ''}
                </div>
              </div>
              <br/>

              <div className={`${cpYear2.touched && cpYear2.invalid ? 'has-danger' : ''}`}>
                <label>Year 2</label>
                <input type="text" className="form-control" {...cpYear2} />
                <div className="text-help">
                  {cpYear2.touched ? cpYear2.error : ''}
                </div>
              </div>
              <br/>

              <div className={`${cpYear3.touched && cpYear3.invalid ? 'has-danger' : ''}`}>
                <label>Year 3</label>
                  <input type="text" className="form-control" {...cpYear3} />
                  <div className="text-help">
                    {cpYear3.touched ? cpYear3.error : ''}
                  </div>
              </div>
              <br/>

              <div className={`${cpYear4.touched && cpYear4.invalid ? 'has-danger' : ''}`}>
                <label>Year 4</label>
                <input type="text" className="form-control" {...cpYear4} />
                <div className="text-help">
                  {cpYear4.touched ? cpYear4.error : ''}
                </div>
              </div>
              <br/>

              <div className={`${cpYear5.touched && cpYear5.invalid ? 'has-danger' : ''}`}>
                <label>Year 5</label>
                <input type="text" className="form-control" {...cpYear5} />
                <div className="text-help">
                  {cpYear5.touched ? cpYear5.error : ''}
                </div>
              </div>
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
    console.log('ioi to be edited :'+JSON.stringify(ioi));

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
  console.log('values:'+JSON.stringify(values));
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
  'fields': ['maxDebtAllowed', 'loanSize', 'tranche', 'loanStructure', 'cashInterest'
    , 'pikIntreset', 'liborFloor', 'maturity', 'year1', 'year2', 'year3', 'year4', 'year5'
    , 'upfrontFee', 'governance', 'warrants', 'covenants', 'rfpId', 'createdById'
    , 'createdByCompanyId', 'cpYear1', 'cpYear2', 'cpYear3', 'cpYear4', 'cpYear5'],
  validate
}, mapStateToProps, mapDispatchToProps)(CreateIOIForm);
