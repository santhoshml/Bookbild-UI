import React, { Component } from 'react';
import { connect } from 'react-redux';

export default class DisplayRFPList extends Component {

  getColoumns(){
    return [{
      header: 'Company Sector',
      accessor: 'sector' // String-based value accessors!
    }, {
      header: 'Deal Size',
      accessor: 'dealSize',
      render: props => <span className='number'>{props.value}</span> // Custom cell components!
    }, {
      header: 'Structure',
      accessor: 'sector'
    }, {
      header: 'UOF',
      accessor: 'sector'
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
    }

    return (
      <div>
        <h3>Details for:</h3>
      </div>
    );
  }
}
