import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import DisplayRFPList from './display_RFP_list';
import { fetchAllRFPAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import Constants from '../utils/constants';

class RFPMarketPlace extends Component{
  constructor(props){
    super(props);
    this.state = {
			rfpList : null
		}
  }

  componentWillMount() {
    this.props.fetchAllRFPAction();
  }

  render(){
    return(
      <div>
        <Link to="/createRFP" className="btn btn-primary">
          Create New RFP
        </Link>
        &nbsp;&nbsp;&nbsp;
        <Link to="/myProfile" className="btn btn-primary">
          Profile
        </Link>
        &nbsp;&nbsp;&nbsp;
        <Link to="/" className="btn btn-primary">
          Logout
        </Link>

        <br/>
        <br/>
        <DisplayRFPList list={this.props.rfpList} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  // Whatever is returned will show up as props
  // lsUtils.setValue(Constants.KEY_RFP_LIST_OBJECT, state.rfpList.rfpList);
  return {
    rfpList: state.rfpList.rfpList
  };
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({ fetchAllRFPAction: fetchAllRFPAction }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RFPMarketPlace);
