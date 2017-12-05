import React, { Component } from 'react';
import { connect } from 'react-redux';
import DataGrid from './data_grid_example';
import cUtils from '../utils/common_utils';
import Dropdown from 'react-dropdown'
import formatCurrency from 'format-currency';
import constants from '../utils/constants';
import {Link} from 'react-router-dom';
import Header from './header';

export default class DisplayRFPList extends Component {

  constructor(props){
    super(props);

    // console.log('In the constructor of DisplayRFPList');
    this.state = {
      selectedRFPList : props.list,
      allRFPList : props.list,
      selectedRegion : null
    };

  }

  componentWillReceiveProps(nextProps){
    // console.log('I am in componentWillReceiveProps');
    this.setState({
      selectedRFPList : nextProps.list,
      allRFPList : nextProps.list,
    });
  }

  getColoumns(){
    return [{
      key: 'sector',
      name: 'Sector',
      filterable: true,
      sortable: true
    }, {
      key: 'dealSize',
      name: 'Deal Size',
      filterable: true,
      sortable: true
    }, {
      key: 'product',
      name: 'Structure',
      filterable: true,
      sortable: true
    }, {
      key: 'requestType',
      name: 'UoF',
      filterable: true,
      sortable: true
    }, {
      key: 'category',
      name: 'Category',
      filterable: true,
      sortable: true
    }, {
      key: 'ltmEbitda',
      name: 'LTM EBITDA',
      filterable: true,
      sortable: true
    }, {
      key: 'numOfIOI',
      name: 'Term Sheets',
      filterable: true,
      sortable: true
    }, {
      key: 'status',
      name: 'Status',
      filterable: true,
      sortable: true
    }, {
      key: 'isSponsored',
      name: 'Sponsored?',
      filterable: true,
      sortable: true
    }];
  }

  updateWithDisplayData(){
    // console.log('In updateWithDisplayData');
    if(this.state.selectedRFPList.length > 0){
      return this.state.selectedRFPList.map(function(rfp){
        rfp.product     = cUtils.getDisplayValue(rfp.product);
        rfp.requestType = cUtils.getDisplayValue(rfp.requestType);
        rfp.termSheets  = (rfp.termSheets ? rfp.termSheets : 0);
        rfp.category    = cUtils.getDisplayValue(rfp.category);
        rfp.isSponsored = cUtils.getDisplayValue(rfp.isSponsored);

        let fDealSizeVal = formatCurrency(rfp.dealSize, constants.CURRENCY_OPTS);
        let decimalIndex = fDealSizeVal.indexOf('.');
        rfp.dealSize    = fDealSizeVal.substring(0, decimalIndex);

        let fltmEbitdaVal = formatCurrency(rfp.ltmEbitda, constants.CURRENCY_OPTS);
        decimalIndex = fltmEbitdaVal.indexOf('.');
        rfp.ltmEbitda = fltmEbitdaVal.substring(0, decimalIndex);

        rfp.status      =  cUtils.computeStatus(rfp.expiryDt);
        return rfp;
      });
    } else {
      return [];
    }
  }

  onRegionChange(option){
    // console.log('I am in onRegionChange');
    if(option.value === 'All Regions'){
      this.setState({
        selectedRFPList:this.state.allRFPList,
        selectedRegion : option
      })
    } else {
      this.setState({
        selectedRFPList:this.state.allRFPList.filter(function(rfp){
          return (rfp.region === option.value);
        }),
        selectedRegion : option
      });
    }
  }

  createRegionDropdown(){
    const options = [
      {value:'All Regions', label:'All Regions'},
      {value:'Great Lakes', label:'Great Lakes'},
      {value:'Mid Atlantic', label:'Mid Atlantic'},
      {value:'Midwest', label:'Midwest'},
      {value:'Mountain', label:'Mountain'},
      {value:'New England', label:'New England'},
      {value:'South', label:'South'},
      {value:'Southeast', label:'Southeast'},
      {value:'West Coast', label:'West Coast'}
    ];
    const defaultOption = options[0];
    return(
      <div>
        <div className='col-md-3'>
          <Dropdown
            options={options}
            onChange={this.onRegionChange.bind(this)}
            value={this.state.selectedRegion ? this.state.selectedRegion : defaultOption}
            placeholder="Select an option" />
        </div>
        <div className='col-md-3' />
        <div className='col-md-3' />
        <div className='col-md-3' >
          <Link to="/#" className="btn btn-primary btn-align-right">Invite a Company</Link>
        </div>
      </div>
    );
  }

  render() {
    // console.log('In DisplayRFPList');
    if (!this.state.selectedRFPList) {
      return <div>No RFPs exist</div>;
    } else {
      return (
        <div>
          {this.props.isDisplayRegionDropdown ? this.createRegionDropdown() : ''}
          <br/>
          <DataGrid columns={this.getColoumns()} dataList={this.updateWithDisplayData()} clickableRow="true" showFilter="true" />
        </div>
      );
    }
  }
}
