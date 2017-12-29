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

export default class DisplayFinalTermList extends Component {

  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props){
    super(props);
  }

  componentWillMount(){
  }

  componentWillReceiveProps(nextProps){

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
    return <NumberFormat value={row.maxDebtAllowed} displayType={'text'} thousandSeparator={true} prefix={'$'} />
  }

  loanSizeRenderer(row){
    return <NumberFormat value={row.loanSize} displayType={'text'} thousandSeparator={true} prefix={'$'} />
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
      name: 'createdByCompanyName',
      display: 'Investor'
    }, {
      name: 'loanSize',
      display: 'Loan Size',
      renderer : this.loanSizeRenderer
    }, {
      name: 'yield',
      display: 'Yield'
    }, {
      name: 'blendedCost',
      display: 'Blended Cost'
    }];
    return colArr;
  }

  onDoubleClicked(row){
    // console.log('row clicked in IOI list :'+ row.id);
    if(row){
      // console.log('row:'+JSON.stringify(row));
      this.context.router.history.push(constants.ROUTES_MAP.VIEW_FINAL_TERM+'/'+row.finalTermId);
    }
  }

  render() {
    // console.log('In DisplayIOIList');
    if (!this.props.finalTermList) {
      return <div>No Final Term sheets exist</div>;
    } else {
      const selectRowProp = {
        mode: 'checkbox',
        clickToSelect: true,
        bgColor: "rgb(238, 193, 213)"
        };
      return (
          <div>
            <BootstrapTable
              columns={this.getAllColoumns()}
              data={this.props.finalTermList}
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