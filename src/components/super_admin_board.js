import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { resetActivityTermSheetStatsAction } from '../actions/index';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import NavBar from './sidebar';
import { bindActionCreators } from 'redux';
import Header from './header';

class Admin extends Component{
  constructor(props){
    super(props);
  }

  resetActivityTermSheetStats(){
    // console.log('In resetActivityTermSheetStats');
    this.props.resetActivityTermSheetStatsAction()
      .then(() => {
        this.props.history.push(constants.ROUTES_MAP.SUPER_ADMIN);
    });
  }

  render(){
    return(
      <div>
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >
            <Link to={constants.ROUTES_MAP.REGISTER_COMPANY} className="btn btn-primary">
              Add a company
            </Link>
            &nbsp;&nbsp;
            <Link to={constants.ROUTES_MAP.CREATE_RFP+"/"+constants.RFP_NEW} className="btn btn-primary">
              Create RFP
            </Link>
            &nbsp;&nbsp;
            <Link onClick={this.resetActivityTermSheetStats.bind(this)} className="btn btn-primary">
              Reset Activity TermSheet stats
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {

  };
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    resetActivityTermSheetStatsAction: resetActivityTermSheetStatsAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
