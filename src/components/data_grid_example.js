import React, { Component, PropTypes } from 'react';
import ReactDataGrid from 'react-data-grid';
import exampleWrapper from './exampleWrapper';
const { Toolbar, Data: { Selectors } } = require('react-data-grid-addons');
import { Link } from 'react-router-dom';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import Header from './header';

class DataGrid extends Component{

  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props) {
    super(props);

    // console.log('I am in DataGrid constructor');
    this._columns = this.props.columns;

    this.state = { 
      rows: this.props.dataList
      , filters: {}
      , sortColumn: null
      , sortDirection: null
      , selectedIndexes: []
    };
  }

  componentWillMount(){
    // console.log('I am in DataGrid, componentWillMount');
    // this._columns = this.props.columns;
    // this.setState({
    //   rows: this.props.dataList
    //   , filters: {}
    //   , sortColumn: null
    //   , sortDirection: null
    //   , selectedIndexes: []
    // });
  }

  componentWillReceiveProps(nextProps){
    // console.log('I am in data_grid_example, componentWillReceiveProps');
    this._columns = nextProps.columns;
    // console.log('this._columns:'+JSON.stringify(this._columns));
    // console.log('nextProps.dataList:'+JSON.stringify(nextProps.dataList));
    this.setState({
      rows : nextProps.dataList
      , filters: {}
      , sortColumn: null
      , sortDirection: null
      , selectedIndexes: []      
    });
    // this.forceUpdate();
  }


  getRows() {
    return Selectors.getRows(this.state);
  }

  getSize() {
    return this.getRows().length;
  }

  rowGetter(rowIdx) {
    const rows = this.getRows();
    return rows[rowIdx];
  }

  handleGridSort(sortColumn, sortDirection) {
    this.setState({ sortColumn: sortColumn, sortDirection: sortDirection });
  }

  handleFilterChange(filter) {
    let newFilters = Object.assign({}, this.state.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }

    this.setState({ filters: newFilters });
  }

  onClearFilters() {
    this.setState({ filters: {} });
  }

  onRowClick(rowIdx, row) {
    if(this.props.clickableRow == "true" && rowIdx > -1){
      lsUtils.setValue(constants.KEY_RFP_OBJECT, row);
      this.context.router.history.push(constants.ROUTES_MAP.RFP_DETAIL+'/'+row.rfpId);
    } else {
      return null;
    }
  }

  render() {
    // console.log('I am in render of data_grid_example');
    if(this.props.showFilter === 'true'){
      // console.log('I am in showFiter is true');
      return  (
        <ReactDataGrid
          rowKey="rfpId"
          onGridSort={this.handleGridSort.bind(this)}
          enableCellSelect={true}
          columns={this._columns}
          rowGetter={this.rowGetter.bind(this)}
          rowsCount={this.getSize()}
          minHeight={500}
          toolbar={<Toolbar enableFilter={true}/>}
          onAddFilter={this.handleFilterChange.bind(this)}
          onClearFilters={this.onClearFilters.bind(this)}
          onRowClick={this.onRowClick.bind(this)}
          onGridRowsUpdated = {this.props.onGridRowsUpdated}
        />);
    } else {
      // console.log('I am here, where showFilter = false');
      // console.log('this._columns:'+JSON.stringify(this._columns));
      return  (
        <ReactDataGrid
          rowKey="rfpId"
          enableCellSelect={true}
          columns={this._columns}
          rowGetter={this.rowGetter.bind(this)}
          rowsCount={this.getSize()}
          minHeight={500}
          onRowClick={this.onRowClick.bind(this)}
          onGridRowsUpdated = {this.props.onGridRowsUpdated}
        />);
    }
  }
}

export default DataGrid;
