import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { getRFPFromFavoritesAction, fetchRFPAction, inviteLenderAction, fetchIOIAction, getLinkWithRFPAndIOIAction } from '../actions/index';
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

class IOIDetail extends Component{
  constructor(props){
    super(props);
    this.state = {
			rfp : null,
      user : null,
      company : null,
      showYieldMatrix : false
		}
  }

  componentWillMount() {
    // console.log('In componentWillMount of IOI_DETAIL');
    // this.props.fetchAllRFPAction();
    let ioi = lsUtils.getValue(constants.KEY_SELECTED_IOI_OBJECT);
    // console.log('ioi:'+JSON.stringify(ioi));
    // let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    this.setState({
      disableInvite : false,
      ioi : ioi,
      company : company
    });

    this.props.fetchRFPAction(ioi.rfpId)
    //   .then(() => {
    //     // console.log('I am in the get result');
    //     lsUtils.setValue(constants.KEY_RFP_OBJECT, this.props.rfp);
    //     this.setState({
    //       rfp : this.props.rfp
    //     });
    // });

    this.props.fetchIOIAction(ioi.ioiId)
    // .then(() => {
    //   // console.log('I am in the get result for ioi');
    //   lsUtils.setValue(constants.KEY_SELECTED_IOI_OBJECT, this.props.ioi);
    //   this.setState({
    //     ioi : this.props.ioi
    //   });
    // });

    // console.log('rfpId:'+ioi.rfpId+', ioiId:'+ioi.ioiId);
    this.props.getLinkWithRFPAndIOIAction(ioi.rfpId, ioi.ioiId)
    .then((data) => {
      // console.log('got response for getLinkDocsWithRFPAndIOIAction, data:'+JSON.stringify(data));
      if(data.payload.status === 200 
        && data.payload.data.status === 'SUCCESS' 
        && data.payload.data.data.length === 1){
        this.setState({
          disableInvite : true
        });
      }
    });

  }

  componentWillReceiveProps(nextProps){
    console.log('In componentWillReceiveProps');
    
    //set ioi
    if(this.props.ioi){
      lsUtils.setValue(constants.KEY_SELECTED_IOI_OBJECT, this.props.ioi);
      this.setState({
        ioi : this.props.ioi
      });
    }

    //set rfp
    if(this.props.rfp){
      // console.log('this.props.rfp:'+JSON.stringify(this.props.rfp));
      lsUtils.setValue(constants.KEY_RFP_OBJECT, this.props.rfp);
      this.setState({
        rfp : this.props.rfp
      });
    }
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
    // console.log('In displaySelectedIOI, ioi:'+JSON.stringify(ioi));
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
              <td>Yield</td>
              <td><b>{ioi.yield}</b></td>
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
    // console.log('this.state.ioi:'+JSON.stringify(this.state.ioi));
    // console.log('this.state.company:'+JSON.stringify(this.state.company));
    // console.log('this.state.rfp:'+JSON.stringify(this.state.rfp));
    if(this.state.ioi.createdByCompanyId === this.state.company.companyId
      || (this.state.rfp && this.state.company.companyId === this.state.rfp.createdByCompanyId)){
      return( <span>
      <Link to={constants.ROUTES_MAP.RFP_DETAIL+"/"+this.state.ioi.rfpId} className="btn btn-primary">
        View Attached RFP
      </Link>
      &nbsp;&nbsp;&nbsp;
      </span>);
    } else {
      return(<span></span>);
    }
  }

  inviteLender(values){
    let that=this;
    JSAlert.confirm("Are you sure you want to invite the Lender ?")
    .then(function(result){
      if(!result){
        console.log('user did not want to invite, he pressed no');
      } else {
        let data = {
          rfpId: that.state.rfp.rfpId,
          ioiId: that.state.ioi.ioiId,
          borrowerCompanyId : that.state.rfp.createdByCompanyId,
          lenderCompanyId : that.state.ioi.createdByCompanyId,
          name : that.state.rfp.companyName.substring(0, 10)+'_',
          accessToLender : { 
            "DOCUMENTS" : false, 
            "WGL" : false, 
            "QCOMPLIANCE" :   false, 
            "DEAL_TEAM" :   false 
          }
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
    if(this.state.rfp && this.state.company.companyId === this.state.rfp.createdByCompanyId && !this.state.disableInvite){
      return( <span>
      <Link to="#" onClick={this.inviteLender.bind(this)} className="btn btn-primary">
        Invite for second round
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
      <Link to={constants.ROUTES_MAP.CREATE_IOI+"/"+constants.IOI_EDIT} className="btn btn-primary">
        Edit IOI
      </Link>
      &nbsp;&nbsp;&nbsp;
      </span>);
    } else {
      return(<span></span>);
    }
  }

  flipYieldDisplay(){
    // console.log('I am in flipYieldDisplay');
    let flipVal = !this.state.showYieldMatrix;
    this.setState({
      showYieldMatrix : flipVal
    });
  }

  displayYieldMatrix(){
    if(this.state.ioi.yieldMatrix){
      var yieldMatrixRender = this.state.ioi.yieldMatrix.map(function(row){
        // console.log('row:'+JSON.stringify(row));
        return(<tr key={row.period}>
            <td>{row.period}</td>
            <td><NumberFormat value={row.cashFlow ? roundTo(Number(row.cashFlow)/1000000, 2) : 0} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
            <td>{row.startDate}</td>
            <td><NumberFormat value={row.amtAtBegin ? roundTo(Number(row.amtAtBegin)/1000000, 2): 0} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
            <td><NumberFormat value={row.amort ? roundTo(Number(row.amort)/1000000, 2) : 0} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
            <td><NumberFormat value={row.amtAtEnd ? roundTo(Number(row.amtAtEnd)/1000000, 2) : 0} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
            <td><NumberFormat value={row.intrestPaymet ? roundTo(Number(row.intrestPaymet)/1000000, 2) : 0} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
            <td><NumberFormat value={row.cashFlow ? roundTo(Number(row.cashFlow)/1000000, 2) : 0} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
          </tr>
        );
      });
      return(<div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Period</th>
              <th>Cash Flows($mm)</th>
              <th>Date</th>
              <th>Outstanding Amount Begining of Quater($mm)</th>
              <th>Amortization ($mm)</th>
              <th>Outstanding Amount Begining of Period($mm)</th>
              <th>Interest Payment($mm)</th>
              <th>Cash Flow($mm)</th>
            </tr>
          </thead>
          <tbody>
            {yieldMatrixRender}
          </tbody>
        </table>
        </div>);
    }
  }

  displayYieldMatrixSubtitle(){
    return(
      <a onClick={this.flipYieldDisplay.bind(this)} href="#">
      <h3>
          <i className={this.state.showYieldMatrix ? "fa fa-folder-open-o" : "fa fa-folder-o"} aria-hidden="true">
          <span className="indent-after">Yield Estimate</span>
        </i>
      </h3>
      </a>
    );
  }

  render(){
    // console.log('I am in IOI_DETAIL');
    return(
      <div>
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >
            {this.state.ioi ? this.displaySelectedIOI() : ''}
            <br/>
            {this.displayYieldMatrixSubtitle()}
            {this.state.showYieldMatrix ? this.displayYieldMatrix() : ''}
            <br/>
            <br/>
            {this.displayViewAttachedRFPButton()}
            {this.displayEditIOIButton()}
            {this.displayInviteButton()}
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
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
  // Whatever is returned will show up as props
  // console.log('In IOI_DETAIL, state:'+JSON.stringify(state));
  let rObject = {};
  if(state.rfpList.rfpList){
    // console.log('state.rfpList.rfpList:'+JSON.stringify(state.rfpList.rfpList));
    rObject.rfp = state.rfpList.rfpList[0];
  }
  if(state.ioiList.ioi){
    rObject.ioi = state.ioiList.ioi[0];
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
    getLinkWithRFPAndIOIAction : getLinkWithRFPAndIOIAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IOIDetail);
