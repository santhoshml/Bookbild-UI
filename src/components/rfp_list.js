import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import DisplayRFPList from './display_RFP_list';
import { fetchFavoriteRFPListAction, fetchCompanyRFPListAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import Constants from '../utils/constants';

class RFPFavorites extends Component{
  constructor(props){
    super(props);
    this.state = {
			rfpList : null
		}
  }

  componentWillMount() {
    if(this.props.params.type === Constants.RFP_MY_FAVORITES){
        this.props.fetchFavoriteRFPListAction(this.props.params.id);
    } else if(this.props.params.type === Constants.RFP_FOR_COMPANY){
        this.props.fetchCompanyRFPListAction(this.props.params.id);
    }
  }

  checkForRFPList(){
    if(this.props.rfpList && this.props.rfpList.length > 0){
      return (<div>
          <h3> Open/Active RFP's</h3>
          <DisplayRFPList list={this.props.rfpList} isDisplayRegionDropdown={false}/>
        </div>);
    } else {
      return (<div>
          <h3> There are no RFP's Open/Active.</h3>
        </div>);
    }
  }

  render(){
    return(
      <div>
        <Link to="/rfpMarketPlace" className="btn btn-primary">
          Home
        </Link>
        &nbsp;&nbsp;&nbsp;
        <Link to="/myProfile" className="btn btn-primary">
          My Profile
        </Link>
        &nbsp;&nbsp;&nbsp;
        <Link to="/" className="btn btn-primary">
          Logout
        </Link>

        <br/>
        <br/>
        {this.checkForRFPList()}
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

export default connect(mapStateToProps, mapDispatchToProps)(RFPFavorites);
