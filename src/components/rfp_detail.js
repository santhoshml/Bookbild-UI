import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { addRFPToFavoritesAction, removeRFPFromFavoritesAction, getRFPFromFavoritesAction, getIOIForRFPAndCompanyAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import cUtils from '../utils/common_utils';
import NumberFormat from 'react-number-format';
import dateFormat from 'dateformat';
import moment from 'moment';
import NavBar from './sidebar';
import Header from './header';

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
    // this.props.fetchAllRFPAction();
    let rfp = lsUtils.getValue(constants.KEY_RFP_OBJECT);
    if(rfp && rfp.rfpId !== this.props.match.params.id){
      rfp = null;
    }
    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    this.setState({
      rfp : rfp,
      user : user,
      company : company,
      isFavorite : false
    });

    if(rfp){
      this.props.getRFPFromFavoritesAction(user.userId, rfp.rfpId)
        .then(() => {
          console.log('I am in the get result');
          this.setState({
            isFavorite : this.props.isFavorite,
            favorite : this.props.favorite
          });
      });

      // this call is to get the IOI created for this RFP by this comapny
      this.props.getIOIForRFPAndCompanyAction(rfp.rfpId, company.companyId);
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

  displayOutstandingRFP(){
    let rfp = this.state.rfp;
    return(
      <div>
        <br/>
        <br/>
        <h2>Outstanding RFP</h2>
        <table className="table table-striped">
          <tbody>
            <tr>
              <td>Status</td>
              <td>{cUtils.computeStatus(rfp.expiryDt)}</td>
            </tr>
            <tr>
              <td>Deal Size</td>
              <td>{rfp.dealSize}</td>
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
              <td><NumberFormat value={rfp.ltmRevenue} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
            </tr>
            <tr>
              <td>LTM EBITDA</td>
              <td><NumberFormat value={rfp.ltmEbitda} displayType={'text'} thousandSeparator={true} prefix={'$'} /></td>
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
    console.log('I am in removeFromFavorites ');
    this.props.removeRFPFromFavoritesAction(this.props.favorite.favoriteId)
      .then(() => {
        this.setState({isFavorite : false, favorite : null})
      });
  }

  addToFavorites(){
    console.log('I am in addToFavorites ');
    this.props.addRFPToFavoritesAction(this.state.user.userId, this.state.rfp.rfpId)
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
        <Link to={constants.ROUTES_MAP.CREATE_RFP+"/"+constants.RFP_EDIT} className="btn btn-primary">
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
        lsUtils.setValue(constants.KEY_SELECTED_IOI_OBJECT, this.props.ioi);
        return(
          <span>
            &nbsp;&nbsp;&nbsp;
            <Link to={constants.ROUTES_MAP.CREATE_IOI+"/"+constants.IOI_EDIT} className="btn btn-primary">
              EDIT IOI
            </Link>
          </span>
        );
      } else {
      return(
        <span>
          &nbsp;&nbsp;&nbsp;
          <Link to={constants.ROUTES_MAP.CREATE_IOI+"/"+constants.IOI_NEW} className="btn btn-primary">
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
    if(rfp.category.toUpperCase() === 'ABL'){
      return (
        <div className="div-border">
          <h4 className="display-center">Collateral</h4>
          <br/>
          <div className={`row`}>
            <div className={`form-group col-xs-3 col-md-3`}>
              <label>Accounts Receivable :</label><br/>
            </div>
            <div className={`form-group col-xs-3 col-md-3`}>
              <NumberFormat value={cUtils.parseNumber(rfp.acctRecvGrossAmt)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            </div>
            <div className={`form-group col-xs-6 col-md-6`}>
              {rfp.acctRecvComment}
            </div>
          </div>
          <div className={`row`}>
            <div className={`form-group col-xs-3 col-md-3`}>
              <label>Inventory :</label><br/>
            </div>
            <div className={`form-group col-xs-3 col-md-3`}>
              <NumberFormat value={cUtils.parseNumber(rfp.invtryGrossAmt)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            </div>
            <div className={`form-group col-xs-6 col-md-6`}>
              {rfp.invtryComment}
            </div>
          </div>
          <div className={`row`}>
            <div className={`form-group col-xs-3 col-md-3`}>
              <label>PP&E :</label><br/>
            </div>
            <div className={`form-group col-xs-3 col-md-3`}>
              <NumberFormat value={cUtils.parseNumber(rfp.ppeGrossAmt)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            </div>
            <div className={`form-group col-xs-6 col-md-6`}>
              {rfp.ppeComment}
            </div>
          </div>
          <div className={`row`}>
            <div className={`form-group col-xs-3 col-md-3`}>
              <label>Machinery & Equipment :</label><br/>
            </div>
            <div className={`form-group col-xs-3 col-md-3`}>
              <NumberFormat value={cUtils.parseNumber(rfp.maeGrossAmt)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            </div>
            <div className={`form-group col-xs-6 col-md-6`}>
              {rfp.maeComment}
            </div>
          </div>
          <div className={`row`}>
            <div className={`form-group col-xs-3 col-md-3`}>
              <label>Real Estate :</label><br/>
            </div>
            <div className={`form-group col-xs-3 col-md-3`}>
              <NumberFormat value={cUtils.parseNumber(rfp.realEstGrossAmt)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            </div>
            <div className={`form-group col-xs-6 col-md-6`}>
              {rfp.realEstComment}
            </div>
          </div>
          <div className={`row`}>
            <div className={`form-group col-xs-3 col-md-3`}>
              <label>Other :</label><br/>
            </div>
            <div className={`form-group col-xs-3 col-md-3`}>
              <NumberFormat value={cUtils.parseNumber(rfp.otherGrossAmt)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
            </div>
            <div className={`form-group col-xs-6 col-md-6`}>
              {rfp.otherComment}
            </div>
          </div>
        </div>
      );
    }
  }

  render(){
    console.log('this.props.ioi:'+JSON.stringify(this.props.ioi));
    return(
      <div>
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >
            {this.state.rfp ? this.displayCompanyDesc() : ''}
            {this.state.rfp ? this.displayOutstandingRFP() : ''}
            {this.state.rfp ? this.displayCollateralInfo() : ''}
            <br/>
            <br/>
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
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  // Whatever is returned will show up as props
  // console.log('state:'+JSON.stringify(state));

  let rObject = {
    isFavorite  : state.rfpDetails.isFavorite,
    favorite    : state.rfpDetails.rfpFavoritesJSON,
    ioi         : (state.ioiList &&  state.ioiList.ioiList)? state.ioiList.ioiList[0] : null
  };

  // if(state.rfpList.rfpList){
  //   rObject.rfp = state.rfpList.rfpList[0];
  // }
  //
  return rObject;
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    addRFPToFavoritesAction : addRFPToFavoritesAction,
    removeRFPFromFavoritesAction : removeRFPFromFavoritesAction,
    getRFPFromFavoritesAction : getRFPFromFavoritesAction,
    getIOIForRFPAndCompanyAction : getIOIForRFPAndCompanyAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RFPDetail);
