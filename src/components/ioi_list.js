import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import DisplayIOIList from './display_IOI_list';
import { fetchIOIListForRFPAction, fetchIOIListForLenderCompanyAction, fetchIOIListForBorrowerCompanyAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import cUtils from '../utils/common_utils';
import constants from '../utils/constants';
import NavBar from './sidebar';
import Header from './header';

class IOIList extends Component{
  constructor(props){
    super(props);
    this.state = {
			ioiList : null,
      ioiCompanyList : null,
      ioiUserList : null
		}
  }

  componentWillMount() {
    // console.log('In ioiList componentWillMount');
    let user    = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    // console.log('company:'+JSON.stringify(company));
    // console.log('user :'+JSON.stringify(user));

    if(this.props.match.params.type === constants.IOI_FOR_RFP){
      this.props.fetchIOIListForRFPAction(this.props.match.params.id);
    } else if(user.role.toLowerCase() === constants.KEY_LENDER.toLowerCase()){
      // console.log('calling fetchIOIListForLenderCompanyAction now');
      this.props.fetchIOIListForLenderCompanyAction(company.companyId);
    } else if(user.role.toLowerCase() === constants.KEY_COMPANY.toLowerCase()
      || user.role.toLowerCase() === constants.KEY_FINANCIAL_SPONSOR.toLowerCase()){
        // console.log('calling fetchIOIListForBorrowerCompanyAction now');
        this.props.fetchIOIListForBorrowerCompanyAction(company.companyId);
      }
  }

  displayProductCategory(){
    if(this.props.match.params.type === constants.IOI_FOR_RFP
      && this.props.ioiList && this.props.ioiList.length > 0){
      let productCategoryMap = cUtils.getProductCategories(this.props.ioiList, this.props.ioiCompanyList);
      let catKeys = Object.keys(productCategoryMap);
      // console.log('productCategoryMap:'+JSON.stringify(productCategoryMap));
      return(<div>
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

  displayIOIList(){
    if((!this.props.ioiList) || (this.props.ioiList && this.props.ioiList.length == 0)){
      return (
        <div>
          <h3>NO Indication of interest.</h3>
        </div>
      );
    } else if(this.props.match.params.type === constants.IOI_FOR_RFP){
      // console.log('this.props.ioiCompanyList:'+JSON.stringify(this.props.ioiCompanyList));
      return(
        <div>
          <DisplayIOIList
            list={this.props.ioiList}
            companyList={this.props.ioiCompanyList}/>
        </div>
      );
    } else {
      // console.log('this.props.ioiCompanyList:'+JSON.stringify(this.props.ioiCompanyList));
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

  render(){
    return(
      <div>
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >
            <br/>
            {this.displayProductCategory()}
            <br/>
            <br/>
            {this.displayIOIList()}
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
  let rObject =  {
    ioiList: state.ioiList.ioiList,
    ioiCompanyList : cUtils.maskCompanyName(state.ioiList.ioiCompanyList, state.ioiList.ioiList),
    ioiUserList : state.ioiList.ioiUserList
  };
  // console.log('rObject:'+JSON.stringify(rObject));
  return rObject;
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    fetchIOIListForRFPAction: fetchIOIListForRFPAction,
    fetchIOIListForLenderCompanyAction : fetchIOIListForLenderCompanyAction,
    fetchIOIListForBorrowerCompanyAction : fetchIOIListForBorrowerCompanyAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IOIList);
