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

  covenantsRenderer(cell, row){
    let cArr = row.covenants && row.covenants.split(',');
    return(<div>
        {
          cArr && cArr.map((c)=>{
            return <p key={c}>{c}</p>
          })
        }
      </div>);
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

  onDoubleClicked(row){
    if(row){
      this.context.router.history.push(constants.ROUTES_MAP.IOI_DETAIL
        +'/'
        + (row.parentIOI ? row.parentIOI : row.ioiId));
    }
  }

  render() {
    if (!this.state.ioiList) {
      return <div>No IOIs exist</div>;
    } else if(this.state.minimalData){
      const options = {
        onRowClick : this.onDoubleClicked.bind(this)
        // onRowDoubleClick : this.onDoubleClicked.bind(this)
      }      
      return (
          <div>
          <BootstrapTable 
            data={this.state.ioiList} 
            striped={true} 
            bordered={true} 
            hover 
            condensed 
            options={options}
            headerStyle={ { background: '#00ff00' } }
            tableContainerClass='display-club-deal'>
              <TableHeaderColumn dataField="loanSize" isKey={true} dataFormat={this.loanSizeRenderer} dataSort={true}>Loan Size</TableHeaderColumn>
              <TableHeaderColumn dataField="loanStructure" dataSort={true}>Structure</TableHeaderColumn>
              <TableHeaderColumn dataField="yield" dataFormat={this.yieldRenderer} dataSort={true}>Yield Est.</TableHeaderColumn>
              <TableHeaderColumn dataField="timestamp" dataFormat={this.getDateFormatRenderer.bind(this)}>Last Updated</TableHeaderColumn>
          </BootstrapTable>
          </div>
      );
    } else {
      const options = {
        onRowClick : this.onDoubleClicked.bind(this)
        // onRowDoubleClick : this.onDoubleClicked.bind(this)
      }
      return (
        <div>
          <BootstrapTable 
            data={this.state.ioiList} 
            striped={true} 
            bordered={true} 
            hover 
            condensed 
            options={options}
            headerStyle={ { background: '#00ff00' } }
            tableContainerClass='display-club-deal'>
              <TableHeaderColumn dataField="createdByCompanyId" isKey={true} dataFormat={this.investorRenderer.bind(this)} width='65px' dataAlign="center">Investor</TableHeaderColumn>
              <TableHeaderColumn dataField="maxDebtAllowed" dataFormat={this.maxDebtRenderer} dataSort={true} width='100px'>Max Debt</TableHeaderColumn>
              <TableHeaderColumn dataField="loanSize" dataFormat={this.loanSizeRenderer} dataSort={true} width='100px'>Loan Size</TableHeaderColumn>
              <TableHeaderColumn dataField="loanStructure" dataSort={true}>Structure</TableHeaderColumn>
              <TableHeaderColumn dataField="liborSpread" dataFormat={this.cashIntrestRenderer} dataSort={true} width='60px'>Interest</TableHeaderColumn>
              <TableHeaderColumn dataField="pikIntreset" dataFormat={this.pikRenderer} dataSort={true} width='50px'>PIK</TableHeaderColumn>
              <TableHeaderColumn dataField="liborFloor" dataFormat={this.liborFloorRenderer} dataSort={true} width='70px'>LIBOR Floor</TableHeaderColumn>
              <TableHeaderColumn dataField="maturity" dataFormat={this.maturityRenderer} dataSort={true} width='50px'>Maturity</TableHeaderColumn>
              <TableHeaderColumn dataField="upfrontFee" dataFormat={this.upfrontFeeRenderer} dataSort={true} width='50px'>OID</TableHeaderColumn>
              <TableHeaderColumn dataField="governance" width='70px'>Governance</TableHeaderColumn>
              <TableHeaderColumn dataField="warrants" width='50px'>Warrants</TableHeaderColumn>
              <TableHeaderColumn dataField="covenants" dataFormat={this.covenantsRenderer}>Covenants</TableHeaderColumn>
              <TableHeaderColumn dataField="yield" dataFormat={this.yieldRenderer} dataSort={true} width='70px'>Yield Est.</TableHeaderColumn>
              <TableHeaderColumn dataField="blendedCost" dataFormat={this.blendedCostRenderer}>Blended Cost</TableHeaderColumn>
          </BootstrapTable>
        </div>
      );
    }
  }
}
