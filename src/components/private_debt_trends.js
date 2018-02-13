import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import DisplayRFPList from './display_RFP_list';
import { getAllStatsAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import cUtils from '../utils/common_utils';
import constants from '../utils/constants';
import formatCurrency from 'format-currency';
import Dropdown from 'react-dropdown'
import NavBar from './sidebar';
import Header from './header';
import { ToastContainer, toast } from 'react-toastify';
import { CircleLoader } from 'react-spinners';
import PieChartComponent from './chart_pie';
import BarLineChartComponent from './chart_bar_line';

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

class PrivateDebtTrends extends Component{
  constructor(props){
    super(props);
    this.state = {
      termSheetActivity : null,
      selectedSector : null
		}
  }

  componentWillMount() {
    this.props.getAllStatsAction();
    this.setState({
      selectedSector : {value:'overall', label:'All Sectors'}
    });
  }

  createTermSheetActivityDropdown(){
    const defaultOption = options[0];
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

  displayRFPChart(){
    console.log('In displayRFPChart');
    if(this.props.keyStats){
      let sectorCountMap = this.props.keyStats.overall.sector_count;
      let sectorList = Object.keys(sectorCountMap);      
      let sectorData= sectorList.map(sector => {
          return {
            name : constants.SECTOR_MAP[sector],
            value : sectorCountMap[sector]
          }
      }); 
      sectorData = sectorData.filter(data => data.value > 0);
      console.log('sectorData :'+JSON.stringify(sectorData));
      return <PieChartComponent data={sectorData} title="# of RFP active for each sector"/>
    }
  }

  displayAvgDealChart(){
    console.log('In displayAvgDealChart');
    if(this.props.keyStats){
      let overallAvgDeal = this.props.keyStats.overall.avg_deal_size;
      let sectors = Object.keys(this.props.keyStats);
      sectors.splice(sectors.indexOf('overall'), 1);

      let sectorData = sectors.map(sector => {
        return {
          name : constants.SECTOR_MAP[sector],
          "Sector" : this.props.keyStats[sector].avg_deal_size,
          "Overall Market":  overallAvgDeal
        }
      });
      console.log('sectorData :'+JSON.stringify(sectorData));
      return <BarLineChartComponent data={sectorData} title="Avg. Deal Size for each sector and overall market"/>
    }    
  }

  displayLeverageChart(){
    console.log('In displayLeverageChart');
    if(this.props.keyStats){
      let overallLevarage = this.props.keyStats.overall.levarage;
      let sectors = Object.keys(this.props.keyStats);
      sectors.splice(sectors.indexOf('overall'), 1);

      let sectorData = sectors.map(sector => {
        return {
          name : constants.SECTOR_MAP[sector],
          "Sector" : this.props.keyStats[sector].levarage,
          "Overall Market":  overallLevarage
        }
      });
      console.log('sectorData :'+JSON.stringify(sectorData));
      return <BarLineChartComponent data={sectorData} title="Avg Leverage for each Sector and overall market"/>
    }    
  }  

  render(){
    console.log('I am in render');
  //   <div className={`row`}>
  //   <div className={`col-xs-6 col-md-6`}>
  //     {this.displayRFPChart()}
  //   </div>
  //   <div className={`col-xs-6 col-md-6`}>
  //     {this.displayAvgDealChart()}
  //   </div>              
  // </div>

    return(
      <div>
        <ToastContainer />
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container" >
            <h3>Private Debt Trends</h3>
            <br/>
            {this.displayRFPChart()}
            {this.displayAvgDealChart()}
            {this.displayLeverageChart()}
            

            <br/>
            </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {

  let rObject={};

  if(state.stats.keyStats){
    rObject.keyStats = state.stats.keyStats;
    // console.log('rObject.keyStats :'+ JSON.stringify(rObject.keyStats));
  }

  return rObject;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getAllStatsAction : getAllStatsAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivateDebtTrends);
