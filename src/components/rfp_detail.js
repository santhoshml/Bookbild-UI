import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { fetchRFPAction
  , addRFPToFavoritesAction
  , removeRFPFromFavoritesAction
  , getRFPFromFavoritesAction
  , getIOIForRFPAndCompanyAction
  , fetchFinalTermListForRFPAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import cUtils from '../utils/common_utils';
import NumberFormat from 'react-number-format';
import dateFormat from 'dateformat';
import moment from 'moment';
import NavBar from './sidebar';
import Header from './header';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { ToastContainer, toast } from 'react-toastify';

class RFPDetail extends Component{
  constructor(props){
    super(props);
    this.state = {
			rfp : null,
      user : null,
      company : null
		}
  }

  componentWillMount() {
    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    let paramId = this.props.match.params.id;
    this.props.fetchRFPAction(paramId);
    this.props.fetchFinalTermListForRFPAction(paramId);

    this.props.getRFPFromFavoritesAction(user.userId, paramId)

    // this call is to get the IOI created for this RFP by this comapny
    this.props.getIOIForRFPAndCompanyAction(paramId, company.companyId);
    this.setState({
      user : user,
      company : company,
      isFavorite : false
    });
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.isFavorite){
      this.setState({
        isFavorite : nextProps.isFavorite
      });
    }
  }

  displayCompanyDesc(){
    if(this.props.rfp){
      return(
        <div>
          <br/>
          <p>{this.props.rfp.companyDesc}</p>
          <br/>
          <br/>
        </div>
      );
    }
  }

  displayCompanyName(){
    let {rfp} = this.props;
    if(rfp.createdByCompanyId === this.state.user.companyId){
      return(<tr>
        <td>Company Name</td>
        <td>{rfp.companyName}</td>
        </tr>);
    }
  }

  displayOutstandingRFP(){
    let {rfp} = this.props;
    if(rfp){
      return(
        <div>
          <br/>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <td>Status</td>
                <td>{cUtils.computeStatus(rfp.expiryDt)}</td>
              </tr>
              {this.displayCompanyName()}
              <tr>
                <td>Deal Size</td>
                <td>{cUtils.formatCurrencyToDisplay(rfp.dealSize)}</td>
              </tr>
              <tr>
                <td>Tenor</td>
                <td>{rfp.tenor}</td>
              </tr>
              <tr>
                <td>Category</td>
                <td>{cUtils.getDisplayValue(rfp.category)}</td>
              </tr>
              <tr>
                <td>Structure</td>
                <td>{cUtils.getDisplayValue(rfp.product)}</td>
              </tr>
              <tr>
                <td>Company Sector</td>
                <td>{rfp.sector}</td>
              </tr>
              <tr>
                <td>UoF</td>
                <td>{cUtils.getDisplayValue(rfp.requestType)}</td>
              </tr>              
              <tr>
                <td>Sponsored?</td>
                <td>{cUtils.getDisplayValue(rfp.isSponsored)}</td>
              </tr>
              <tr>
                <td>LTM Revenue</td>
                <td>{cUtils.formatCurrencyToDisplay(rfp.ltmRevenue)}</td>
              </tr>
              <tr>
                <td>LTM EBITDA</td>
                <td>{cUtils.formatCurrencyToDisplay(rfp.ltmEbitda)}</td>
              </tr>
              <tr>
                <td>Region</td>
                <td>{rfp.region}</td>
              </tr>
              <tr>
                <td># of Term Sheets</td>
                <td>{rfp.numOfIOI}</td>
              </tr>
              <tr>
                <td>Expiry Dt</td>
                <td>{dateFormat(moment(rfp.expiryDt), 'longDate')}</td>
              </tr>
              <tr>
                <td>#days to expiry</td>
                <td>{cUtils.daysBetween(moment(rfp.expiryDt), new Date())}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  }

  displayFinancialDetails(){
    return(
      <div>
        <br/>
        <br/>
        <h2>Collateral Base: Encumbered Assets(E) / Unencumbered Assets(U)</h2>
      </div>
    );
  }

  displayFavoritesButton(){
    return(
      <span>
        {this.state.isFavorite
          ? <button onClick={this.removeFromFavorites.bind(this)} className="btn btn-primary">REMOVE from FAVORITES</button>
          : <button onClick={this.addToFavorites.bind(this)} className="btn btn-primary">ADD to FAVORITES</button>
        }
      </span>
    );
  }

  removeFromFavorites(){
    let props= {
      favoriteId : this.props.favorite.favoriteId,
      contactId : this.state.user.contactId
    };
    this.props.removeRFPFromFavoritesAction(props)
      .then((data) => {
        if(data.payload.status === 200 && data.payload.data.status === 'SUCCESS'){
          toast(constants.NOTIFICATIONS.REMOVE_FROM_FAVORITES_SUCCESS, {
            className : "notification-success"
          });
          this.setState({isFavorite : false, favorite : null})
        } else {
          toast(constants.NOTIFICATIONS.REMOVE_FROM_FAVORITES_FAILED, {
            className : "notification-error"
          });          
        }
      });
  }

  addToFavorites(){
    var props={
      userId : this.state.user.userId,
      rfpId : this.props.rfp.rfpId,
      contactId : this.state.user.contactId
    };
    this.props.addRFPToFavoritesAction(props)
      .then((data) => {
        if(data.payload.status === 200 && data.payload.data.status === 'SUCCESS'){
          toast(constants.NOTIFICATIONS.ADD_TO_FAVORITES_SUCCESS, {
            className : "notification-success"
          });
          this.props.getRFPFromFavoritesAction(this.state.user.userId, this.props.match.params.id)
          this.setState({isFavorite : true, favorite : this.props.favorite})
        }else {
          toast(constants.NOTIFICATIONS.ADD_TO_FAVORITES_FAILED, {
            className : "notification-error"
          });
        }
      });
  }

  displayViewIntrestListButton(){
    if(this.props.rfp && this.props.rfp.createdByCompanyId === this.state.company.companyId){
      return( <span>
        &nbsp;&nbsp;&nbsp;
        <Link to={constants.ROUTES_MAP.IOI_LIST+"/"+this.props.rfp.rfpId+"/"+constants.IOI_FOR_RFP} className="btn btn-primary">
          View Book
        </Link>
      </span>);
    } else {
      return(<span></span>);
    }
  }

  displayFinalTermListButton(){
    if(this.props.rfp 
        && this.props.rfp.createdByCompanyId === this.state.company.companyId
        && this.props.finalTermList && this.props.finalTermList.length > 0){
      return( <span>
        &nbsp;&nbsp;&nbsp;
        <Link to={constants.ROUTES_MAP.FINAL_TERM_LIST+"/"+this.props.rfp.rfpId+"/"+constants.FT_FOR_RFP} className="btn btn-primary">
          View Final Book
        </Link>
      </span>);
    } else {
      return(<span></span>);
    }
  }

  displayEditRFPButton(){
    if(this.props.rfp && this.state.company.companyId === this.props.rfp.createdByCompanyId){
      return( <span>
        &nbsp;&nbsp;&nbsp;
        <Link to={constants.ROUTES_MAP.EDIT_RFP+"/"+this.props.rfp.rfpId} className="btn btn-primary">
          Edit RFP
        </Link>
      </span>);
    } else {
      return(<span></span>);
    }
  }

  displayIOIButton(){
    if(this.state.user && this.state.user.role === constants.KEY_LENDER){
      if(this.props.ioi){
        return(
          <span>
            &nbsp;&nbsp;&nbsp;
            <Link to={constants.ROUTES_MAP.IOI_DETAIL+"/"+this.props.ioi.ioiId} className="btn btn-primary">
              VIEW IOI
            </Link>
          </span>
        );
      } else if(this.props.rfp){
      return(
        <span>
          &nbsp;&nbsp;&nbsp;
          <Link to={constants.ROUTES_MAP.CREATE_IOI+"/"+this.props.rfp.rfpId} className="btn btn-primary">
            CREATE IOI
          </Link>
        </span>
      )};
    }
  }

  displayIndustryResearchButton(){
    return(<span>
        &nbsp;&nbsp;&nbsp;
        <Link to={constants.ROUTES_MAP.INDUSTRY_RESEARCH} className="btn btn-primary">
          INDUSTRY RESEARCH
        </Link>
      </span>);
  }

  displayMakePitchButton(){
    if(this.state.user && this.state.user.role === constants.KEY_LENDER){
      return(
        <span>
          &nbsp;&nbsp;&nbsp;
          <Link to={constants.ROUTES_MAP.CREATE_IOI+"/"+constants.PITCH_NEW} className="btn btn-primary">
            MAKE A PITCH
          </Link>
        </span>
      );
    }
  }

  displayCollateralInfo(){
    let rfp = this.props.rfp;
    if(rfp){
      return (
        <div >
          <br/>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Accounts Receivable</td>
                <td>{cUtils.formatCurrencyToDisplay(rfp.acctRecvGrossAmt)}</td>
                <td>{rfp.acctRecvComment}</td>
              </tr>
              <tr>
                <td>Inventory</td>
                <td>{cUtils.formatCurrencyToDisplay(rfp.invtryGrossAmt)}</td>
                <td>{rfp.invtryComment}</td>
              </tr>
              <tr>
                <td>PP&E</td>
                <td>{cUtils.formatCurrencyToDisplay(rfp.ppeGrossAmt)}</td>
                <td>{rfp.ppeComment}</td>
              </tr>
              <tr>
                <td>Machinery & Equipment</td>
                <td>{cUtils.formatCurrencyToDisplay(rfp.maeGrossAmt)}</td>
                <td>{rfp.maeComment}</td>
              </tr>
              <tr>
                <td>Real Estate</td>
                <td>{cUtils.formatCurrencyToDisplay(rfp.realEstGrossAmt)}</td>
                <td>{rfp.realEstComment}</td>
              </tr>
              <tr>
                <td>Other</td>
                <td>{cUtils.formatCurrencyToDisplay(rfp.otherGrossAmt)}</td>
                <td>{rfp.otherComment}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  }

  displayCompanyManagementContact(){
    if(this.props.rfp && this.props.rfp.contactObject){
      let {rfp} = this.props;
      return(
        <div>
          <br/>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <td>Full Name</td>
                <td>{rfp.contactObject.fullName}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{rfp.contactObject.email}</td>
              </tr>
              <tr>
                <td>Phone Number</td>
                <td>{rfp.contactObject.phoneNumber}</td>
              </tr>
              <tr>
                <td>Role</td>
                <td>{rfp.contactObject.contactRole}</td>
              </tr>
            </tbody>
          </table>
          <br/>
          <br/>
        </div>
      );
    }    
  }

  render(){
    return(
      <div>
        <ToastContainer />
        <Header/>
        <div style={{ display: 'flex' }}>          
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >
            <br/>
            <h3>Request for Proposal </h3>
            <br/>
            <p>Click tabs below for more detail.</p>
            <br/>
            <Tabs>
              <TabList>
                <Tab disabled={this.props.rfp ? false : true}>
                  RFP Details
                </Tab>
                <Tab disabled={this.props.rfp ? false : true}>
                  Company Overview
                </Tab>
                <Tab 
                  disabled={this.props.rfp && (this.props.rfp.createdByCompanyId === this.state.company.companyId) ? false : true}>
                  Company Management Contact
                </Tab>
                <Tab>
                  Collateral Information
                </Tab>
              </TabList>
              <TabPanel>
                {this.displayOutstandingRFP()}
              </TabPanel>
              <TabPanel>
                {this.displayCompanyDesc()}
              </TabPanel>
              <TabPanel>
                {this.displayCompanyManagementContact()}
              </TabPanel>
              <TabPanel>
                {this.displayCollateralInfo()}
              </TabPanel>
            </Tabs>
            {this.displayFavoritesButton()}
            {this.displayIOIButton()}
            {this.displayViewIntrestListButton()}
            {this.displayFinalTermListButton()}
            {this.displayEditRFPButton()}
            {this.displayIndustryResearchButton()}
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

  let rObject = {
    isFavorite  : state.rfpDetails.isFavorite,
    favorite    : state.rfpDetails.rfpFavoritesJSON
    
  };

  if(state.ioiList.ioiList){
    if(Array.isArray(state.ioiList.ioiList)){
      rObject.ioi = state.ioiList.ioiList[0];
    } else {
      rObject.ioi = state.ioiList.ioiList;
    }
  }

  if(state.rfpList.rfpList){
    rObject.rfp = state.rfpList.rfpList[0];
  }

  if(state.finalTermList.finalTermList){
    rObject.finalTermList = state.finalTermList.finalTermList;
  }  
  
  return rObject;
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    addRFPToFavoritesAction : addRFPToFavoritesAction,
    removeRFPFromFavoritesAction : removeRFPFromFavoritesAction,
    getRFPFromFavoritesAction : getRFPFromFavoritesAction,
    getIOIForRFPAndCompanyAction : getIOIForRFPAndCompanyAction,
    fetchRFPAction : fetchRFPAction,
    fetchFinalTermListForRFPAction : fetchFinalTermListForRFPAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RFPDetail);
