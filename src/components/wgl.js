import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { getWGLByCompanyIdAction, addContactToWGLAction, deleteContactFromWGLAction, updateContactCellWGLAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import cUtils from '../utils/common_utils';
import NavBar from './sidebar';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Header from './header';

class WGL extends Component{
  constructor(props){
    super(props);
    this.state = {
			rfp : null,
      user : null,
      company : null,
      selection:{}
		};
  }

  beforeSaveCell(row, cellName, cellValue) {
    // if you dont want to save this editing, just return false to cancel it.
    console.log('In beforeSaveCell');
    console.log('row:'+JSON.stringify(row));
    console.log('cellName:'+cellName+', cellValue:'+cellValue);
    if(cellName === 'email')
      return false;
    return true;
  }

  afterSaveCell(row, cellName, cellValue) {
    // do your stuff...
    console.log('In afterSaveCell');
    console.log('row:'+JSON.stringify(row));
    console.log('cellName:'+cellName+', cellValue:'+cellValue);
    let data = {
      'contactId' : row.contactId,
      'cellName'  : cellName,
      'cellValue' : cellValue
    };
    this.props.updateContactCellWGLAction(data);
  }

  onAfterInsertRow(row) {
    let newRowStr = '';
    console.log('row:'+JSON.stringify(row));
    console.log('props:'+JSON.stringify(this.props));
    for (const prop in row) {
      newRowStr += prop + ': ' + row[prop] + ' \n';
    }
    // alert('The new row is:\n ' + newRowStr);
    let data={
      fullName : row.fullName,
      email : row.email,
      firm : row.firm,
      contactRole : row.contactRole,
      phoneNumber : row.phoneNumber,
      mobile : row.mobile,
      linkId : lsUtils.getValue(constants.KEY_SELECTED_LINK)
    };
    this.props.addContactToWGLAction(data);
    //have a hook to add to the db
  }

  onAfterDeleteRow(wglListIds, rows) {
    console.log('In onAfterDeleteRow');
    console.log('rowKeys:'+JSON.stringify(wglListIds));
    console.log('rows:'+JSON.stringify(rows));

    // alert('The rowkey you drop: ' + rowKeys);
    this.props.deleteContactFromWGLAction(wglListIds);

  }

  componentWillMount() {
    // this.props.fetchAllRFPAction();
    let rfp = lsUtils.getValue(constants.KEY_RFP_OBJECT);
    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    this.setState({
      rfp : rfp,
      user : user,
      company : company
    });
    this.props.getWGLByCompanyIdAction(user.role, company.companyId)
    .then(data => {
      // console.log('got response for getWGLByCompanyIdAction, data:'+JSON.stringify(data));
    });
  }

  toggleDisplayWGLList(id, ctx){
    // console.log('ctx:'+JSON.stringify(ctx));
    console.log('In toggleDisplayWGLList, id:'+id);
    // this.props.wglMap[id].display = !this.props.wglMap[id].display;

    let wglMapKeys = Object.keys(this.props.wglMap);
    for(let i=0; i<wglMapKeys.length; i++){
      let wgl = this.props.wglMap[wglMapKeys[i]];

      if(wgl.linkId !== id)
        wgl.display = false;
      else
        wgl.display = !wgl.display;

      if(wgl.display === true){
        lsUtils.setValue(constants.KEY_SELECTED_LINK, wgl.linkId);
      }
    }
  }

  returnTableOptions(){
    return {
      afterInsertRow: onAfterInsertRow   // A hook for after insert rows
    };
  }


  displayWGLListElement(wglList, ctx){
    console.log('In displayWGLListElement, wgl:'+JSON.stringify(wglList));

    const options = {
      afterInsertRow: this.onAfterInsertRow.bind(this),    // A hook for after insert rows
      afterDeleteRow: this.onAfterDeleteRow.bind(this)  // A hook for after droping rows.
    };

    const cellEdit = {
      mode: 'dbclick',
      blurToSave: true,
      beforeSaveCell: this.beforeSaveCell.bind(this),
      afterSaveCell: this.afterSaveCell.bind(this)
    };

    // <button onClick={this.onDelete}>Delete Selected</button>
    // <button onClick={this.onDeselectAll}>Deselected All</button>
    // <BootstrapTable
    //   selected={this.state.selection}
    //   columns={wglColoumns}
    //   data={wglList}
    //   headers={true}
    //   sort={true}>
    //   <div className="well">There are no items to show</div>
    // </BootstrapTable>

    return (
      <div>
      <BootstrapTable
        data={wglList}
        striped={true}
        hover={true}
        insertRow={true}
        options={ options }
        selectRow={{ mode: 'checkbox' }}
        deleteRow={true}
        exportCSV={true}
        csvFileName='bookbild-wgl-contact-list.csv'
        cellEdit={ cellEdit }>
          <TableHeaderColumn dataField="wglListId" hiddenOnInsert={true} hidden={true}>Id</TableHeaderColumn>
          <TableHeaderColumn dataField="contactId" hiddenOnInsert={true} hidden={true}>Conatct Id</TableHeaderColumn>
          <TableHeaderColumn dataField="fullName" dataSort={true}>Name</TableHeaderColumn>
          <TableHeaderColumn dataField="contactRole" dataSort={true}>Title</TableHeaderColumn>
          <TableHeaderColumn dataField="firm" dataSort={true}>Firm</TableHeaderColumn>
          <TableHeaderColumn dataField="email" isKey={true} dataSort={true}>Email</TableHeaderColumn>
          <TableHeaderColumn dataField="mobile" dataSort={true}>Mobile</TableHeaderColumn>
          <TableHeaderColumn dataField="phoneNumber" dataSort={true}>Work</TableHeaderColumn>
      </BootstrapTable>
      </div>
    );
  }

  displayWGLFrame(wglFrameObject){
    console.log('wglFrameObject:'+JSON.stringify(wglFrameObject));
    return(<div key={wglFrameObject.linkId}>
      <h3><a href="#" onClick={this.toggleDisplayWGLList.bind(this, wglFrameObject.linkId)}>{wglFrameObject.name}</a></h3>
      {wglFrameObject.display ? this.displayWGLListElement(wglFrameObject.list) : ''}
      <br/>
      <br/>
    </div>);
  }

  displayAllWGLData(){
    if(this.props.wglMap){
      var linkKeys = Object.keys(this.props.wglMap);
      console.log('linkKeys:'+JSON.stringify(linkKeys));
      return linkKeys.map(linkId => {
        console.log('linkId:'+linkId);
        return this.displayWGLFrame(this.props.wglMap[linkId]);
      });
    }
  }

  render(){
    console.log('I am in wgl render');
    // console.log('In wgl, this.props.history:'+JSON.stringify(this.props.history));
    return(
      <div>
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >
            {this.displayAllWGLData()}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  // Whatever is returned will show up as props
  // console.log('In wgl state:'+JSON.stringify(state));

  let rObject = {
    wglMap : state.wgl.wgl
  };
  console.log('rObject:'+JSON.stringify(rObject));
  return rObject;
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    getWGLByCompanyIdAction     : getWGLByCompanyIdAction,
    addContactToWGLAction       : addContactToWGLAction,
    deleteContactFromWGLAction  : deleteContactFromWGLAction,
    updateContactCellWGLAction  : updateContactCellWGLAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WGL);
