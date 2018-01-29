import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { getWGLByLinkIdAction, getLinksWithCompanyIdAction, addContactToWGLAction, deleteContactFromWGLAction, updateContactCellWGLAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import cUtils from '../utils/common_utils';
import NavBar from './sidebar';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Header from './header';
import DataroomDropdown from './data_room_dropdown';


class WGL extends Component{
  constructor(props){
    super(props);
    this.state = {
      user : null,
      company : null,
      selection:{}
		};
  }

  beforeSaveCell(row, cellName, cellValue) {
    if(cellName === 'email')
      return false;
    return true;
  }

  afterSaveCell(row, cellName, cellValue) {
    let data = {
      'contactId' : row.contactId,
      'cellName'  : cellName,
      'cellValue' : cellValue
    };
    this.props.updateContactCellWGLAction(data);
  }

  onAfterInsertRow(row) {
    let newRowStr = '';
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
      linkId : this.state.selectedLink.linkId
    };
    this.props.addContactToWGLAction(data);
    //have a hook to add to the db
  }

  onAfterDeleteRow(wglListIds, rows) {
    this.props.deleteContactFromWGLAction(wglListIds);
  }

  _onSelectDropdown(event){
		this.props.linkList.forEach(link => {
			if(link.linkId === event.value){
        this.props.getWGLByLinkIdAction(event.value);
				this.setState({
					selectedLink : link,
					selectedDropDown : event
				});
			}
    });
  }

  componentWillMount() {
    // this.props.fetchAllRFPAction();
    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    let type = null;
    this.setState({
      user : user,
      company : company
    });
    
    if(user.role === constants.KEY_COMPANY || user.role === constants.KEY_FINANCIAL_SPONSOR){
			type = 'BORROWER';
		} else if(user.role === constants.KEY_LENDER){
			type = 'LENDER';
    }
    
    // console.log('user.companyId :'+user.companyId);
    // console.log('type :'+type);
    this.props.getLinksWithCompanyIdAction(user.companyId, type);
  }

  // toggleDisplayWGLList(id, ctx){

  //   let wglMapKeys = Object.keys(this.props.wglMap);
  //   for(let i=0; i<wglMapKeys.length; i++){
  //     let wgl = this.props.wglMap[wglMapKeys[i]];

  //     if(wgl.linkId !== id)
  //       wgl.display = false;
  //     else
  //       wgl.display = !wgl.display;

  //     if(wgl.display === true){
  //       lsUtils.setValue(constants.KEY_SELECTED_LINK, wgl.linkId);
  //     }
  //   }
  // }

  returnTableOptions(){
    return {
      afterInsertRow: onAfterInsertRow   // A hook for after insert rows
    };
  }


  displayWGLListElement(wglList, ctx){
    // console.log('In displayWGLListElement, wgl:'+JSON.stringify(wglList));

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


  displayNotActivatedMessage(){
    return(<div>
      <h4>Selected link is not activated yet by the borrower</h4>
      </div>);
  }

  render(){
    // console.log('I am in wgl render');
    return(
      <div>
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >
            <br/>
            <br/>
            <h3>Working Group List (WGL)</h3>
						<br/>
            <p>Select the link from dropdown to see the working group list related to the deal.</p>
            <br/>                        
            <DataroomDropdown linkList={this.props.linkList} onChange={this._onSelectDropdown.bind(this)} selectedDropDown={this.state.selectedDropDown}/> 
            <br/>
            <br/>
            {this.state.selectedLink 
              ? (this.state.selectedLink.accessToLender[constants.KEY_ACCESS_CONTROL_WGL] === true
                ? this.displayWGLListElement(this.props.wgl ? this.props.wgl : null)
                : this.displayNotActivatedMessage())
              : ""}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let rObject = {};

  if(state.wgl.wgl){
    // console.log('state.wgl.wgl : '+ JSON.stringify(state.wgl.wgl));
    rObject.wgl = state.wgl.wgl;
  }

  if(state.link.linkList){
    // console.log('In mapStateToProps, state.link.linkList :'+JSON.stringify(state.link.linkList));
		rObject.linkList = state.link.linkList;
	}
  return rObject;
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    getWGLByLinkIdAction : getWGLByLinkIdAction,
    addContactToWGLAction       : addContactToWGLAction,
    deleteContactFromWGLAction  : deleteContactFromWGLAction,
    updateContactCellWGLAction  : updateContactCellWGLAction,
    getLinksWithCompanyIdAction   : getLinksWithCompanyIdAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WGL);
