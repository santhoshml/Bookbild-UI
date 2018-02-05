import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { fetchRFPByIOIAction
  , fetchFinalIOIAction
  , getRFPFromFavoritesAction
  , fetchRFPAction
  , inviteLenderAction
  , fetchIOIAction
  , getLinkWithIOIAction
  , revokeIOI } from '../actions/index';
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
    
    if(nextProps.link){
      this.setState({
        disableInvite : true
      });
    }
  }

  displayCreatedByCompanyNameElement(){
    if(this.props.ioi && this.props.link){
      return(
        <tr>
          <td>Created by Company</td>
          <td>{this.props.ioi.createdByCompanyName}</td>
        </tr>
      );
    }    
  }

  displayCreatedByNameElement(){
    if(this.props.ioi 
      && (this.state.user.companyId === this.props.ioi.createdByCompanyId
        || this.props.link)){
      return(
        <tr>
          <td>Created by</td>
          <td>{this.props.ioi.createdByName}</td>
        </tr>
      );
    }
  }

  displayMaxDebtElement(ioi, isParent){
    if(!isParent){
      return(<tr><td>Max. Debt Allowed</td><td>{cUtils.formatCurrencyToDisplay(ioi.maxDebtAllowed)}</td></tr>);
    }
  }

  displayMaturityElement(ioi, isParent){
    if(!isParent){
      return(<tr><td>Maturity (yrs)</td><td>{ioi.maturity}</td></tr>);
    }
  }

  displayTrancheElement(ioi, isParent){
    if(!isParent){
      return(<tr><td>Tranche</td><td>{ioi.tranche}</td></tr>);
    }
  }

  displayCashInterestElement(ioi, isParent){
    if(!isParent){
      return(<tr><td>Cash Interest</td><td>{cUtils.formatPercentToDisplay(ioi.cashInterest)}</td></tr>);
    }
  }  

  displayPIKInterestElement(ioi, isParent){
    if(!isParent){
      return(<tr><td>PIK Interest</td><td>{cUtils.formatPercentToDisplay(ioi.pikIntreset)}</td></tr>);
    }
  }

  displayLIBORFloorElement(ioi, isParent){
    if(!isParent){
      return(<tr><td>LIBOR Floor</td><td>{cUtils.formatPercentToDisplay(ioi.liborFloor)}</td></tr>);
    }
  }

  displayUpfrontFeeElement(ioi, isParent){
    if(!isParent){
      return(<tr><td>Upfront Fee</td><td>{cUtils.formatPercentToDisplay(ioi.upfrontFee)}</td></tr>);
    }
  }

  displayCovenantsElement(ioi, isParent){
    if(!isParent){
      return(<tr><td>Covenants</td><td>{ioi.covenants}</td></tr>);
    }
  }

  displayGovernanceElement(ioi, isParent){
    if(!isParent){
      return(<tr><td>Governance</td><td>{ioi.governance}</td></tr>);
    }
  }

  displayWarrantsElement(ioi, isParent){
    if(!isParent){
      return(<tr><td>Warrants</td><td>{ioi.warrants}</td></tr>);
    }
  }

  displayAmortizationElement(ioi, isParent){
    if(!isParent){
      return(<tr><td>Amortization</td><td></td></tr>);
    }
  }

  displayYear1Element(ioi, isParent){
    if(!isParent){
      return(<tr><td>&emsp;&emsp;&emsp;&emsp;&emsp;Year 1</td><td>{cUtils.formatPercentToDisplay(ioi.year1)}</td></tr>);
    }
  }

  displayYear2Element(ioi, isParent){
    if(!isParent){
      return(<tr><td>&emsp;&emsp;&emsp;&emsp;&emsp;Year 2</td><td>{cUtils.formatPercentToDisplay(ioi.year2)}</td></tr>);
    }
  }

  displayYear3Element(ioi, isParent){
    if(!isParent){
      return(<tr><td>&emsp;&emsp;&emsp;&emsp;&emsp;Year 3</td><td>{cUtils.formatPercentToDisplay(ioi.year3)}</td></tr>);
    }
  }

  displayYear4Element(ioi, isParent){
    if(!isParent){
      return(<tr><td>&emsp;&emsp;&emsp;&emsp;&emsp;Year 4</td><td>{cUtils.formatPercentToDisplay(ioi.year4)}</td></tr>);
    }
  }

  displayYear5Element(ioi, isParent){
    if(!isParent){
      return(<tr><td>&emsp;&emsp;&emsp;&emsp;&emsp;Year 5</td><td>{cUtils.formatPercentToDisplay(ioi.year5)}</td></tr>);
    }
  }

  displaySelectedIOI(ioi, isParent){
    // let ioi = this.props.ioi;
    if(ioi){
      return(
        <div>
          <br/>
          <table className="table table-striped table-bordered">
            <tbody>
              {this.displayMaxDebtElement(ioi, isParent)}
              <tr>
                <td>Loan Size</td>
                <td>{cUtils.formatCurrencyToDisplay(ioi.loanSize)}</td>
              </tr>
              {this.displayMaturityElement(ioi, isParent)}
              {this.displayTrancheElement(ioi, isParent)}
              <tr>
                <td>Loan Structure</td>
                <td>{ioi.loanStructure}</td>
              </tr>
              {this.displayCashInterestElement(ioi, isParent)}
              {this.displayPIKInterestElement(ioi, isParent)}
              {this.displayLIBORFloorElement(ioi, isParent)}
              {this.displayUpfrontFeeElement(ioi, isParent)}
              {this.displayCovenantsElement(ioi, isParent)}
              {this.displayGovernanceElement(ioi, isParent)}
              {this.displayWarrantsElement(ioi, isParent)}
              {this.displayAmortizationElement(ioi, isParent)}
              {this.displayYear1Element(ioi, isParent)}
              {this.displayYear2Element(ioi, isParent)}
              {this.displayYear3Element(ioi, isParent)}
              {this.displayYear4Element(ioi, isParent)}
              {this.displayYear5Element(ioi, isParent)}
              <tr>
                <td>Yield Estimate</td>
                <td><b>{cUtils.formatPercentToDisplay(ioi.yield)}</b></td>
              </tr>
              {this.displayCreatedByNameElement()}
              {this.displayCreatedByCompanyNameElement()}
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
    if(this.props.ioi){
      return( <span>
        <Link to={constants.ROUTES_MAP.RFP_DETAIL+"/"+this.props.ioi.rfpId} className="btn btn-primary">
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
      } else {
        let data = {
          rfpId: that.props.ioi.rfpId,
          ioiId: that.props.ioi.ioiId,
          borrowerCompanyId : that.props.ioi.forCompanyId,
          lenderCompanyId : that.props.ioi.createdByCompanyId,
          name : null,
          accessToLender : { 
            "DOCUMENTS" : false, 
            "WGL" : false, 
            "QCOMPLIANCE" :   false, 
            "DEAL_TEAM" :   false 
          },
          borrowerContactId : that.state.user.contactId
        };
        that.props.inviteLenderAction(data)
          .then(data => {
            that.setState({
              disableInvite : true
            });
          });
      }
    });
  }

  displayInviteButton(){
    if(this.props.ioi 
      && this.state.company.companyId === this.props.ioi.forCompanyId 
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
    if(this.props.ioi && this.state.company.companyId === this.props.ioi.createdByCompanyId){
      return( <span>
        <Link to={constants.ROUTES_MAP.EDIT_IOI+'/'+this.props.ioi.ioiId} className="btn btn-primary">
          Edit IOI
        </Link>
        &nbsp;&nbsp;&nbsp;
        </span>);
    }
  }

  displayRevokeIOIButton(){
    let that = this;
    JSAlert.confirm("Are you sure you want to revoke the IOI, this action cannot be REVERSED ?")
    .then(function(result){
      that.props.revokeIOI(that.props.ioi.ioiId)
      .then(() => {
        that.props.history.push(constants.ROUTES_MAP.RFP_MARKETPLACE);
      })
    });
  }

  displayYieldMatrix(yieldMatrix){
    var yieldMatrixRender = yieldMatrix.map(function(row){
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

  displayFinalTermButton(){
    if(this.props.ioi 
      && (this.state.company.companyId === this.props.ioi.createdByCompanyId 
        || this.state.company.companyId === this.props.ioi.forCompanyId )
      && this.props.finalTerm){
      return(<span>
        <Link to={constants.ROUTES_MAP.VIEW_FINAL_TERM+"/"+this.props.finalTerm.finalTermId} className="btn btn-primary">
          View Final Term Sheet
        </Link>
        </span>);
    } else if(this.props.ioi 
      && this.state.company.companyId === this.props.ioi.createdByCompanyId
      && this.props.link){
      return( <span>
      <Link to={constants.ROUTES_MAP.CREATE_FINAL_TERM+"/"+this.props.ioi.ioiId} className="btn btn-primary">
        Submit Final Term Sheet
      </Link>
      &nbsp;&nbsp;&nbsp;
      </span>);
    }
  }

  displayTabListForIOI(){
    return(
      <TabList>
        <Tab disabled={this.props.ioi ? false : true}>
          IOI Details
        </Tab>
        <Tab disabled={this.props.ioi && this.props.ioi.yieldMatrix ? false : true}>
          IOI Yield Estimate
        </Tab>
      </TabList>
    );
  }

  displayTabListWithChildIOI(){
    return(
      <TabList>
        <Tab disabled={this.props.ioi ? false : true}>
          IOI Overview
        </Tab>
        <Tab disabled={this.props.childIOIList && this.props.childIOIList[0] ? false : true}>
          Tranche 1 Details
        </Tab>        
        <Tab disabled={this.props.childIOIList && this.props.childIOIList[0] && this.props.childIOIList[0].yieldMatrix ? false : true}>
          Tranche 1 Yield Estimate
        </Tab>
        <Tab disabled={this.props.childIOIList && this.props.childIOIList[1] ? false : true}>
          Tranche 2 Details
        </Tab>        
        <Tab disabled={this.props.childIOIList && this.props.childIOIList[1] && this.props.childIOIList[1].yieldMatrix ? false : true}>
          Tranche 2 Yield Estimate
        </Tab>
      </TabList>
    );
  }

  displayTabPanelForIOI(){
    return(
      <span>
        <TabPanel>
          {this.displaySelectedIOI(this.props.ioi, false)}
        </TabPanel>
        <TabPanel>
          {this.props.ioi && this.props.ioi.yieldMatrix ? this.displayYieldMatrix(this.props.ioi.yieldMatrix) : ''}
        </TabPanel>
      </span>
    );
  }

  displayTabPanelWithChildIOI(){
    return(
      <span>
        <TabPanel>
          {this.displaySelectedIOI(this.props.ioi, true)}
        </TabPanel>
        <TabPanel>
          {this.props.childIOIList && this.props.childIOIList[0] ? this.displaySelectedIOI(this.props.childIOIList[0], false) : ''}
        </TabPanel>                
        <TabPanel>
          {this.props.childIOIList && this.props.childIOIList[0] && this.props.childIOIList[0].yieldMatrix ? this.displayYieldMatrix(this.props.childIOIList[0].yieldMatrix) : ''}
        </TabPanel>
        <TabPanel>
          {this.props.childIOIList && this.props.childIOIList[1] ? this.displaySelectedIOI(this.props.childIOIList[1], false) : ''}
        </TabPanel>                
        <TabPanel>
          {this.props.childIOIList && this.props.childIOIList[1] && this.props.childIOIList[1].yieldMatrix ? this.displayYieldMatrix(this.props.childIOIList[1].yieldMatrix) : ''}
        </TabPanel>        
      </span>
    );
  }

  render(){
    return(
      <div>
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >
            <br/>
            <h2>Indication of Interest (IOI)</h2>
            <br/>
            <p>See IOI overview below - select tabs for more detail.</p>
            <br/>
            <Tabs>
              {this.props.ioi && this.props.ioi.childIOIList ? this.displayTabListWithChildIOI() : this.displayTabListForIOI()}
              {this.props.ioi && this.props.ioi.childIOIList ? this.displayTabPanelWithChildIOI() : this.displayTabPanelForIOI()}
            </Tabs>      
            {this.displayViewAttachedRFPButton()}
            {this.displayEditIOIButton()}
            {
              // this.displayRevokeIOIButton()
            }
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
  let rObject = {
    childIOIList : []
  };

  if(state.ioiList.ioi){
    if(Array.isArray(state.ioiList.ioi)){
      rObject.ioi = state.ioiList.ioi[0];
  
      if(state.ioiList.ioi[1])
        rObject.childIOIList.push(state.ioiList.ioi[1]);
  
      if(state.ioiList.ioi[2])
        rObject.childIOIList.push(state.ioiList.ioi[2]);
      
    } else {
      rObject.ioi = state.ioiList.ioi;
    }

  }

  if(state.link.linkList){
    rObject.link = state.link.linkList[0];
  }

  if(state.finalTerm.finalTerm){
    rObject.finalTerm = state.finalTerm.finalTerm[0];
  }

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
    fetchRFPAction            : fetchRFPAction,
    inviteLenderAction        : inviteLenderAction,
    fetchIOIAction            : fetchIOIAction,
    getLinkWithIOIAction  : getLinkWithIOIAction,
    fetchFinalIOIAction         : fetchFinalIOIAction,
    fetchRFPByIOIAction         : fetchRFPByIOIAction,
    revokeIOI                   : revokeIOI
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IOIDetail);
