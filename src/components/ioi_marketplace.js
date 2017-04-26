import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import DisplayIOIList from './display_IOI_list';
import { fetchIOIListForRFPAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import Constants from '../utils/constants';

class IOIMarketPlace extends Component{
  constructor(props){
    super(props);
    this.state = {
			ioiList : null
		}
  }

  componentWillMount() {
    this.props.fetchIOIListForRFPAction(this.props.params.id);
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
        <DisplayIOIList list={this.props.ioiList} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  // Whatever is returned will show up as props
  // console.log('state:'+JSON.stringify(state));
  return {
    ioiList: state.ioiList.ioiList
  };
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({ fetchIOIListForRFPAction: fetchIOIListForRFPAction }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(IOIMarketPlace);
