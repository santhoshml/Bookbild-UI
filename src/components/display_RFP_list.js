import React, { Component } from 'react';
import { connect } from 'react-redux';
import DataGrid from './data_grid_example';

export default class DisplayRFPList extends Component {

  constructor(props){
    super(props);

    // this.getColoumns = this.getColoumns.bind(this);
  }

  getColoumns(){
    return [{
      key: 'sector',
      name: 'Company Sector',
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
      key: 'ltmEbitda',
      name: 'LTM EBITDA',
      filterable: true,
      sortable: true
    }];
  }

  formatData(){
    return this.props.rfpList.map((rfp) => {
      return({
        sector : rfp.sector,
        dealSize : rfp.dealSize
      });
    });
  }


  render() {
    console.log('In DisplayRFPList, rfpList:'+JSON.stringify(this.props.rfpList));
    if (!this.props.rfpList) {
      return <div>No RFPs exist</div>;
    } else {
      return (
        <div>
          <h3>Details for:</h3>
          <DataGrid columns={this.getColoumns()} dataList={this.props.rfpList} />
        </div>
      );
    }
  }
}
