import React, { Component,PropTypes } from 'react';
import { connect } from 'react-redux';
import DataGrid from './data_grid_example';
import cUtils from '../utils/common_utils';
import formatCurrency from 'format-currency';
import constants from '../utils/constants';
import BootstrapTable from 'reactjs-bootstrap-table';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import Header from './header';
import dateFormat from 'dateformat';
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

  investorRenderer(row){
    if(this.state.companyList){
      // console.log('row.createdByCompanyId:'+row.createdByCompanyId);
      // console.log('this.state.companyList:'+JSON.stringify(this.state.companyList));
      return cUtils.getCompanyNameById(row.createdByCompanyId, this.state.companyList);
    } else
      return null;
  }

  maxDebtRenderer(row){
    return <NumberFormat value={row.maxDebtAllowed / 1000000} displayType={'text'} thousandSeparator={true} prefix={'$'} />
  }

  loanSizeRenderer(row){
    return <NumberFormat value={row.loanSize / 1000000} displayType={'text'} thousandSeparator={true} prefix={'$'} />
  }

  pikRenderer(row){
    return <NumberFormat value={String(row.pikIntreset)} displayType={'text'} decimalSeparator={row.pikIntreset > 0 ? '.' : ''} decimalScale={2} suffix={'%'} />
  }

  liborFloorRenderer(row){
    return <NumberFormat value={row.liborFloor} displayType={'text'} decimalSeparator={row.liborFloor > 0 ? '.' : ''} decimalScale={2} suffix={'%'} />
  }

  upfrontFeeRenderer(row){
    return <NumberFormat value={row.upfrontFee} displayType={'text'} thousandSeparator={row.upfrontFee>0 ? true : false} suffix={'%'} />
  }

  maturityRenderer(row){
    return <NumberFormat value={row.maturity} displayType={'text'} suffix={'yrs'} />
  }

  cashIntrestRenderer(row){
    return <NumberFormat value={row.cashInterest} displayType={'text'} thousandSeparator={row.cashInterest>0 ? true : false} suffix={'%'} />
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
    return <span>{dateFormat(moment(row.timestamp), 'longDate')}</span>
    // return  <FormattedDate value={row.timestamp} format="short" />
  }

  getAllColoumns(){
    let colArr = [{
      name: 'createdByCompanyId',
      display: 'Investor',
      renderer : this.investorRenderer.bind(this)
    },{
      name: 'maxDebtAllowed',
      display: 'Max Debt Allowed',
      renderer : this.maxDebtRenderer
    }, {
      name: 'loanSize',
      display: 'Loan Size',
      renderer : this.loanSizeRenderer
    }, {
      name: 'loanStructure',
      display: 'Structure'
    }, {
      name: 'liborSpread',
      display: 'Interest',
      renderer : this.cashIntrestRenderer
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
      display: 'Maturity',
      renderer : this.maturityRenderer
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

    // check if there is value for tranche/delayedDraw
    let delayedDrawExists = false;
    this.state.ioiList.forEach(function(ioi){
      if(ioi.delayedDraw && ioi.delayedDraw.trim() !== ''){
        delayedDrawExists= true;
      }
    });
    if(delayedDrawExists === true){
      // remove delated Draw from the col list
      let ele = {
        name: 'delayedDraw',
        display: 'Tranche?'
      };
      colArr.splice(2, 0, ele);
    }

    // check if there is value for Amort/amortization
    let amortizationExists = false;
    this.state.ioiList.forEach(function(ioi){
      if(ioi.amortization && ioi.amortization.trim() !== ''){
        amortizationExists= true;
      }
    });
    if(amortizationExists === true){
      // remove delated Draw from the col list
      let ele = {
        name: 'amortization',
        display: 'Amort.'
      };
      colArr.splice(8, 0, ele);
    }

    return colArr;
  }

  getMinimalColoumns(){
    let colArr= [{
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
    return colArr;
  }

  onDoubleClicked(row){
    // console.log('row clicked in IOI list :'+ row.id);
    if(row){
      // console.log('row:'+JSON.stringify(row));
      lsUtils.setValue(constants.KEY_SELECTED_IOI_OBJECT, row);
      this.context.router.history.push(constants.ROUTES_MAP.IOI_DETAIL+'/'+row.ioiId);
    }
  }

  render() {
    // console.log('In DisplayIOIList');
    if (!this.state.ioiList) {
      return <div>No IOIs exist</div>;
    } else {
      const selectRowProp = {
        mode: 'checkbox',
        clickToSelect: true,
        bgColor: "rgb(238, 193, 213)"
        };
      return (
          <div>
            <BootstrapTable
              columns={this.state.minimalData ? this.getMinimalColoumns() : this.getAllColoumns()}
              data={this.state.ioiList}
              headers={true}
              striped
              hover
              condensed
              pagination
              selectRow={ selectRowProp }
              onRowDoubleClicked={this.onDoubleClicked.bind(this)}/>
          </div>
      );
    }
  }
}
