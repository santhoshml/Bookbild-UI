import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import DisplayTermSheetList from './display_finalTerm_list';
import { fetchFinalTermListForLenderCompany
  , fetchFinalTermListForBorrowerCompany
  , fetchFinalTermListForRFPAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import cUtils from '../utils/common_utils';
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
      } else if(this.state.user.role === constants.KEY_COMPANY
        || this.state.user.role === constants.KEY_FINANCIAL_SPONSOR){
        for(let i=0; i< this.props.finalTermList.length; i++){
          this.props.finalTermList[i].createdByCompanyName = cUtils.getCompanyNameById(this.props.finalTermList[i].createdByCompanyId
              , this.props.finalTermCompanyList);
        }
      }

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

  render(){
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
            {
              // this.displayProductCategory()
            }
            <br/>
            <br/>
            {this.displayFinalTermList()}
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
  let rObject = {};
  
    if(state.finalTermList.finalTermList){
      rObject.finalTermList = state.finalTermList.finalTermList;
    }

    if(state.finalTermList.finalTermCompanyList){
      rObject.finalTermCompanyList = state.finalTermList.finalTermCompanyList;
    }

    return rObject;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchFinalTermListForLenderCompany    : fetchFinalTermListForLenderCompany,
    fetchFinalTermListForBorrowerCompany  : fetchFinalTermListForBorrowerCompany,
    fetchFinalTermListForRFPAction        : fetchFinalTermListForRFPAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FinalTermList);
