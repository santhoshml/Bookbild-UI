import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { fetchRFPAction, addRFPToFavoritesAction, removeRFPFromFavoritesAction, getRFPFromFavoritesAction, getIOIForRFPAndCompanyAction } from '../actions/index';
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
    // console.log('I am in componentWillReceiveProps');
    // console.log('nextProps :'+ JSON.stringify(nextProps));
    if(nextProps.isFavorite){
      this.setState({
        isFavorite : nextProps.isFavorite
      });
    }

    if(nextProps.favorite){
      this.setState({
        favorite : nextProps.favorite
      });
    }

    if(nextProps.rfp){
      this.setState({
        rfp : nextProps.rfp
      });
    }
  }

  displayCompanyDesc(){
    if(this.state.rfp){
      return(
        <div>
          <br/>
          <p>{this.state.rfp.companyDesc}</p>
          <br/>
          <br/>
        </div>
      );
    }
  }

  displayOutstandingRFP(){
    let rfp = this.state.rfp;
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
                <td>Sponsored</td>
                <td>{cUtils.getDisplayValue(rfp.isSponsored)}</td>
              </tr>
              <tr>
                <td>UoF</td>
                <td>{cUtils.getDisplayValue(rfp.requestType)}</td>
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
    // console.log('I am in removeFromFavorites ');
    let props= {
      favoriteId : this.props.favorite.favoriteId,
      contactId : this.state.user.contactId
    };
    this.props.removeRFPFromFavoritesAction(props)
      .then(() => {
        this.setState({isFavorite : false, favorite : null})
      });
  }

  addToFavorites(){
    // console.log('I am in addToFavorites ');
    var props={
      userId : this.state.user.userId,
      rfpId : this.state.rfp.rfpId,
      contactId : this.state.user.contactId
    };
    this.props.addRFPToFavoritesAction(props)
      .then(() => {
        this.setState({isFavorite : true, favorite : this.state.favorite})
      });
  }

  displayViewIntrestListButton(){
    if(this.state.rfp && this.state.rfp.createdByCompanyId === this.state.company.companyId){
      return( <span>
        &nbsp;&nbsp;&nbsp;
        <Link to={constants.ROUTES_MAP.IOI_LIST+"/"+this.state.rfp.rfpId+"/"+constants.IOI_FOR_RFP} className="btn btn-primary">
          View Interest List
        </Link>
      </span>);
    } else {
      return(<span></span>);
    }
  }

  displayEditRFPButton(){
    if(this.state.rfp && this.state.company.companyId === this.state.rfp.createdByCompanyId){
      return( <span>
        &nbsp;&nbsp;&nbsp;
        <Link to={constants.ROUTES_MAP.CREATE_RFP+"/"+constants.RFP_EDIT+"/"+this.state.rfp.rfpId} className="btn btn-primary">
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
            <Link to={constants.ROUTES_MAP.CREATE_IOI+"/"+constants.IOI_EDIT+"/"+this.props.ioi.ioiId} className="btn btn-primary">
              EDIT IOI
            </Link>
          </span>
        );
      } else if(this.state.rfp){
      return(
        <span>
          &nbsp;&nbsp;&nbsp;
          <Link to={constants.ROUTES_MAP.CREATE_IOI+"/"+constants.IOI_NEW+"/"+this.state.rfp.rfpId} className="btn btn-primary">
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
    let rfp = this.state.rfp;
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

  render(){
    // console.log('this.props.ioi:'+JSON.stringify(this.props.ioi));
    // console.log('In render :'+ JSON.stringify(this.state.rfp));
    return(
      <div>
        <Header/>
        <div style={{ display: 'flex' }}>          
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >
            <br/>
            <br/>
            <Tabs>
              <TabList>
                <Tab disabled={this.state.rfp ? false : true}>
                  RFP Details
                </Tab>
                <Tab disabled={this.state.rfp ? false : true}>
                  Company Overview
                </Tab>
                <Tab disabled={this.state.rfp && this.state.rfp.category.toUpperCase() === 'ABL' ? false : true}>
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
                {this.displayCollateralInfo()}
              </TabPanel>
            </Tabs>
            {this.displayFavoritesButton()}
            {this.displayIOIButton()}
            {this.displayViewIntrestListButton()}
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
  // console.log('state:'+JSON.stringify(state));

  let rObject = {
    isFavorite  : state.rfpDetails.isFavorite,
    favorite    : state.rfpDetails.rfpFavoritesJSON,
    ioi         : (state.ioiList &&  state.ioiList.ioiList)? state.ioiList.ioiList[0] : null
  };

  if(state.rfpList.rfpList){
    rObject.rfp = state.rfpList.rfpList[0];
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
    fetchRFPAction : fetchRFPAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RFPDetail);
