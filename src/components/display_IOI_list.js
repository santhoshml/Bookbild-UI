import React, { Component,PropTypes } from 'react';
import { connect } from 'react-redux';
import DataGrid from './data_grid_example';
import cUtils from '../utils/common_utils';
import Dropdown from 'react-dropdown'
import formatCurrency from 'format-currency';
import Constants from '../utils/constants';
import BootstrapTable from 'reactjs-bootstrap-table';
import NumberFormat from 'react-number-format';
import { FormattedDate } from 'react-intl';
import lsUtils from '../utils/ls_utils';

export default class DisplayIOIList extends Component {

  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props){
    super(props);
    this.state = {
      ioiList : props.list,
      companyList : props.companyList,
      minimalData : (props.minimalData === undefined ? false : props.minimalData),
      userList : props.userList
    };

  }

  componentWillReceiveProps(nextProps){
    this.setState({
      ioiList : nextProps.list,
      companyList : nextProps.companyList,
      userList : nextProps.userList,
      minimalData : (nextProps.minimalData === undefined ? false : nextProps.minimalData)
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

  getCompanyNameRenderer(row){
    let list = (this.state ? this.state.companyList : null);
    for(var i=0; list && i<list.length; i++){
      if(list[i].companyId === row.createdByCompanyId){
        return <a href={'/companyDetails/'+row.createdByCompanyId}>{list[i].companyName}</a>;
      }
    }
    return 'N/A';
  }

  getCreatedByNameRenderer(row){
    let list = (this.state ? this.state.userList : null);
    for(var i=0; list && i<list.length; i++){
      if(list[i].userId === row.createdById){
        return <span>{list[i].email}</span>;
      }
    }
    return 'N/A';
  }

  getDateFormatRenderer(row){
    return  <FormattedDate value={row.timestamp} format="short" />
  }

  getAllColoumns(){
    return [{
      name: 'createdByCompanyId',
      display: 'Investor',
      renderer: this.getCompanyNameRenderer.bind(this)
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
      display: 'OID/Upfront fee',
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

  getMinimalColoumns(){
    return [{
      name: 'createdByCompanyName',
      display: 'Investor',
      renderer: this.getCompanyNameRenderer.bind(this)
    }, {
      name: 'loanSize',
      display: 'Loan Size',
      renderer : this.loanSizeRenderer
    }, {
      name: 'loanStructure',
      display: 'Structure'
    }, {
      name: 'blendedCost',
      display: 'Blended Cost'
    }, {
      name: 'createdById',
      display: 'Created By',
      renderer: this.getCreatedByNameRenderer.bind(this)
    }, {
      name: 'timestamp',
      display: 'Last Updated',
      renderer: this.getDateFormatRenderer.bind(this)
    }];
  }

  onDoubleClicked(row){
    // console.log('row clicked in IOI list :'+ row.id);
    if(row){
      console.log('row:'+JSON.stringify(row));
      lsUtils.setValue(Constants.KEY_SELECTED_IOI_OBJECT, row);
      this.context.router.push('/ioiDetail/'+row.ioiId);
    }
  }

  render() {
    console.log('In DisplayIOIList');
    if (!this.state.ioiList) {
      return <div>No IOIs exist</div>;
    } else {
      return (
        <div>
          <BootstrapTable
            columns={this.state.minimalData ? this.getMinimalColoumns() : this.getAllColoumns()}
            data={this.state.ioiList} headers={true}
            onRowDoubleClicked={this.onDoubleClicked.bind(this)}/>
        </div>
      );
    }
  }
}
