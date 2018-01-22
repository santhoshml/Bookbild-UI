import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import DisplayTermSheetList from './display_finalTerm_list';
import { fetchFinalTermListForLenderCompany
  , fetchFinalTermListForBorrowerCompany
  , fetchFinalTermListForRFPAction
  , fetchRFPAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import cUtils from '../utils/common_utils';
import ioiUtils from '../utils/ioi_utils';
import constants from '../utils/constants';
import NavBar from './sidebar';
import Header from './header';

class FinalTermList extends Component{
  constructor(props){
    super(props);
  }

  componentWillMount() {
    // console.log('In display final term list, componentWillMount');
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let displayMinimalData = true;

    // console.log('user:'+JSON.stringify(user));
    // console.log('companyId :'+JSON.stringify(company));
    if(this.props.match.params.type === constants.FT_FOR_RFP){
      this.props.fetchFinalTermListForRFPAction(this.props.match.params.id);
      this.props.fetchRFPAction(this.props.match.params.id);
      displayMinimalData = false;
    } else if(user.role.toLowerCase() === constants.KEY_LENDER.toLowerCase()){
      this.props.fetchFinalTermListForLenderCompany(company.companyId);
    } else if(user.role.toLowerCase() === constants.KEY_COMPANY .toLowerCase()
      || user.role.toLowerCase() === constants.KEY_FINANCIAL_SPONSOR.toLowerCase()){
      this.props.fetchFinalTermListForBorrowerCompany(company.companyId);
    }
    
    this.setState({
      company : company,
      user : user,
      displayMinimalData : displayMinimalData
    });
  }

  componentWillReceiveProps(nextProps){
    // console.log('I am in componentWillReceiveProps');
    if(this.props.match.params.type === constants.FT_FOR_RFP
      && nextProps.finalTermList 
      && nextProps.finalTermList != this.props.finalTermList
      && nextProps.rfp ){
        // console.log('will build the clubdeal section');
        let clubDealList = ioiUtils.makeClubDealList(nextProps.finalTermList, nextProps.rfp);
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
    if(this.props.match.params.type === constants.FT_FOR_RFP
      && this.props.finalTermList && this.props.finalTermList.length > 0){
      let productCategoryMap = cUtils.getProductCategories(this.props.finalTermList, this.props.finalTermCompanyList);
      let catKeys = Object.keys(productCategoryMap);
      // console.log('productCategoryMap:'+JSON.stringify(productCategoryMap));
      return(<div>
          <h3>Ranking by Product Category:</h3>
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
      // console.log('ele:'+ele);
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
      // console.log('t:'+console.log(t));
      return (<td key={t} className="add-newline">{t}</td>);
    });
  }

  updateWithBlendedCost(){
    // console.log('this.props.finalTermList :'+ JSON.stringify(this.props.finalTermList))
    for(let i=0; i<this.props.finalTermList.length; i++){
      let blendedCostStr = [];      
      let fTerm = this.props.finalTermList[i];
      for(let j=0; j< this.state.clubDealList.length; j++){
        if(this.inClubDeal(fTerm.createdByCompanyId, this.state.clubDealList[j])){
          blendedCostStr.push({
            yield : cUtils.formatPercentToDisplay(this.state.clubDealList[j].yield),
            otherLender : this.getOtherLenderFromClubDeal(fTerm.createdByCompanyId, this.state.clubDealList[j])
          });
        }
      }
      this.props.finalTermList[i].blendedCost = blendedCostStr;
    }
  }

  getOtherLenderFromClubDeal(cId, cDeal){
    let otherLender=cDeal.lenders[0];
    if(cDeal.lenders[0] === cId)
      otherLender = cDeal.lenders[1];
    
    for(let i=0; i< this.props.finalTermCompanyList.length; i++){
      if(this.props.finalTermCompanyList[i].companyId === otherLender)
        return this.props.finalTermCompanyList[i].companyName;
    }
    return null;
  }

  inClubDeal(cId, cDeal){
    if(cDeal.lenders[0] === cId || cDeal.lenders[1] === cId)
      return true;
    return false;
  }
  
  displayFinalTermList(){
    if(!this.props.finalTermList || this.props.finalTermList.length === 0){
      return (
        <div>
          <h3>You donot have any Final Term sheets yet.</h3>
        </div>
      );
    } else {
      if(this.state.user.role === constants.KEY_LENDER){
        // hard-code the company name for the lenders
        for(let i=0; i< this.props.finalTermList.length; i++){
          this.props.finalTermList[i].createdByCompanyName = this.state.company.companyName;
        }
      } else if((this.state.user.role === constants.KEY_COMPANY
        || this.state.user.role === constants.KEY_FINANCIAL_SPONSOR)
        && this.props.finalTermCompanyList){
          // console.log('this.props.finalTermList :'+JSON.stringify(this.props.finalTermList));
        for(let i=0; i< this.props.finalTermList.length; i++){
          this.props.finalTermList[i].createdByCompanyName = cUtils.getCompanyNameById(this.props.finalTermList[i].createdByCompanyId
              , this.props.finalTermCompanyList);
          console    
        }
      }

      if(this.props.match.params.type === constants.FT_FOR_RFP 
        && this.state.clubDealList 
        && this.state.clubDealList.length > 0){
        this.updateWithBlendedCost();
      }      
      // console.log('this.props.finalTermList :'+JSON.stringify(this.props.finalTermList));
      return(
        <div>
          <DisplayTermSheetList
            finalTermList={this.props.finalTermList}
            minimalData = {this.state.displayMinimalData}
          />
        </div>
      );
    }
  }

  displayClubDealData(){
    if(this.state.clubDealList){
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
  }

  displayLendersInClubDeal(list){
    // console.log('this.props.finalTermCompanyList :'+JSON.stringify(this.props.finalTermCompanyList));
    let lName=null;
    for(let i=0; i<this.props.finalTermCompanyList.length; i++){
      if(this.props.finalTermCompanyList[i].companyId === list[0]
        || this.props.finalTermCompanyList[i].companyId === list[1]){
        // console.log('yoyo, i='+i);
        if(!lName) lName=this.props.finalTermCompanyList[i].companyName;
        else lName=lName+', '+this.props.finalTermCompanyList[i].companyName
      }
    }
    return lName;
  }

  displayClubDealList(){
    // console.log('In displayClubDealList');
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
    // console.log('I am in render');
    return(
      <div>
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >
            <br/>
            <div>
              <h3>Comparative Analytics - Final Lender Terms</h3>
            </div>
            <br/>
            <br/>
            {this.displayFinalTermList()}
            <br/>
            <br/>
            {this.displayClubDealList()}
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
  let rObject = {};
  
    if(state.finalTermList.finalTermList){
      rObject.finalTermList = state.finalTermList.finalTermList;
    }

    if(state.finalTermList.finalTermCompanyList){
      rObject.finalTermCompanyList = state.finalTermList.finalTermCompanyList;
    }

    if(state.rfpList.rfpList){
      rObject.rfp = state.rfpList.rfpList[0];
    }

    // console.log('rObject :'+ JSON.stringify(rObject));
    return rObject;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchFinalTermListForLenderCompany    : fetchFinalTermListForLenderCompany,
    fetchFinalTermListForBorrowerCompany  : fetchFinalTermListForBorrowerCompany,
    fetchFinalTermListForRFPAction        : fetchFinalTermListForRFPAction,
    fetchRFPAction : fetchRFPAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FinalTermList);
