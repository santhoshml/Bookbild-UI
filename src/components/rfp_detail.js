import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { addRFPToFavoritesAction, removeRFPFromFavoritesAction, getRFPFromFavoritesAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import Constants from '../utils/constants';
import cUtils from '../utils/common_utils';
import dateFormat from 'dateformat';
import moment from 'moment';


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
    let rfp = lsUtils.getValue(Constants.KEY_RFP_OBJECT);
    if(rfp && rfp.rfpId !== this.props.params.id){
      rfp = null;
    }
    let user = lsUtils.getValue(Constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(Constants.KEY_COMPANY_OBJECT);
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
    }
    // else {
    //   this.props.fetchRFPAction(this.props.params.id)
    //     .then(() => {
    //       console.log('I am in the get result');
    //       this.setState({
    //         rfp : this.props.rfp
    //       });
    //   });
    //
    //   // and check if its his favorite
    //   this.props.getRFPFromFavoritesAction(user.userId, this.props.params.id)
    //     .then(() => {
    //       console.log('I am in the get result');
    //       this.setState({
    //         isFavorite : this.props.isFavorite,
    //         favorite : this.props.favorite
    //       });
    //   });
    // }
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
              <td>Structure</td>
              <td>{cUtils.getDisplayValue(rfp.product)}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>{cUtils.computeStatus(rfp.expiryDt)}</td>
            </tr>
            <tr>
              <td>Deal Size</td>
              <td>{rfp.dealSize}</td>
            </tr>
            <tr>
              <td>LTM EBITDA</td>
              <td>{rfp.ltmEbitda}</td>
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
              <td>LTM Revenue</td>
              <td>{rfp.ltmRevenue}</td>
            </tr>
            <tr>
              <td>UoF</td>
              <td>{cUtils.getDisplayValue(rfp.requestType)}</td>
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
      <Link to={"/ioiList/"+this.state.rfp.rfpId+"/"+Constants.IOI_FOR_RFP} className="btn btn-primary">
        View Intrest List
      </Link>
      &nbsp;&nbsp;&nbsp;
      </span>);
    } else {
      return(<span></span>);
    }
  }

  displayEditRFPButton(){
    if(this.state.rfp && this.state.company.companyId === this.state.rfp.createdByCompanyId){
      return( <span>
      <Link to={"/createRFP/"+Constants.RFP_EDIT} className="btn btn-primary">
        Edit RFP
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
        <Link to="/myProfile" className="btn btn-primary">
          Profile
        </Link>
        &nbsp;&nbsp;&nbsp;
        {this.displayViewIntrestListButton()}
        {this.displayEditRFPButton()}
        <Link to="/" className="btn btn-primary">
          Logout
        </Link>
        {this.state.rfp ? this.displayCompanyDesc() : ''}
        {this.state.rfp ? this.displayOutstandingRFP() : ''}
        {this.displayFinancialDetails()}
        <br/>
        <br/>
        {this.displayFavoritesButton()}

        &nbsp;&nbsp;&nbsp;
        <Link to={"/createIOI/"+Constants.IOI_NEW} className="btn btn-primary">
          CREATE IOI
        </Link>
        &nbsp;&nbsp;&nbsp;
        <Link to="/industryResearch" className="btn btn-primary">
          INDUSTRY RESEARCH
        </Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  // Whatever is returned will show up as props
  console.log('state:'+JSON.stringify(state));

  let rObject = {
    isFavorite : state.rfpDetails.isFavorite,
    favorite  : state.rfpDetails.rfpFavoritesJSON
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
    getRFPFromFavoritesAction : getRFPFromFavoritesAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RFPDetail);
