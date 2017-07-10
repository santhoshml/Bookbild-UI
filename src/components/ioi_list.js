import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import DisplayIOIList from './display_IOI_list';
import { fetchIOIListForRFPAction, fetchIOIListForCompanyAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import cUtils from '../utils/common_utils';
import constants from '../utils/constants';
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
    if(this.props.params.type === constants.IOI_FOR_RFP){
      this.props.fetchIOIListForRFPAction(this.props.params.id);
    } else {
      this.props.fetchIOIListForCompanyAction(this.props.params.id);
    }
  }

  displayProductCategory(){
    if(this.props.params.type === constants.IOI_FOR_RFP){
      let productCategoryMap = cUtils.getProductCategories(this.props.ioiList, this.props.ioiCompanyList);
      let catKeys = Object.keys(productCategoryMap);
      console.log('productCategoryMap:'+JSON.stringify(productCategoryMap));
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
      return (<td>{ele}</td>);
    });
  }

  printDataForCat(keys, list){
    return keys.map(function(key){
      let t = '';
      var pArr = list[key];
      for(let k in pArr){
        t= t+'\n'+pArr[k];
      }
      return (<td className="add-newline">{t}</td>);
    });
  }

  displayIOIList(){
    if((!this.props.ioiList) || (this.props.ioiList && this.props.ioiList.length == 0)){
      return (
        <div>
          <h3>NO Indication of intrest for this RFP so far.</h3>
        </div>
      );
    } else if(this.props.params.type === constants.IOI_FOR_RFP){
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

  render(){
    return(
      <div>
        <Header />
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
    );
  }
}

function mapStateToProps(state) {
  // Whatever is returned will show up as props
  console.log('state:'+JSON.stringify(state));
  return {
    ioiList: state.ioiList.ioiList,
    ioiCompanyList : state.ioiList.ioiCompanyList,
    ioiUserList : state.ioiList.ioiUserList
  };
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    fetchIOIListForRFPAction: fetchIOIListForRFPAction,
    fetchIOIListForCompanyAction : fetchIOIListForCompanyAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IOIList);
