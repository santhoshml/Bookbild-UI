import React, { Component } from 'react';
import { connect } from 'react-redux';
import DataGrid from './data_grid_example';
import cUtils from '../utils/common_utils';
import Dropdown from 'react-dropdown'
import formatCurrency from 'format-currency';
import Constants from '../utils/constants';
import BootstrapTable from 'reactjs-bootstrap-table';
import NumberFormat from 'react-number-format';


export default class DisplayIOIList extends Component {

  constructor(props){
    super(props);
    console.log('In the constructor of DisplayIOIList');
    this.state = {
      ioiList : props.list
    };

  }

  componentWillReceiveProps(nextProps){
    console.log('I am in componentWillReceiveProps');
    this.setState({
      ioiList : nextProps.list
    });
  }

  maxDebtRenderer(row){
    return <NumberFormat value={row.maxDebtAllowed} displayType={'text'} thousandSeparator={true} prefix={'$'} />
  }

  loanSizeRenderer(row){
    return <NumberFormat value={row.maxDebtAllowed} displayType={'text'} thousandSeparator={true} prefix={'$'} />
  }

  pikRenderer(row){
    return <NumberFormat value={row.pikIntreset} displayType={'text'} decimalSeparator={true} decimalPrecision={true} suffix={'%'} />
  }

  liborFloorRenderer(row){
    return <NumberFormat value={row.liborFloor} displayType={'text'} decimalSeparator={true} decimalPrecision={true} suffix={'%'} />
  }

  upfrontFeeRenderer(row){
    return <NumberFormat value={row.upfrontFee} displayType={'text'} thousandSeparator={true} prefix={'$'} />
  }

  getColoumns(){
    return [{
      key: 'createdByCompanyId',
      name: 'Investor',
      filterable: true,
      sortable: true
    }, {
      key: 'maxDebtAllowed',
      name: 'Max Debt',
      filterable: true,
      sortable: true
    }, {
      key: 'loanSize',
      name: 'Loan size',
      filterable: true,
      sortable: true
    }, {
      key: 'delayedDraw',
      name: 'Delayed Draw',
      filterable: true,
      sortable: true
    }, {
      key: 'loanStructure',
      name: 'Structure',
      filterable: true,
      sortable: true
    }, {
      key: 'liborSpread',
      name: 'LIBOR spread',
      filterable: true,
      sortable: true
    }, {
      key: 'pikIntreset',
      name: 'PIK',
      filterable: true,
      sortable: true
    }, {
      key: 'liborFloor',
      name: 'LIBOR floor',
      filterable: true,
      sortable: true
    }, {
      key: 'maturity',
      name: 'Maturity',
      filterable: true,
      sortable: true
    }, {
      key: 'amortization',
      name: 'Amortization',
      filterable: true,
      sortable: true
    }, {
      key: 'upfrontFee',
      name: 'IOD/Upfront fee',
      filterable: true,
      sortable: true
    }, {
      key: 'governance',
      name: 'Governance',
      filterable: true,
      sortable: true
    }, {
      key: 'warrants',
      name: 'Warrants',
      filterable: true,
      sortable: true
    }, {
      key: 'covenants',
      name: 'Covenants',
      filterable: true,
      sortable: true
    }, {
      key: 'yield',
      name: 'Yield',
      filterable: true,
      sortable: true
    }, {
      key: 'blendedCost',
      name: 'Blended Cost',
      filterable: true,
      sortable: true
    }];
  }

  getBootstrapColoumns(){
    return [{
      name: 'createdByCompanyId',
      display: 'Investor'
    }, {
      name: 'maxDebtAllowed',
      display: 'Max Debt Allowed',
      renderer : this.maxDebtRenderer
    }, {
      name: 'loanSize',
      display: 'Loan Size',
      renderer : this.loanSizeRenderer
    }, {
      name: 'delayedDraw',
      display: 'Delayed Draw'
    }, {
      name: 'loanStructure',
      display: 'Structure'
    }, {
      name: 'liborSpread',
      display: 'LIBOR spread'
    }, {
      name: 'pikIntreset',
      display: 'PIK',
      renderer : this.pikRenderer
    }, {
      name: 'liborFloor',
      display: 'LIBOR floor',
      renderer : this.liborFloorRenderer
    }, {
      name: 'maturity',
      display: 'Maturity'
    }, {
      name: 'amortization',
      display: 'Amortization'
    }, {
      name: 'upfrontFee',
      display: 'IOD/Upfront fee',
      renderer : this.upfrontFeeRenderer
    }, {
      name: 'governance',
      display: 'Governance'
    }, {
      name: 'warrants',
      display: 'Warrants'
    }, {
      name: 'covenants',
      display: 'Covenants'
    }, {
      name: 'yield',
      display: 'Yield'
    }, {
      name: 'blendedCost',
      display: 'Blended Cost'
    }];
  }

  updateWithDisplayData(){
    console.log('In updateWithDisplayData');
    if(this.state.ioiList.length > 0){
      return this.state.ioiList.map(function(ioi){
        ioi.maxDebtAllowed =  formatCurrency(ioi.maxDebtAllowed, Constants.CURRENCY_OPTS);
        ioi.loanSize  = formatCurrency(ioi.loanSize, Constants.CURRENCY_OPTS);
        ioi.pikIntreset = isNaN(ioi.pikIntreset) ? '0%' : parseFloat(ioi.pikIntreset).toFixed(2)+'%';
        ioi.liborFloor = isNaN(ioi.liborFloor) ? '0%' : parseFloat(ioi.liborFloor).toFixed(2)+'%';
        ioi.liborSpread = isNaN(ioi.liborSpread) ? '0%' : parseFloat(ioi.liborSpread).toFixed(2)+'%';
        return ioi;
      });
    } else {
      return [];
    }
  }

  render() {
    console.log('In DisplayIOIList');
    if (!this.state.ioiList) {
      return <div>No IOIs exist</div>;
    } else {
      return (
        // <div className="datagrid-smaller-font ioi-datagrid-container">
        //   <br/>
        //   <DataGrid columns={this.getColoumns()} dataList={this.updateWithDisplayData()} clickableRow="false" />
        // </div>
        // <div>
        //   <br/>
        //   // <BootstrapTable data={this.state.ioiList} striped hover condensed>
        //   //   <TableHeaderColumn dataField="createdByCompanyId" isKey={true} dataAlign="center" dataSort={true} width="10px">Investor</TableHeaderColumn>
        //   //   <TableHeaderColumn dataField="maxDebtAllowed" dataSort={true} width="10px">Max Debt Allowed</TableHeaderColumn>
        //   //   <TableHeaderColumn dataField="loanSize" width="10px">Loan Size</TableHeaderColumn>
        //   //   <TableHeaderColumn dataField="delayedDraw" width="10px">Delayed Draw</TableHeaderColumn>
        //   //   <TableHeaderColumn dataField="loanStructure" width="10px">Loan Structure</TableHeaderColumn>
        //   //   <TableHeaderColumn dataField="liborSpread" width="10px">LIBOR Spread</TableHeaderColumn>
        //   //   <TableHeaderColumn dataField="pikIntreset" width="10px">PIK</TableHeaderColumn>
        //   //   <TableHeaderColumn dataField="liborFloor" width="10px">LIBOR Floor</TableHeaderColumn>
        //   //   <TableHeaderColumn dataField="maturity" width="10px">maturity</TableHeaderColumn>
        //   //   <TableHeaderColumn dataField="amortization" width="10px">Amortization</TableHeaderColumn>
        //   //   <TableHeaderColumn dataField="upfrontFee" width="10px">Upfront Fee</TableHeaderColumn>
        //   //   <TableHeaderColumn dataField="governance" width="10px">Governance</TableHeaderColumn>
        //   //   <TableHeaderColumn dataField="warrants" width="10px">Warrants</TableHeaderColumn>
        //   //   <TableHeaderColumn dataField="covenants" width="10px">Covenants</TableHeaderColumn>
        //   //   <TableHeaderColumn dataField="yield" width="10px">Yield</TableHeaderColumn>
        //   //   <TableHeaderColumn dataField="blendedCost" width="10px">BlendedCost</TableHeaderColumn>
        //   // </BootstrapTable>
        // </div>
        <div>
          <BootstrapTable columns={this.getBootstrapColoumns()} data={this.state.ioiList} headers={true}/>
        </div>
      );
    }
  }
}
