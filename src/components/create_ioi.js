import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import { createIOIAction } from '../actions/index';
import {Link} from 'react-router';
import validator from 'validator';
import { bindActionCreators } from 'redux';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import cUtils from '../utils/common_utils';


class CreateIOIForm extends Component{
  static contextTypes ={
	    router : PropTypes.object
	};

  constructor(props){
    super(props);
    this.state = {
      user : null,
      rfp : null
    };
  }

  componentWillMount() {
    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    let rfp = lsUtils.getValue(constants.KEY_RFP_OBJECT);

    this.setState({
      rfp                 : rfp,
      user                : user,
      createdById         : user.userId,
      createdByCompanyId  : company.companyId
    });

  }

  onSubmit(props){
    console.log('createIOIAction:'+JSON.stringify(props));
    this.props.createIOIAction(props)
     .then(() => {
       // blog post has been created, navigate the user to the index
       // We navigate by calling this.context.router.push with the
       // new path to navigate to.
       this.context.router.push('/rfpMarketPlace');
     });

	}

  render(){
    console.log('I am in create IOI');
    const {fields:{maxDebtAllowed, loanSize, tranche, loanStructure, cashInterest
      , pikIntreset, liborFloor, maturity, year1, year2, year3, year4, year5
      , upfrontFee, governance, warrants, covenants, rfpId, createdById
      , createdByCompanyId}, handleSubmit} = this.props;

    return(
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <input type="hidden" className="form-control" {...rfpId} />
        <input type="hidden" className="form-control" {...createdById} />
        <input type="hidden" className="form-control" {...createdByCompanyId} />

        <div className="text-md-center">
          <h5>RFP : {this.state.rfp.sector} &nbsp; {this.state.rfp.dealSize} &nbsp; {cUtils.getDisplayValue(this.state.rfp.product)}</h5>
        </div>
        <div>
          <h4>Indication of Interest</h4>
          <br/>
        </div>

        <div className={`row ${maxDebtAllowed.touched && maxDebtAllowed.invalid ? 'has-danger' : ''}`}>
          <label className="col-md-3">Maximum Debt Allowed</label>
          <div className="col-md-3">
            <input type="text" className="form-control" {...maxDebtAllowed} />
            <div className="text-help">
              {maxDebtAllowed.touched ? maxDebtAllowed.error : ''}
            </div>
          </div>
        </div>
        <br/>

        <div className={`row ${loanSize.touched && loanSize.invalid ? 'has-danger' : ''}`}>
          <label className="col-md-3">Loan Size</label>
          <div className="col-md-3">
            <input type="text" className="form-control" {...loanSize} />
            <div className="text-help">
              {loanSize.touched ? loanSize.error : ''}
            </div>
          </div>
        </div>
        <br/>

        <div className={`row ${tranche.touched && tranche.invalid ? 'has-danger' : ''}`}>
          <label className="col-md-3">Tranche? (e.g. Delayed Draw)</label>
          <div className="col-md-3">
            <select className="form-control" {...tranche}>
              <option selected>Choose...</option>
              <option value="Delayed Draw">Delayed Draw</option>
              <option value="Accordion">Accordion</option>
              <option value="Fixed Asset Subline">Fixed Asset Subline</option>
              <option value="Uni-Tranche">Uni-Tranche</option>
              <option value="Multi-Tranche">Multi-Tranche</option>
            </select>
            <div className="text-help">
              {tranche.touched ? tranche.error : ''}
            </div>
          </div>
        </div>
        <br/>
        <div className={`row ${loanStructure.touched && loanStructure.invalid ? 'has-danger' : ''}`}>
          <label className="col-md-3">Loan Structure</label>
          <div className="col-md-3">
            <select className="form-control" {...loanStructure}>
              <option selected>Choose...</option>
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
        <br/>

        <fieldset className="scheduler-border">
          <legend className="scheduler-border">Loan Pricing (%)</legend>
          <div className={`row ${cashInterest.touched && cashInterest.invalid ? 'has-danger' : ''}`}>
            <label className="col-md-3">Cash Interest</label>
            <div className="col-md-3">
              <input type="text" className="form-control" {...cashInterest} />
              <div className="text-help">
                {cashInterest.touched ? cashInterest.error : ''}
              </div>
            </div>
          </div>
          <br/>

          <div className={`row ${pikIntreset.touched && pikIntreset.invalid ? 'has-danger' : ''}`}>
            <label className="col-md-3">PIK Interest</label>
            <div className="col-md-3">
              <input type="text" className="form-control" {...pikIntreset} />
              <div className="text-help">
                {pikIntreset.touched ? pikIntreset.error : ''}
              </div>
            </div>
          </div>
          <br/>

          <div className={`row ${liborFloor.touched && liborFloor.invalid ? 'has-danger' : ''}`}>
            <label className="col-md-3">LIBOR Floor</label>
            <div className="col-md-3">
              <input type="text" className="form-control" {...liborFloor} />
              <div className="text-help">
                {liborFloor.touched ? liborFloor.error : ''}
              </div>
            </div>
          </div>

        </fieldset>
        <br/>

        <div className={`row ${maturity.touched && maturity.invalid ? 'has-danger' : ''}`}>
          <label className="col-md-3">Maturity (years)</label>
          <div className="col-md-3">
            <input type="text" className="form-control" {...maturity} />
            <div className="text-help">
              {maturity.touched ? maturity.error : ''}
            </div>
          </div>
        </div>
        <br/>

        <fieldset className="scheduler-border">
          <legend className="scheduler-border">Amortization (%)</legend>

          <div className={`row ${year1.touched && year1.invalid ? 'has-danger' : ''}`}>
            <label className="col-md-3">Year 1</label>
            <div className="col-md-3">
              <input type="text" className="form-control" {...year1} />
              <div className="text-help">
                {year1.touched ? year1.error : ''}
              </div>
            </div>
          </div>
          <br/>

          <div className={`row ${year2.touched && year2.invalid ? 'has-danger' : ''}`}>
            <label className="col-md-3">Year 2</label>
            <div className="col-md-3">
              <input type="text" className="form-control" {...year2} />
              <div className="text-help">
                {year2.touched ? year2.error : ''}
              </div>
            </div>
          </div>
          <br/>

          <div className={`row ${year3.touched && year3.invalid ? 'has-danger' : ''}`}>
            <label className="col-md-3">Year 3</label>
            <div className="col-md-3">
              <input type="text" className="form-control" {...year3} />
              <div className="text-help">
                {year3.touched ? year3.error : ''}
              </div>
            </div>
          </div>
          <br/>

          <div className={`row ${year4.touched && year4.invalid ? 'has-danger' : ''}`}>
            <label className="col-md-3">Year 4</label>
            <div className="col-md-3">
              <input type="text" className="form-control" {...year4} />
              <div className="text-help">
                {year4.touched ? year4.error : ''}
              </div>
            </div>
          </div>
          <br/>

          <div className={`row ${year5.touched && year5.invalid ? 'has-danger' : ''}`}>
            <label className="col-md-3">Year 5</label>
            <div className="col-md-3">
              <input type="text" className="form-control" {...year5} />
              <div className="text-help">
                {year5.touched ? year5.error : ''}
              </div>
            </div>
          </div>
        </fieldset>
        <br/>

        <div className={`row ${upfrontFee.touched && upfrontFee.invalid ? 'has-danger' : ''}`}>
          <label className="col-md-3">OID / Upfront Fee (%)</label>
          <div className="col-md-3">
            <input type="text" className="form-control" {...upfrontFee} />
            <div className="text-help">
              {upfrontFee.touched ? upfrontFee.error : ''}
            </div>
          </div>
        </div>
        <br/>

        <div className={`row ${governance.touched && governance.invalid ? 'has-danger' : ''}`}>
          <label className="col-md-3">Governance</label>
          <div className="col-md-3">
            <select className="form-control" {...governance}>
              <option selected>Choose...</option>
              <option value="One">One</option>
              <option value="Two">Two</option>
              <option value="Three">Three</option>
            </select>
            <div className="text-help">
              {governance.touched ? governance.error : ''}
            </div>
          </div>
        </div>
        <br/>

        <div className={`row ${warrants.touched && warrants.invalid ? 'has-danger' : ''}`}>
          <label className="col-md-3">Warrants</label>
          <div className="col-md-3">
            <select className="form-control" {...warrants}>
              <option selected>Choose...</option>
              <option value="One">One</option>
              <option value="Two">Two</option>
              <option value="Three">Three</option>
            </select>
            <div className="text-help">
              {warrants.touched ? warrants.error : ''}
            </div>
          </div>
        </div>
        <br/>

        <div className={`row ${covenants.touched && covenants.invalid ? 'has-danger' : ''}`}>
          <label className="col-md-3">Covenants</label>
          <div className="col-md-3">
            <select className="form-control" {...covenants}>
              <option selected>Choose...</option>
              <option value="One">One</option>
              <option value="Two">Two</option>
              <option value="Three">Three</option>
            </select>
            <div className="text-help">
              {covenants.touched ? covenants.error : ''}
            </div>
          </div>
        </div>

        <br/>
        <Link to="/rfpMarketPlace" className="btn btn-primary">Home</Link>&nbsp;&nbsp;
        <button type="submit" className="btn btn-primary">SUBMIT IOI</button>&nbsp;&nbsp;
        <Link to="/addUser" className="btn btn-primary">PITCH</Link>

      </form>
    );
  }
}


function mapStateToProps(state) {
  let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
  let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
  let rfp = lsUtils.getValue(constants.KEY_RFP_OBJECT);

  return {
    user : user,
    initialValues : {
      rfpId               : rfp.rfpId,
      createdById         : user.userId,
      createdByCompanyId  : company.companyId
    }
  };
}

function validate(values){
  const errors={};

  if(!values.loanSize){
    errors.loanSize='Enter value of loan size';
  }

  if(!values.loanStructure){
    errors.loanStructure='Enter value for loan structure';
  }

  if(!values.cashInterest){
    errors.cashInterest='Enter value for cash interest';
  }

  if(!values.pikIntreset){
    errors.pikIntreset='Enter value for PIK interest';
  }

  if(!values.liborFloor){
    errors.liborFloor='Enter value for LIBOR floor';
  }

  if(!values.maturity){
    errors.maturity='Enter value for maturity';
  }

  if(!values.upfrontFee){
    errors.upfrontFee='Enter value for upfront fee';
  }

	if(!values.covenants){
    errors.covenants='Enter value for covenants';
  }

  return errors;
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    createIOIAction   : createIOIAction
  }, dispatch);
}

export default reduxForm({
  'form': 'CreateIOIForm',
  'fields': ['maxDebtAllowed', 'loanSize', 'tranche', 'loanStructure', 'cashInterest'
    , 'pikIntreset', 'liborFloor', 'maturity', 'year1', 'year2', 'year3', 'year4', 'year5'
    , 'upfrontFee', 'governance', 'warrants', 'covenants', 'rfpId', 'createdById'
    , 'createdByCompanyId'],
}, mapStateToProps, mapDispatchToProps)(CreateIOIForm);
