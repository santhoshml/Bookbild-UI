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
			rfpList : null,
      user : null,
      company : null
		}
  }

  componentWillMount() {
    this.setState({
      user : lsUtils.getValue(Constants.KEY_USER_OBJECT),
      company : lsUtils.getValue(Constants.KEY_COMPANY_OBJECT),
    });
    this.props.fetchAllRFPAction();
  }

  displayCreateRFPLink(){
    return (
      <span>
        <Link to={"/createRFP/"+Constants.RFP_NEW} className="btn btn-primary">
          Create New RFP
        </Link>
        &nbsp;&nbsp;&nbsp;
      </span>
    );
  }

  displayMyIOILink(){
    return (
      <span>
        &nbsp;&nbsp;&nbsp;
        <Link to={"/ioiList/"+this.state.company.companyId+"/"+Constants.IOI_FOR_COMPANY} className="btn btn-primary">
          Recent IOI
        </Link>
      </span>
    );
  }

  displayMyRFPLink(){
    return (
      <span>
        &nbsp;&nbsp;&nbsp;
        <Link to={"/rfpList/"+this.state.company.companyId+"/"+Constants.RFP_FOR_COMPANY} className="btn btn-primary">
          My RFP's
        </Link>
      </span>
    );
  }

  displayMyFavoritesLink(){
    return (
      <span>
        &nbsp;&nbsp;&nbsp;
        <Link to={"/rfpList/"+this.state.user.userId+"/"+Constants.RFP_MY_FAVORITES} className="btn btn-primary">
          My Favorites
        </Link>
      </span>
    );
  }

  render(){
    return(
      <div>
        {(this.state.user.role===Constants.KEY_FINANCIAL_SPONSOR
          || this.state.user.role===Constants.KEY_COMPANY) ? this.displayCreateRFPLink() : ''}

        <Link to="/myProfile" className="btn btn-primary">
          My Profile
        </Link>
        {this.displayMyFavoritesLink()}
        {(this.state.user.role === Constants.KEY_COMPANY
          || this.state.user.role === Constants.KEY_FINANCIAL_SPONSOR) ?  this.displayMyRFPLink() : ''}
        {this.state.user.role===Constants.KEY_LENDER ? this.displayMyIOILink() : ''}

        &nbsp;&nbsp;&nbsp;
        <Link to="/" className="btn btn-primary">
          Logout
        </Link>

        <br/>
        <br/>
        <DisplayRFPList list={this.props.rfpList} isDisplayRegionDropdown={true}/>
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
