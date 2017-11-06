import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import DisplayRFPList from './display_RFP_list';
import { fetchFavoriteRFPListAction, fetchCompanyRFPListAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import NavBar from './sidebar';
import Header from './header';

class RFPCompanyList extends Component{
  constructor(props){
    super(props);
    // console.log('In RFPList constructor');
    this.state = {
			rfpList : null
		}
  }

  componentWillMount() {
    this.props.fetchCompanyRFPListAction(this.props.match.params.id);
  }

  checkForRFPList(){
    if(this.props.rfpList && this.props.rfpList.length > 0){
      return (<div>
          <h3> Open/Active RFP's by the Company</h3>
          <DisplayRFPList list={this.props.rfpList} isDisplayRegionDropdown={false}/>
        </div>);
    } else {
      return (<div>
          <h3> There are no RFP's Open/Active by the Company</h3>
        </div>);
    }
  }

  render(){
    // console.log('In RFPList render');
    return(
      <div>
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>      
          <div className="container" >
            <br/>
            {this.checkForRFPList()}
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
  return {
    rfpList: state.rfpList.rfpList
  };
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    fetchFavoriteRFPListAction: fetchFavoriteRFPListAction
    , fetchCompanyRFPListAction : fetchCompanyRFPListAction}
    , dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RFPCompanyList);
