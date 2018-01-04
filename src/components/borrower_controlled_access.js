import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { getBorrowerControlledAccessListAction, updateAccessToLenderFlag } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import cUtils from '../utils/common_utils';
import NumberFormat from 'react-number-format';
import dateFormat from 'dateformat';
import moment from 'moment';
import NavBar from './sidebar';
import Header from './header';
import Switch from 'react-toggle-switch'
import Toggle from 'react-toggle';
import Dropdown from 'react-dropdown';
import DataroomDropdown from './data_room_dropdown';


class borrowerControlledAccess extends Component{
  constructor(props){
    super(props);
    this.state = {
      user : null,
      company : null
		}
  }

  componentWillMount() {
    // this.props.fetchAllRFPAction();
    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    this.props.getBorrowerControlledAccessListAction(user.companyId);
    this.setState({
      user : user,
      company : company
    });
  }

  componentWillReceiveProps(nextProps){
    // console.log('In componentWillReceiveProps :');
    this.setState({
      borrowerControlledAccessList : nextProps.borrowerControlledAccessList
    });
    
  }

  onToggleSwitch(e){
    // console.log('In onToggleSwitch');
    let type = e.target.id
    let newStateValue = this.state.selectedAccessList;
    newStateValue[type] = !newStateValue[type];
    let updatedLinkId = null;

    let list = this.state.borrowerControlledAccessList;
    for(let i=0;i<list.length; i++){
      // console.log('list[i]:'+JSON.stringify(list[i]));
      if(list[i].linkId === this.state.selectedDropDown.value){
        updatedLinkId = list[i].linkId;
        list[i].accessToLender = newStateValue;
        break;
      }
    }
    this.props.updateAccessToLenderFlag({
      linkId : updatedLinkId,
      accessToLender : newStateValue
    });
    // console.log('updated list:'+ JSON.stringify(list));
    this.setState({
      borrowerControlledAccessList : list,
      selectedAccessList : newStateValue
    });
  }

  _onSelectDropdown(event){
    // console.log('I am in _onSelectDropdown');
    // console.log('event:'+JSON.stringify(event));
    // console.log('borrowerControlledAccessList :'+JSON.stringify(this.state.borrowerControlledAccessList));
    let selectedAccessList = null;
    for(let i=0; i< this.state.borrowerControlledAccessList.length; i++){
      if(this.state.borrowerControlledAccessList[i].linkId === event.value){
        selectedAccessList = this.state.borrowerControlledAccessList[i].accessToLender;
        break;
      }
    }
    // console.log('selectedAccessList:'+JSON.stringify(selectedAccessList));
    this.setState({
      selectedDropDown : event,
      selectedAccessList : selectedAccessList
    });

  }

  displayAccessListDetails(){
    return(<div>
        <label>
          <Toggle 
            id = {constants.KEY_ACCESS_CONTROL_QCOMPLIANCE}
            onChange={this.onToggleSwitch.bind(this)}
            checked={this.state.selectedAccessList.QCOMPLIANCE}/>
          <span className="indent">Quarterly Compliance</span>
        </label>
        <br/>
        <label>
          <Toggle 
            id = {constants.KEY_ACCESS_CONTROL_DEAL_TEAM}
            onChange={this.onToggleSwitch.bind(this)}
            checked={this.state.selectedAccessList.DEAL_TEAM}/>
          <span className="indent">Deal Team</span>
        </label>
        <br/>
        <label>
          <Toggle 
            id = {constants.KEY_ACCESS_CONTROL_DOCUMENTS}
            onChange={this.onToggleSwitch.bind(this)}
            checked={this.state.selectedAccessList.DOCUMENTS}/>
          <span className="indent">Documents</span>
        </label>
        <br/>
        <label>
          <Toggle 
            id = {constants.KEY_ACCESS_CONTROL_WGL}
            onChange={this.onToggleSwitch.bind(this)}
            checked={this.state.selectedAccessList.WGL}/>
          <span className="indent">Working Group List</span>
        </label>
      </div>);
  }

  render(){
    // console.log('In render of borrowerControlledAccess');
    return(
      <div>
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >
            <br/>
            <br/>
            <h3>select a link from the below dropdown to update the access control settings</h3>
            <br/>
            <br/>            
            <DataroomDropdown linkList={this.state.borrowerControlledAccessList} onChange={this._onSelectDropdown.bind(this)} selectedDropDown={this.state.selectedDropDown}/> 
            <br/>
            <br/>
            {this.state.selectedAccessList ? this.displayAccessListDetails() : ""}         
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  // Whatever is returned will show up as props
  // console.log('state:'+JSON.stringify(state));

  let rObject = {
    borrowerControlledAccessList : state.controlledAccessList.borrowerControlledAccessList
  };

  return rObject;
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    getBorrowerControlledAccessListAction : getBorrowerControlledAccessListAction,
    updateAccessToLenderFlag : updateAccessToLenderFlag
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(borrowerControlledAccess);
