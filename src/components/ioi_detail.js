import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { fetchRFPByIOIAction, fetchFinalIOIAction, getRFPFromFavoritesAction, fetchRFPAction, inviteLenderAction, fetchIOIAction, getLinkWithIOIAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import cUtils from '../utils/common_utils';
import dateFormat from 'dateformat';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import NavBar from './sidebar';
import roundTo from 'round-to';
import Header from './header';
import JSAlert from "js-alert";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import numeral from 'numeral';


class IOIDetail extends Component{
  constructor(props){
    super(props);
    this.state = {
      user : null,
      company : null
		}
  }

  componentWillMount() {
    // console.log('In componentWillMount of IOI_DETAIL');
    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    let paramId = this.props.match.params.id;

    this.props.fetchRFPByIOIAction(paramId);
    this.props.fetchIOIAction(paramId);
    this.props.fetchFinalIOIAction(paramId);
    this.props.getLinkWithIOIAction(paramId);

    this.setState({
      disableInvite : false,
      user : user,
      company : company
    });
  }

  componentWillReceiveProps(nextProps){
    // console.log('In componentWillReceiveProps');
    
    //set ioi
    if(nextProps.ioi){
      this.setState({
        ioi : nextProps.ioi
      });
    }

    if(nextProps.link){
      this.setState({
        disableInvite : true,
        link : nextProps.link
      });
    }

    if(nextProps.rfp){
      this.setState({
        rfp : nextProps.rfp
      });
    }
  }

  displaySelectedIOI(){
    let ioi = this.state.ioi;
    if(ioi){
      return(
        <div>
          <br/>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <td>Max. Debt Allowed</td>
                <td>{cUtils.formatCurrencyToDisplay(ioi.maxDebtAllowed)}</td>
              </tr>
              <tr>
                <td>Loan Size</td>
                <td>{cUtils.formatCurrencyToDisplay(ioi.loanSize)}</td>
              </tr>
              <tr>
                <td>Maturity (yrs)</td>
                <td>{ioi.maturity}</td>
              </tr>
              <tr>
                <td>Tranche</td>
                <td>{ioi.tranche}</td>
              </tr>
              <tr>
                <td>Loan Structure</td>
                <td>{ioi.loanStructure}</td>
              </tr>
              <tr>
                <td>Cash Interest</td>
                <td>{cUtils.formatPercentToDisplay(ioi.cashInterest)}</td>
              </tr>
              <tr>
                <td>PIK Interest</td>
                <td>{cUtils.formatPercentToDisplay(ioi.pikIntreset)}</td>
              </tr>
              <tr>
                <td>LIBOR Floor</td>
                <td>{cUtils.formatPercentToDisplay(ioi.liborFloor)}</td>
              </tr>
              <tr>
                <td>Upfront Fee</td>
                <td>{cUtils.formatPercentToDisplay(ioi.upfrontFee)}</td>
              </tr>
              <tr>
                <td>Covenants</td>
                <td>{ioi.covenants}</td>
              </tr>
              <tr>
                <td>Governance</td>
                <td>{ioi.governance}</td>
              </tr>
              <tr>
                <td>Warrants</td>
                <td>{ioi.warrants}</td>
              </tr>
              <tr>
                <td><b>Amortization</b></td>
                <td></td>
              </tr>
              <tr>
                <td>&emsp;&emsp;&emsp;&emsp;&emsp;Year 1</td>
                <td>{cUtils.formatPercentToDisplay(ioi.year1)}</td>
              </tr>
              <tr>
                <td>&emsp;&emsp;&emsp;&emsp;&emsp;Year 2</td>
                <td>{cUtils.formatPercentToDisplay(ioi.year2)}</td>
              </tr>
              <tr>
                <td>&emsp;&emsp;&emsp;&emsp;&emsp;Year 3</td>
                <td>{cUtils.formatPercentToDisplay(ioi.year3)}</td>
              </tr>
              <tr>
                <td>&emsp;&emsp;&emsp;&emsp;&emsp;Year 4</td>
                <td>{cUtils.formatPercentToDisplay(ioi.year4)}</td>
              </tr>
              <tr>
                <td>&emsp;&emsp;&emsp;&emsp;&emsp;Year 5</td>
                <td>{cUtils.formatPercentToDisplay(ioi.year5)}</td>
              </tr>
              <tr>
                <td>Yield Estimate</td>
                <td><b>{cUtils.formatPercentToDisplay(ioi.yield)}</b></td>
              </tr>
              <tr>
                <td>Created by Company</td>
                <td>{ioi.createdByCompanyName}</td>
              </tr>
              <tr>
                <td>Created by</td>
                <td>{ioi.createdByName}</td>
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
  }

  displayViewAttachedRFPButton(){
    if(this.state.ioi){
      return( <span>
        <Link to={constants.ROUTES_MAP.RFP_DETAIL+"/"+this.state.ioi.rfpId} className="btn btn-primary">
          View Attached RFP
        </Link>
        &nbsp;&nbsp;&nbsp;
        </span>);
    }
  }

  inviteLender(values){
    let that=this;
    JSAlert.confirm("Are you sure you want to invite the Lender ?")
    .then(function(result){
      if(!result){
        // console.log('user did not want to invite, he pressed no');
      } else {
        let data = {
          rfpId: that.state.ioi.rfpId,
          ioiId: that.state.ioi.ioiId,
          borrowerCompanyId : that.state.ioi.forCompanyId,
          lenderCompanyId : that.state.ioi.createdByCompanyId,
          name : null,
          accessToLender : { 
            "DOCUMENTS" : false, 
            "WGL" : false, 
            "QCOMPLIANCE" :   false, 
            "DEAL_TEAM" :   false 
          },
          borrowerContactId : that.state.user.contactId
        };
        // console.log('data:'+JSON.stringify(data));
        that.props.inviteLenderAction(data)
          .then(data => {
            // console.log('IN inviteLenderAction response, data:'+JSON.stringify(data));
            that.setState({
              disableInvite : true
            });
          });
      }
    });
  }

  displayInviteButton(){
    if(this.state.ioi 
      && this.state.company.companyId === this.state.ioi.forCompanyId 
      && !this.state.disableInvite){
      return( <span>
      <Link to="#" onClick={this.inviteLender.bind(this)} className="btn btn-primary">
        Invite for second round
      </Link>
      &nbsp;&nbsp;&nbsp;
      </span>);
    }
  }

  displayEditIOIButton(){
    if(this.state.ioi && this.state.company.companyId === this.state.ioi.createdByCompanyId){
      return( <span>
        <Link to={constants.ROUTES_MAP.EDIT_IOI+'/'+this.state.ioi.ioiId} className="btn btn-primary">
          Edit IOI
        </Link>
        &nbsp;&nbsp;&nbsp;
        </span>);
    }
  }

  displayYieldMatrix(){
    if(this.state.ioi && this.state.ioi.yieldMatrix){
    var yieldMatrixRender = this.state.ioi.yieldMatrix.map(function(row){
      // console.log('row:'+JSON.stringify(row));
      return(<tr key={row.period}>
          <td>{numeral(row.period).format('0,0.00')}</td>
          <td>{cUtils.formatCurrencyToDisplay(row.cashFlow)}</td>
          <td>{row.startDate}</td>
          <td>{cUtils.formatCurrencyToDisplay(row.amtAtBegin)}</td>
          <td>{cUtils.formatCurrencyToDisplay(row.amort)}</td>
          <td>{cUtils.formatCurrencyToDisplay(row.amtAtEnd)}</td>
          <td>{cUtils.formatCurrencyToDisplay(row.intrestPaymet)}</td>
          <td>{cUtils.formatCurrencyToDisplay(row.cashFlow)}</td>
        </tr>
      );
    });
    return(<div>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Period</th>
            <th>Cash Flows</th>
            <th>Date</th>
            <th>Outstanding Amount Beginning of Quarter</th>
            <th>Amortization</th>
            <th>Outstanding Amount Beginning of Period</th>
            <th>Interest Payment</th>
            <th>Cash Flow</th>
          </tr>
        </thead>
        <tbody>
          {yieldMatrixRender}
        </tbody>
      </table>
      </div>);
    }
  }

  displayFinalTermButton(){
    if(this.state.ioi 
      && (this.state.company.companyId === this.state.ioi.createdByCompanyId 
        || this.state.company.companyId === this.state.ioi.forCompanyId )
      && this.props.finalTerm){
      return(<span>
        <Link to={constants.ROUTES_MAP.VIEW_FINAL_TERM+"/"+this.props.finalTerm.finalTermId} className="btn btn-primary">
          View Final Term Sheet
        </Link>
        </span>);
    } else if(this.state.ioi 
      && this.state.company.companyId === this.state.ioi.createdByCompanyId
      && this.state.link){
      return( <span>
      <Link to={constants.ROUTES_MAP.CREATE_FINAL_TERM+"/"+this.state.ioi.ioiId} className="btn btn-primary">
        Submit Final Term Sheet
      </Link>
      &nbsp;&nbsp;&nbsp;
      </span>);
    }
  }

  render(){
    // console.log('I am in IOI_DETAIL render');
    return(
      <div>
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >
            <br/>
            <Tabs>
              <TabList>
                <Tab disabled={this.state.ioi ? false : true}>
                  IOI Details
                </Tab>
                <Tab disabled={this.state.ioi && this.state.ioi.yieldMatrix ? false : true}>
                  IOI Yield Estimate
                </Tab>
              </TabList>
              <TabPanel>
                {this.displaySelectedIOI()}
              </TabPanel>
              <TabPanel>
                {this.displayYieldMatrix()}
              </TabPanel>
            </Tabs>      
            {this.displayViewAttachedRFPButton()}
            {this.displayEditIOIButton()}
            {this.displayInviteButton()}
            {this.displayFinalTermButton()}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  // Whatever is returned will show up as props
  // console.log('In IOI_DETAIL, state:'+JSON.stringify(state));
  let rObject = {};

  if(state.ioiList.ioi){
    rObject.ioi = state.ioiList.ioi[0];
  }

  if(state.link.linkList){
    rObject.link = state.link.linkList[0];
  }

  if(state.finalTerm.finalTerm){
    rObject.finalTerm = state.finalTerm.finalTerm[0];
  }

  if(state.rfpList.rfpList){
    // console.log('state.rfpList.rfpList :'+JSON.stringify(state.rfpList.rfpList));
    rObject.rfp = state.rfpList.rfpList[0];
  }

  return rObject;
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    getRFPFromFavoritesAction : getRFPFromFavoritesAction,
    fetchRFPAction            : fetchRFPAction,
    inviteLenderAction        : inviteLenderAction,
    fetchIOIAction            : fetchIOIAction,
    getLinkWithIOIAction  : getLinkWithIOIAction,
    fetchFinalIOIAction         : fetchFinalIOIAction,
    fetchRFPByIOIAction : fetchRFPByIOIAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IOIDetail);
