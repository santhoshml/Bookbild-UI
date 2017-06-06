import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router';
import { resetActivityTermSheetStatsAction } from '../actions/index';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import Header from './header';
import { bindActionCreators } from 'redux';


class Admin extends Component{
  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props){
    super(props);
  }

  resetActivityTermSheetStats(){
    console.log('In resetActivityTermSheetStats');
    this.props.resetActivityTermSheetStatsAction()
      .then(() => {
        this.context.router.push('/superAdmin');
    });
  }

  render(){
    return(
      <div>
        <Header />
        <Link to="/registerCompany" className="btn btn-primary">
          Add a company
        </Link>
        &nbsp;&nbsp;
        <Link to={"/createRFP/"+constants.RFP_NEW} className="btn btn-primary">
          Create RFP
        </Link>
        &nbsp;&nbsp;
        <Link onClick={this.resetActivityTermSheetStats.bind(this)} className="btn btn-primary">
          Reset Activity TermSheet stats
        </Link>
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
