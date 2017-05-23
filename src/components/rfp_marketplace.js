import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import DisplayRFPList from './display_RFP_list';
import { fetchAllRFPAction, fetchTermSheetActivityStatsAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import cUtils from '../utils/common_utils';
import Constants from '../utils/constants';
import Header from './header';
import formatCurrency from 'format-currency';

class RFPMarketPlace extends Component{
  constructor(props){
    super(props);
    this.state = {
			rfpList : null,
      termSheetActivity : null
		}
  }

  componentWillMount() {
    this.props.fetchAllRFPAction();
    this.props.fetchTermSheetActivityStatsAction();
  }

  displayTermSheetActivity(){
    console.log('I am in displayTermSheetActivity');
    if(this.props.termSheetActivity != null){
      return(<div>
        <h3>Term Sheet Activity</h3>
        <br/>
        <table className="table table-striped">
          <tbody>
            <tr>
              <td>
                # of Active RFP's :
              </td>
              <td>
                {this.props.termSheetActivity.num_active_rfp}
              </td>
            </tr>
            <tr>
              <td>
                # of IOI's received :
              </td>
              <td>
                {this.props.termSheetActivity.num_ioi_issued}
              </td>
            </tr>
            <tr>
              <td>
                Average Deal Size :
              </td>
              <td>
                {formatCurrency(this.props.termSheetActivity.avg_deal_size, Constants.CURRENCY_OPTS)}
              </td>
            </tr>
            <tr>
              <td>
                % of Sponsored deals :
              </td>
              <td>
                {this.props.termSheetActivity.percent_sponsor_deals}
              </td>
            </tr>
            <tr>
              <td>
                Sector Rankings:
              </td>
              <td>
                {cUtils.getTopThreeSectors(this.props.termSheetActivity)}
              </td>
            </tr>
            <tr>
              <td>
                Structure Rankings :
              </td>
              <td>
                {cUtils.getTopThreeProducts(this.props.termSheetActivity)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>);
    } else {
      return(<div>
        </div>
      );
    }
  }

  render(){
    return(
      <div>
        <Header />
        <br/>
        <DisplayRFPList list={this.props.rfpList} isDisplayRegionDropdown={true}/>
        <br/>
        <br/>
        {this.displayTermSheetActivity()}
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
  // console.log('state in marketplace : '+ JSON.stringify(state));
  return {
    rfpList: state.rfpList.rfpList,
    termSheetActivity : (state.rfpList.termSheetActivity != null ? state.rfpList.termSheetActivity.data : null)
  };
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    fetchAllRFPAction: fetchAllRFPAction,
    fetchTermSheetActivityStatsAction : fetchTermSheetActivityStatsAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RFPMarketPlace);
