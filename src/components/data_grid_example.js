import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import exampleWrapper from './exampleWrapper';
const { Toolbar, Data: { Selectors } } = require('react-data-grid-addons');

const DataGrid = React.createClass({

  getInitialState() {
    console.log('I am in DataGrid constructor');
    console.log('coloumns:'+JSON.stringify(this.props.columns));
    console.log('data:'+JSON.stringify(this.props.dataList));

    this._columns = this.props.columns;

    return { rows: this.props.dataList, filters: {}, sortColumn: null, sortDirection: null };
  },


  getRows() {
    return Selectors.getRows(this.state);
  },

  getSize() {
    return this.getRows().length;
  },

  rowGetter(rowIdx) {
    const rows = this.getRows();
    return rows[rowIdx];
  },

  handleGridSort(sortColumn, sortDirection) {
    this.setState({ sortColumn: sortColumn, sortDirection: sortDirection });
  },

  handleFilterChange(filter) {
    let newFilters = Object.assign({}, this.state.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }

    this.setState({ filters: newFilters });
  },

  onClearFilters() {
    this.setState({ filters: {} });
  },

  render() {
    console.log('I am in render of data_grid_example');
    return  (
      <ReactDataGrid
        onGridSort={this.handleGridSort}
        enableCellSelect={true}
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this.getSize()}
        minHeight={500}
        toolbar={<Toolbar enableFilter={true}/>}
        onAddFilter={this.handleFilterChange}
        onClearFilters={this.onClearFilters} />);
  }
});

// const exampleDescription = (
//   <div>
//     <p>While ReactDataGrid does not provide the ability to sort or filter directly, it does provide hooks that allow you to provide your own sort and filter function. This is done via the <code>onGridSort</code> and <code>onAddFilter</code> props. To enable sorting for a given column, set <code>column.sortable = true</code> for that column, to enable filtering for a given column, set <code>column.filterable = true</code> for that column. Now when the header cell is clicked for that column, <code>onGridSort</code> will be triggered passing the column name and the sort direction, when the filterable cell has a new filter value entered for that column, <code>onAddFilter</code> will be triggered passing the filter key and value.
//     </p>
//   </div>
// );

// module.exports = exampleWrapper({
//   WrappedComponent: Example,
//   exampleName: 'Filterable Sortable Columns Example',
//   exampleDescription,
//   examplePath: './scripts/example16-filterable-sortable-grid.js',
//   examplePlaygroundLink: undefined
// });

export default DataGrid;
