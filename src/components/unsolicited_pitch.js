import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import { fetchAllCompanyListForRFP, createUnsolicitedPitchAction } from '../actions/index';
import {Link} from 'react-router';
import validator from 'validator';
import { bindActionCreators } from 'redux';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import cUtils from '../utils/common_utils';
import Header from './header';
import NumberFormat from 'react-number-format';

var gType=null;
class CreateIOIForm extends Component{
  static contextTypes ={
	    router : PropTypes.object
	};

  constructor(props){
    super(props);
    this.state = {
      user : null,
      type : props.params.type
    };
  }

  componentWillMount() {
    gType = this.props.params.type;
    console.log('gType :'+ gType);
    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);

    this.setState({
      user                : user,
      createdById         : user.userId,
      createdByCompanyId  : company.companyId
    });

    this.props.fetchAllCompanyListForRFP();

    // if(gType === constants.PITCH_EDIT){
    //   var ioi = lsUtils.getValue(constants.KEY_SELECTED_IOI_OBJECT);
    //   console.log('');
    //   this.setState({
    //     ioi : ioi
    //   });
    // }
  }

  onSubmit(props){
    console.log('unsolicitedPitchAction:'+JSON.stringify(props));
    if(gType === constants.PITCH_EDIT){
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
      this.props.createUnsolicitedPitchAction(props)
       .then(() => {
         // blog post has been created, navigate the user to the index
         // We navigate by calling this.context.router.push with the
         // new path to navigate to.
         this.context.router.push('/rfpMarketPlace');
       });
     }
	}

  displayCompanyDropdown(){
    if(this.props.companyList){
      const { fields: {companyId}} = this.props;
      var makeOptions = function(company){
        return <option value={company.companyId}>{company.companyName}</option>
      };

      return(<div>
        <div className={`row`}>
          <div className={`form-group col-xs-12 col-md-12`}>
            <label>Select a Company to PITCH to</label><br/>
            <select className="form-control" {...companyId}>
              {this.props.companyList.map(makeOptions)}
            </select>
          </div>
        </div>
      </div>);
    }
  }

  displaySubtitle(){
    return(
      <div>
        <h4>Create a Pitch</h4>
        <br/>
      </div>
    );
  }

  render(){
    console.log('I am in create IOI');
    const {fields:{maxDebtAllowed, loanSize, tranche, loanStructure, cashInterest
      , pikIntreset, liborFloor, maturity, year1, year2, year3, year4, year5
      , upfrontFee, governance, warrants, covenants, rfpId, createdById
      , createdByCompanyId}, handleSubmit} = this.props;

    return(
      <div>
        <Header />
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <input type="hidden" className="form-control" {...createdById} />
          <input type="hidden" className="form-control" {...createdByCompanyId} />

          <br/>
          {this.displaySubtitle()}
          <br/>
          {this.displayCompanyDropdown()}

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
                <option selected>Choose...</option>
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
            <div className={`form-group col-xs-4 col-md-4 ${governance.touched && governance.invalid ? 'has-danger' : ''}`}>
              <label>Governance</label>
              <select className="form-control" {...governance}>
                <option selected>Choose...</option>
                <option value="One">YES</option>
                <option value="Two">NO</option>
              </select>
              <div className="text-help">
                {governance.touched ? governance.error : ''}
              </div>
            </div>

            <div className={`form-group col-xs-4 col-md-4 ${warrants.touched && warrants.invalid ? 'has-danger' : ''}`}>
              <label>Warrants</label>
              <select className="form-control" {...warrants}>
                <option selected>Choose...</option>
                <option value="One">YES</option>
                <option value="Two">NO</option>
              </select>
              <div className="text-help">
                {warrants.touched ? warrants.error : ''}
              </div>
            </div>

            <div className={`form-group col-xs-4 col-md-4 ${covenants.touched && covenants.invalid ? 'has-danger' : ''}`}>
              <label>Covenants</label>
              <select className="form-control" {...covenants}>
                <option selected>Choose...</option>
                <option value="One">YES</option>
                <option value="Two">NO</option>
              </select>
              <div className="text-help">
                {covenants.touched ? covenants.error : ''}
              </div>
            </div>
          </div>
          <br/>

          <fieldset className="form-group col-xs-5 col-md-5 scheduler-border">
            <legend className="scheduler-border">Loan Pricing (%)</legend>
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

          <div className={`form-group col-xs-2 col-md-2`}>
          </div>

          <fieldset className="form-group col-xs-5 col-md-5 scheduler-border">
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

  let intializedData = {
    user : user,
    initialValues : {
      createdById         : user.userId,
      createdByCompanyId  : company.companyId
    },
    companyList : state.rfpList.companyListForRFP
  };

  // if(gType == constants.IOI_EDIT){
  //   let ioi = lsUtils.getValue(constants.KEY_SELECTED_IOI_OBJECT);
  //   console.log('ioi to be edited :'+JSON.stringify(ioi));
  //
  //   intializedData.initialValues.maxDebtAllowed = ioi.maxDebtAllowed;
  //   intializedData.initialValues.loanSize = ioi.loanSize;
  //   intializedData.initialValues.tranche = ioi.tranche;
  //   intializedData.initialValues.loanStructure = ioi.loanStructure;
  //   intializedData.initialValues.cashInterest = ioi.cashInterest;
  //   intializedData.initialValues.pikIntreset = ioi.pikIntreset;
  //   intializedData.initialValues.liborFloor = ioi.liborFloor;
  //   intializedData.initialValues.maturity = ioi.maturity;
  //   intializedData.initialValues.year1 = ioi.year1;
  //   intializedData.initialValues.year2 = ioi.year2;
  //   intializedData.initialValues.year3 = ioi.year3;
  //   intializedData.initialValues.year4 = ioi.year4;
  //   intializedData.initialValues.year5  = ioi.year5;
  //   intializedData.initialValues.upfrontFee = ioi.upfrontFee;
  //   intializedData.initialValues.governance = ioi.governance;
  //   intializedData.initialValues.warrants = ioi.warrants;
  //   intializedData.initialValues.covenants = ioi.covenants;
  //   intializedData.initialValues.rfpId = ioi.rfpId;
  //   intializedData.initialValues.createdById = ioi.createdById;
  //   intializedData.initialValues.createdByCompanyId = ioi.createdByCompanyId;
  // }

  return intializedData;
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
    fetchAllCompanyListForRFP   : fetchAllCompanyListForRFP,
    createUnsolicitedPitchAction  : createUnsolicitedPitchAction
  }, dispatch);
}

export default reduxForm({
  'form': 'CreateIOIForm',
  'fields': ['maxDebtAllowed', 'loanSize', 'tranche', 'loanStructure', 'cashInterest'
    , 'pikIntreset', 'liborFloor', 'maturity', 'year1', 'year2', 'year3', 'year4', 'year5'
    , 'upfrontFee', 'governance', 'warrants', 'covenants', 'rfpId', 'createdById'
    , 'createdByCompanyId', 'companyId'],
}, mapStateToProps, mapDispatchToProps)(CreateIOIForm);
