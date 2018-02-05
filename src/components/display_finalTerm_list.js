import React, { Component,PropTypes } from 'react';
import { connect } from 'react-redux';
import DataGrid from './data_grid_example';
import cUtils from '../utils/common_utils';
import formatCurrency from 'format-currency';
import constants from '../utils/constants';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
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
    this.setState({
      minimalData : (this.props.minimalData === undefined ? false : this.props.minimalData)
    });
  }

  componentWillReceiveProps(nextProps){
  }

  investorRenderer(cell, row){
    if(this.state.companyList){
      return cUtils.getCompanyNameById(row.createdByCompanyId, this.state.companyList);
    } else
      return null;
  }

  maxDebtRenderer(cell, row){
    return cUtils.formatCurrencyToDisplayAsElement(row.maxDebtAllowed); 
  }

  loanSizeRenderer(cell, row){
    return cUtils.formatCurrencyToDisplayAsElement(row.loanSize);
  }

  pikRenderer(cell, row){
    return cUtils.formatPercentToDisplayAsElement(row.pikIntreset); 
  }

  liborFloorRenderer(cell, row){
    return cUtils.formatPercentToDisplayAsElement(row.liborFloor); 
  }

  upfrontFeeRenderer(cell, row){
    return cUtils.formatPercentToDisplayAsElement(row.upfrontFee);
  }

  maturityRenderer(cell, row){
    return <NumberFormat value={row.maturity} displayType={'text'} suffix={'yrs'} />
  }

  cashIntrestRenderer(cell, row){
    return cUtils.formatPercentToDisplayAsElement(row.cashInterest);
  }

  getCompanyNameRenderer(cell, row){
    let list = (this.state ? this.state.companyList : null);
    for(var i=0; list && i<list.length; i++){
      if(list[i].companyId === row.createdByCompanyId){
        return <a href={'/companyDetails/'+row.createdByCompanyId}>{list[i].companyName}</a>;
      }
    }
    return 'N/A';
  }

  getCreatedByNameRenderer(cell, row){
    let list = (this.state ? this.state.userList : null);
    for(var i=0; list && i<list.length; i++){
      if(list[i].userId === row.createdById){
        return <span>{list[i].email}</span>;
      }
    }
    return 'N/A';
  }

  getDateFormatRenderer(cell, row){
    return <span>{dateFormat(moment(row.timestamp), 'longDate')}</span>
    // return  <FormattedDate value={row.timestamp} format="short" />
  }

  maxDebtRenderer(cell, row){
    return cUtils.formatCurrencyToDisplayAsElement(row.maxDebtAllowed);
  }

  cashIntrestRenderer(cell, row){
    return cUtils.formatPercentToDisplayAsElement(row.cashInterest); 
  }

  pikRenderer(cell, row){
    return cUtils.formatPercentToDisplayAsElement(row.pikIntreset);
  }

  liborFloorRenderer(cell, row){
    return cUtils.formatPercentToDisplayAsElement(row.liborFloor);
  }

  maturityRenderer(cell, row){
    return <NumberFormat value={row.maturity} displayType={'text'} suffix={'yrs'} />
  }

  upfrontFeeRenderer(cell, row){
    return cUtils.formatPercentToDisplayAsElement(row.upfrontFee);
  }

  yieldRenderer(cell, row){
    return cUtils.formatPercentToDisplayAsElement(row.yield); 
  }

  blendedCostRenderer(cell, row){
    if(row.blendedCost){
      return(
        <div>
        {
          row.blendedCost && row.blendedCost.map((bc) => {
            return <p key={bc.yield}>{bc.yield + ' with '+ bc.otherLender}</p>
          })
        }
        </div>
      ); 
    }
  }


  onDoubleClicked(row){
    if(row){
      this.context.router.history.push(constants.ROUTES_MAP.VIEW_FINAL_TERM+'/'+row.finalTermId);
    }
  }

  render() {

    if (!this.props.finalTermList) {
      return <div>No Final Term sheets exist</div>;
    } else if(this.state.minimalData){
      const options = {
        onRowClick : this.onDoubleClicked.bind(this),
        onRowDoubleClick : this.onDoubleClicked.bind(this)
      }
      return (
        <div>
          <BootstrapTable 
            data={this.props.finalTermList} 
            striped={true} 
            bordered={true} 
            hover 
            condensed 
            options={options}
            headerStyle={ { background: '#00ff00' } }
            tableContainerClass='display-club-deal'>
              <TableHeaderColumn dataField="createdByCompanyName" isKey={true} dataAlign="center">Investor</TableHeaderColumn>
              <TableHeaderColumn dataField="loanSize" dataFormat={this.loanSizeRenderer} dataSort={true}>Loan Size</TableHeaderColumn>
              <TableHeaderColumn dataField="yield" dataFormat={this.yieldRenderer} dataSort={true}>Yield Est.</TableHeaderColumn>
              <TableHeaderColumn dataField="timestamp" dataFormat={this.getDateFormatRenderer.bind(this)}>Last Updated</TableHeaderColumn>
          </BootstrapTable>
        </div>
      );
    } else {
      const options = {
        onRowClick : this.onDoubleClicked.bind(this),
        onRowDoubleClick : this.onDoubleClicked.bind(this)
      }
      return (
        <div>
          <BootstrapTable 
            data={this.props.finalTermList} 
            striped={true} 
            bordered={true} 
            hover 
            condensed 
            options={options}
            headerStyle={ { background: '#00ff00' } }
            tableContainerClass='display-club-deal'>
              <TableHeaderColumn dataField="createdByCompanyName" isKey={true} dataAlign="center">Investor</TableHeaderColumn>
              <TableHeaderColumn dataField="loanSize" dataFormat={this.loanSizeRenderer} dataSort={true} >Loan Size</TableHeaderColumn>
              <TableHeaderColumn dataField="liborSpread" dataFormat={this.cashIntrestRenderer} dataSort={true} >Interest</TableHeaderColumn>
              <TableHeaderColumn dataField="pikIntreset" dataFormat={this.pikRenderer} dataSort={true}>PIK</TableHeaderColumn>
              <TableHeaderColumn dataField="liborFloor" dataFormat={this.liborFloorRenderer} dataSort={true} >LIBOR Floor</TableHeaderColumn>
              <TableHeaderColumn dataField="maturity" dataFormat={this.maturityRenderer} dataSort={true} >Maturity</TableHeaderColumn>
              <TableHeaderColumn dataField="upfrontFee" dataFormat={this.upfrontFeeRenderer} dataSort={true} >OID</TableHeaderColumn>
              <TableHeaderColumn dataField="yield" dataFormat={this.yieldRenderer} dataSort={true} >Yield Est.</TableHeaderColumn>
              <TableHeaderColumn dataField="blendedCost" dataFormat={this.blendedCostRenderer}>Blended Cost</TableHeaderColumn>
          </BootstrapTable>
        </div>
      );
    }
  }
}