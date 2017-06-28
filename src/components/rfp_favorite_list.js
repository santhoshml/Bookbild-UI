import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import DisplayRFPList from './display_RFP_list';
import { fetchFavoriteRFPListAction, fetchCompanyRFPListAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import Header from './header';

class RFPFavoriteList extends Component{
  constructor(props){
    super(props);
    // console.log('In RFPList constructor');
    this.state = {
			rfpList : null
		}
  }

  componentWillMount() {
    this.props.fetchFavoriteRFPListAction(this.props.params.id);
  }

  checkForRFPList(){
    if(this.props.rfpList && this.props.rfpList.length > 0){
      return (<div>
          <h3> Open/Active RFP's in Favorites list</h3>
          <DisplayRFPList list={this.props.rfpList} isDisplayRegionDropdown={false}/>
        </div>);
    } else {
      return (<div>
          <h3> There are no RFP's Open/Active in Favorites list</h3>
        </div>);
    }
  }

  render(){
    // console.log('In RFPList render');
    return(
      <div>
        <Header />

        <br/>
        {this.checkForRFPList()}
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

export default connect(mapStateToProps, mapDispatchToProps)(RFPFavoriteList);
