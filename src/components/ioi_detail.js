import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { getRFPFromFavoritesAction, fetchRFPAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import Constants from '../utils/constants';
import cUtils from '../utils/common_utils';
import dateFormat from 'dateformat';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import Header from './header';

class IOIDetail extends Component{
  constructor(props){
    super(props);
    this.state = {
			rfp : null,
      user : null,
      company : null
		}
  }

  componentWillMount() {
    // this.props.fetchAllRFPAction();
    let ioi = lsUtils.getValue(Constants.KEY_SELECTED_IOI_OBJECT);
    // let user = lsUtils.getValue(Constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(Constants.KEY_COMPANY_OBJECT);
    this.setState({
      ioi : ioi,
      company : company
    });

    this.props.fetchRFPAction(ioi.rfpId)
      .then(() => {
        console.log('I am in the get result');
        lsUtils.setValue(Constants.KEY_RFP_OBJECT, this.props.rfp);
        this.setState({
          rfp : this.props.rfp
        });
    });
  }

  displayCompanyDesc(){
    return(
      <div>
        <br/>
        <br/>
        <h2>Company Overview</h2>
        <p>{this.state.rfp.companyDesc}</p>
      </div>
    );
  }

  displaySelectedIOI(){
    let ioi = this.state.ioi;
    return(
      <div>
        <br/>
        <br/>
        <h2>Selected IOI</h2>
        <table className="table table-striped">
          <tbody>
            <tr>
              <td>Loan Size</td>
              <td><NumberFormat value={ioi.loanSize} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
            </tr>
            <tr>
              <td>Governance</td>
              <td>{ioi.governance}</td>
            </tr>
            <tr>
              <td>Covenants</td>
              <td>{ioi.covenants}</td>
            </tr>
            <tr>
              <td>Maturity</td>
              <td>{ioi.maturity}</td>
            </tr>
            <tr>
              <td>LIBOR Floor</td>
              <td>{ioi.liborFloor}</td>
            </tr>
            <tr>
              <td>Upfront Fee</td>
              <td>{ioi.upfrontFee}</td>
            </tr>
            <tr>
              <td>Loan Structure</td>
              <td>{ioi.loanStructure}</td>
            </tr>
            <tr>
              <td>Tranche</td>
              <td>{ioi.tranche}</td>
            </tr>
            <tr>
              <td>PIK Intreset</td>
              <td>{ioi.pikIntreset}</td>
            </tr>
            <tr>
              <td>Cash Interest</td>
              <td>{ioi.cashInterest}</td>
            </tr>
            <tr>
              <td>Max. Debt Allowed</td>
              <td><NumberFormat value={ioi.maxDebtAllowed} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
            </tr>
            <tr>
              <td>Warrants</td>
              <td>{ioi.warrants}</td>
            </tr>
            <tr>
              <td>Year 1</td>
              <td>{ioi.year1}</td>
            </tr>
            <tr>
              <td>Year 2</td>
              <td>{ioi.year2}</td>
            </tr>
            <tr>
              <td>Year 3</td>
              <td>{ioi.year3}</td>
            </tr>
            <tr>
              <td>Year 4</td>
              <td>{ioi.year4}</td>
            </tr>
            <tr>
              <td>year 5</td>
              <td>{ioi.year5}</td>
            </tr>
            <tr>
              <td>Created by</td>
              <td>{ioi.createdById}</td>
            </tr>
            <tr>
              <td>Last Updated on</td>
              <td>{dateFormat(moment(ioi.timestamp), 'longDate')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  displayViewAttachedRFPButton(){
    if(this.state.ioi.createdByCompanyId === this.state.company.companyId){
      return( <span>
      <Link to={"/rfpDetail/"+this.state.ioi.rfpId} className="btn btn-primary">
        View Attached RFP
      </Link>
      &nbsp;&nbsp;&nbsp;
      </span>);
    } else {
      return(<span></span>);
    }
  }

  displayEditIOIButton(){
    if(this.state.company.companyId === this.state.ioi.createdByCompanyId){
      return( <span>
      <Link to={"/createIOI/"+Constants.IOI_EDIT} className="btn btn-primary">
        Edit IOI
      </Link>
      &nbsp;&nbsp;&nbsp;
      </span>);
    } else {
      return(<span></span>);
    }
  }

  render(){
    return(
      <div>
        <Header />
        {this.displaySelectedIOI()}
        <br/>
        <br/>
        {this.displayViewAttachedRFPButton()}
        {this.displayEditIOIButton()}
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
  // Whatever is returned will show up as props
  let rObject = {};
  if(state.rfpList.rfpList){
    rObject.rfp = state.rfpList.rfpList[0];
  }

  return rObject;
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    getRFPFromFavoritesAction : getRFPFromFavoritesAction,
    fetchRFPAction : fetchRFPAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IOIDetail);
