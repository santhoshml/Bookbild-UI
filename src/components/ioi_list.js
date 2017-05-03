import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import DisplayIOIList from './display_IOI_list';
import { fetchIOIListForRFPAction, fetchIOIListForCompanyAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import Constants from '../utils/constants';

class IOIList extends Component{
  constructor(props){
    super(props);
    this.state = {
			ioiList : null,
      ioiCompanyList : null
		}
  }

  componentWillMount() {
    if(this.props.params.type === Constants.IOI_FOR_RFP){
      this.props.fetchIOIListForRFPAction(this.props.params.id);
    } else {
      this.props.fetchIOIListForCompanyAction(this.props.params.id);
    }
  }

  displayIOIList(){
    if(this.props.params.type === Constants.IOI_FOR_RFP){
      return(
        <div>
          <DisplayIOIList list={this.props.ioiList} companyList={this.props.ioiCompanyList}/>
        </div>
      );
    } else {
      return(
        <div>
          <DisplayIOIList list={this.props.ioiList} companyList={this.props.ioiCompanyList} minimalData={true}/>
        </div>
      );
    }
  }

  render(){
    return(
      <div>
        <Link to="/createRFP" className="btn btn-primary">
          Create New RFP
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
        {this.displayIOIList()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  // Whatever is returned will show up as props
  // console.log('state:'+JSON.stringify(state));
  // console.log('state:'+JSON.stringify(state));
  return {
    ioiList: state.ioiList.ioiList,
    ioiCompanyList : state.ioiList.ioiCompanyList,
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
