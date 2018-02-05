import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import DisplayIOIList from './display_IOI_list';
import { fetchIOIListForRFPAction
  , fetchIOIListForLenderCompanyAction
  , fetchIOIListForBorrowerCompanyAction
  , fetchRFPAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import cUtils from '../utils/common_utils';
import ioiUtils from '../utils/ioi_utils';
import constants from '../utils/constants';
import NavBar from './sidebar';
import Header from './header';
import {Table, Column, Cell} from 'fixed-data-table';

class IOIList extends Component{
  constructor(props){
    super(props);
    this.state = {
			ioiList : null,
      ioiCompanyList : null,
      ioiUserList : null,
      clubDealList : null
		}
  }

  componentWillMount() {
    let user    = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);

    if(this.props.match.params.type === constants.IOI_FOR_RFP){
      this.props.fetchIOIListForRFPAction(this.props.match.params.id);
      this.props.fetchRFPAction(this.props.match.params.id);
    } else if(user.role.toLowerCase() === constants.KEY_LENDER.toLowerCase()){
      this.props.fetchIOIListForLenderCompanyAction(company.companyId);
    } else if(user.role.toLowerCase() === constants.KEY_COMPANY.toLowerCase()
      || user.role.toLowerCase() === constants.KEY_FINANCIAL_SPONSOR.toLowerCase()){
        this.props.fetchIOIListForBorrowerCompanyAction(company.companyId);
      }

      this.setState({
        user : user,
        company : company
      });
  }

  displayDescText(){
    if(this.props.match.params.type === constants.IOI_FOR_RFP){
      return(
        <div>
          <h2>IOI List</h2>
          <br/>
          Below is the list of all the Indication of Interest (IOI's) received for the RFP. Click to view more details.
        </div>
      );
    } else if(this.state.user.role.toLowerCase() === constants.KEY_LENDER.toLowerCase()){
      return(
        <div>
          <h2>My IOI List</h2>
          <br/>
          Below is the list of all your Indication of Interest (IOI's). Click to view more details.
        </div>
      );
    } else if(this.state.user.role.toLowerCase() === constants.KEY_COMPANY.toLowerCase()
      || this.state.user.role.toLowerCase() === constants.KEY_FINANCIAL_SPONSOR.toLowerCase()){
        return(
          <div>
            <h2>IOI List</h2>
            <br/>
            Below is the list of all your Indication of Interest (IOI's) received for all your RFP's. Click to view more details.
          </div>
        );
      }    
  }

  componentWillReceiveProps(nextProps){
    if(this.props.match.params.type === constants.IOI_FOR_RFP
      && nextProps.ioiList 
      && nextProps.ioiList != this.props.ioiList
      && nextProps.rfp ){
        let clubDealList = ioiUtils.makeClubDealList(nextProps.ioiList, nextProps.rfp);
        this.setState({
          clubDealList : clubDealList
        });
      } else {
        this.setState({
          clubDealList : null
        });
      }
  }

  displayProductCategory(){
    if(this.props.match.params.type === constants.IOI_FOR_RFP
      && this.props.ioiList && this.props.ioiList.length > 0){
      let productCategoryMap = cUtils.getProductCategories(this.props.ioiList, this.props.ioiCompanyList);
      let catKeys = Object.keys(productCategoryMap);
      return(<div>
          <br/>
          <br/>
          <h3>Comparative Analytics - Lender Terms</h3>
          <table className="table table-striped align-center table-bordered">
            <thead>
              <tr>
                {this.printHeaderForCat(catKeys)}
              </tr>
            </thead>
            <tbody>
              <tr>
                {this.printDataForCat(catKeys, productCategoryMap)}
              </tr>
            </tbody>
          </table>
        </div>);
    }
  }

  printHeaderForCat(list){
    return list.map(function(ele){
      return (<td key={ele}><b>{ele}</b></td>);
    });
  }

  printDataForCat(keys, list){
    return keys.map(function(key){
      let t = '';
      var pArr = list[key];
      for(let k in pArr){
        t= t+'\n'+pArr[k];
      }
      return (<td key={t} className="add-newline">{t}</td>);
    });
  }

  updateWithBlendedCost(){
    for(let i=0; i<this.props.ioiList.length; i++){
      let blendedCostStr = [];      
      let ioi = this.props.ioiList[i];
      for(let j=0; j< this.state.clubDealList.length; j++){
        if(this.inClubDeal(ioi.createdByCompanyId, this.state.clubDealList[j])){
          blendedCostStr.push({
            yield : cUtils.formatPercentToDisplay(this.state.clubDealList[j].yield),
            otherLender : this.getOtherLenderFromClubDeal(ioi.createdByCompanyId, this.state.clubDealList[j])
          });
        }
      }
      this.props.ioiList[i].blendedCost = blendedCostStr;
    }
  }

  getOtherLenderFromClubDeal(cId, cDeal){
    let otherLender=cDeal.lenders[0];
    if(cDeal.lenders[0] === cId)
      otherLender = cDeal.lenders[1];
    
    for(let i=0; i< this.props.ioiCompanyList.length; i++){
      if(this.props.ioiCompanyList[i].companyId === otherLender)
        return this.props.ioiCompanyList[i].companyName;
    }
    return null;
  }

  inClubDeal(cId, cDeal){
    if(cDeal.lenders[0] === cId || cDeal.lenders[1] === cId)
      return true;
    return false;
  }

  displayIOIList(){
    if((!this.props.ioiList) || (this.props.ioiList && this.props.ioiList.length == 0)){
      return (
        <div>
          <h3>NO Indication of interest.</h3>
        </div>
      );
    } else if(this.props.match.params.type === constants.IOI_FOR_RFP){
      if(this.state.clubDealList && this.state.clubDealList.length > 0){
        this.updateWithBlendedCost();
      }
      return(
        <div>
          <DisplayIOIList
            list={this.props.ioiList}
            companyList={this.props.ioiCompanyList}/>
        </div>
      );
    } else {
      return(
        <div>
          <DisplayIOIList
            list={this.props.ioiList}
            companyList={this.props.ioiCompanyList}
            minimalData={true}
            userList={this.props.ioiUserList}/>
        </div>
      );
    }
  }

  displayClubDealData(){
    return this.state.clubDealList.map((cDeal) =>{
      return(
        <tr key={JSON.stringify(cDeal.lenders)}>
          <td>{this.displayLendersInClubDeal(cDeal.lenders)}</td>
          <td>{cUtils.formatCurrencyToDisplayAsElement(cDeal.loanSize)}</td>
          <td>{cUtils.formatPercentToDisplayAsElement(cDeal.yield)}</td>
        </tr>
      );
    });
  }

  displayLendersInClubDeal(list){
    let lName=null;
    for(let i=0; i<this.props.ioiCompanyList.length; i++){
      if(this.props.ioiCompanyList[i].companyId === list[0]
        || this.props.ioiCompanyList[i].companyId === list[1]){
        if(!lName) lName=this.props.ioiCompanyList[i].companyName;
        else lName=lName+', '+this.props.ioiCompanyList[i].companyName
      }
    }
    return lName;
  }

  displayClubDealList(){
    return(
      <div>
        <h3>Potential Club Pairings</h3>
        <p>Below is the list of possible club deals with yield and loan size</p>
        <br/>
        <table className='table table-bordered table-striped'>
          <thead>
            <tr>
              <th>Club Participants</th>
              <th>Total Debt Provided</th>
              <th>Blended Cost of Capital</th>
            </tr>
          </thead>
          <tbody>
            {this.displayClubDealData()}
          </tbody>
        </table>
      </div>
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
            <br/>
            {this.displayDescText()}
            {this.displayProductCategory()}
            <br/>
            <br/>
            {this.displayIOIList()}
            <br/>
            <br/>
            {this.state.clubDealList && this.state.clubDealList.length > 0? this.displayClubDealList() : ''}
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

  let rObject =  {
    ioiList: state.ioiList.ioiList,
    ioiCompanyList : cUtils.maskCompanyName(state.ioiList.ioiCompanyList),
    ioiUserList : state.ioiList.ioiUserList,
    rfp : state.rfpList.rfpList ? state.rfpList.rfpList[0] : null
  };

  return rObject;
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    fetchIOIListForRFPAction: fetchIOIListForRFPAction,
    fetchIOIListForLenderCompanyAction : fetchIOIListForLenderCompanyAction,
    fetchIOIListForBorrowerCompanyAction : fetchIOIListForBorrowerCompanyAction,
    fetchRFPAction : fetchRFPAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IOIList);
