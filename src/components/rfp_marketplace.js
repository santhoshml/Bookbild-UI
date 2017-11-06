import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import DisplayRFPList from './display_RFP_list';
import { fetchAllRFPAction, fetchTermSheetActivityStatsAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import cUtils from '../utils/common_utils';
import constants from '../utils/constants';
import formatCurrency from 'format-currency';
import Dropdown from 'react-dropdown'
import NavBar from './sidebar';
import Header from './header';

class RFPMarketPlace extends Component{
  constructor(props){
    super(props);
    this.state = {
			rfpList : null,
      termSheetActivity : null,
      selectedSector : null
		}
  }

  componentWillMount() {
    this.props.fetchAllRFPAction();
    this.props.fetchTermSheetActivityStatsAction('overall');
    this.setState({
      selectedSector : {value:'overall', label:'All Sectors'}
    });
  }

  onTermSheetActivityChange(option){
    console.log('I am in onTermSheetActivityChange');
    console.log('option:'+JSON.stringify(option));
    this.setState({
      selectedSector : option
    });
    this.props.fetchTermSheetActivityStatsAction(option.value);
  }

  createTermSheetActivityDropdown(){
    const options = [
      {value:'overall', label:'All Sectors'},
      {value:'it', label:'IT'},
      {value:'financials', label:'Financials'},
      {value:'healthCare', label:'Health Care'},
      {value:'energy', label:'Energy'},
      {value:'consumerStaples', label:'Consumer Staples'},
      {value:'consumerDisc', label:'Consumer Disc'},
      {value:'industrials', label:'Industrials'},
      {value:'materials', label:'Materials'},
      {value:'utilities', label:'Utilities'},
      {value:'telecoms', label:'Telecoms'},
    ];
    const defaultOption = options[0];
    console.log('In createTermSheetActivityDropdown, '+JSON.stringify(this.state.selectedSector));
    return(
      <div className='col-md-3'>
        <Dropdown
          options={options}
          onChange={this.onTermSheetActivityChange.bind(this)}
          value={this.state.selectedSector ? this.state.selectedSector : defaultOption}
          placeholder="Select an option" />
      </div>
    );
  }

  displaySectorRankings(){
    if(this.state.selectedSector && this.state.selectedSector.value === 'overall'){
      return(
        <tr>
          <td className="col-md-6">
            Sector Rankings :
          </td>
          <td className="col-md-6">
            {this.props.termSheetActivity.sector_count ? cUtils.getTopThreeSectors(this.props.termSheetActivity.sector_count, Number(this.props.termSheetActivity.num_active_rfp)) : ''}
          </td>
        </tr>
      );
    }
  }

  displayStructureRankings(){
    if(this.state.selectedSector && this.state.selectedSector.value === 'overall'){
      return(
        <tr>
          <td className="col-md-6">
            Structure Rankings :
          </td>
          <td className="col-md-6">
            {this.props.termSheetActivity.struct_count ? cUtils.getTopThreeProducts(this.props.termSheetActivity.struct_count, Number(this.props.termSheetActivity.num_active_rfp)) : ''}
          </td>
        </tr>
      );
    }
  }


  displayTermSheetActivity(){
    console.log('I am in displayTermSheetActivity');
    if(this.props.termSheetActivity != null){
      return(<div>
        {this.createTermSheetActivityDropdown()}
        <center><h3>Term Sheet Activity</h3></center>
        <br/>
        <table className="table table-striped">
          <tbody>
            <tr>
              <td className="col-md-6">
                # of Active RFP's :
              </td>
              <td className="col-md-6">
                {this.props.termSheetActivity.num_active_rfp}
              </td>
            </tr>
            <tr>
              <td className="col-md-6">
                # of IOI's received :
              </td>
              <td className="col-md-6">
                {this.props.termSheetActivity.num_ioi_issued}
              </td>
            </tr>
            <tr>
              <td className="col-md-6">
                Average Deal Size :
              </td>
              <td className="col-md-6">
                {formatCurrency(this.props.termSheetActivity.avg_deal_size, constants.CURRENCY_OPTS)}
              </td>
            </tr>
            <tr>
              <td className="col-md-6">
                % of Sponsored deals :
              </td>
              <td className="col-md-6">
                {this.props.termSheetActivity.percent_sponsor_deals}
              </td>
            </tr>
            <tr>
              <td className="col-md-6">
                Average Leverage(x) :
              </td>
              <td className="col-md-6">
                {this.props.termSheetActivity.levarage}x
              </td>
            </tr>
            {this.displaySectorRankings()}
            {this.displayStructureRankings()}
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
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container" >
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
        </div>
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
