import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { getBorrowerControlledAccessListAction
  , updateAccessToLenderFlag
  , sendAMsgFromAdminWithCompanyIdAndCompanyName } from '../actions/index';
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
import { CircleLoader } from 'react-spinners';


class borrowerControlledAccess extends Component{
  constructor(props){
    super(props);
    this.state = {
      user : null,
      company : null,
      loading : true
		}
  }

  componentWillMount() {
    // this.props.fetchAllRFPAction();
    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    this.props.getBorrowerControlledAccessListAction(user.companyId);
    this.setState({
      user : user,
      company : company,
      loading : true
    });
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      borrowerControlledAccessList : nextProps.borrowerControlledAccessList,
      loading : false
    });
    
  }

  onToggleSwitch(e){
    let that = this;
    let type = e.target.id
    let newStateValue = this.state.selectedAccessList;
    newStateValue[type] = !newStateValue[type];
    let updatedLink = null;

    let list = this.state.borrowerControlledAccessList;
    for(let i=0;i<list.length; i++){
      if(list[i].linkId === this.state.selectedDropDown.value){
        updatedLink = list[i];
        list[i].accessToLender = newStateValue;
        break;
      }
    }

    this.setState({
      borrowerControlledAccessList : list,
      selectedAccessList : newStateValue,
      loading : true
    });

    this.props.updateAccessToLenderFlag({
      linkId : updatedLink.linkId,
      accessToLender : newStateValue
    })
    .then((data)=> {

      let bProps = {
        companyId : updatedLink.borrowerCompanyId,
        msg : cUtils.getMsgNameForAccess(type),
        lenderCompanyId : updatedLink.lenderCompanyId
      };
      that.props.sendAMsgFromAdminWithCompanyIdAndCompanyName(bProps);

      // send a msg to lender
      let lProps = {
        companyId : updatedLink.lenderCompanyId,
        msg : cUtils.getMsgNameForAccess(type),
        lenderCompanyId : updatedLink.lenderCompanyId
      };
      that.props.sendAMsgFromAdminWithCompanyIdAndCompanyName(lProps);

      this.setState({
        loading : false
      });
    });
  }

  _onSelectDropdown(event){
    let selectedAccessList = null;
    for(let i=0; i< this.state.borrowerControlledAccessList.length; i++){
      if(this.state.borrowerControlledAccessList[i].linkId === event.value){
        selectedAccessList = this.state.borrowerControlledAccessList[i].accessToLender;
        break;
      }
    }
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
    updateAccessToLenderFlag : updateAccessToLenderFlag,
    sendAMsgFromAdminWithCompanyIdAndCompanyName : sendAMsgFromAdminWithCompanyIdAndCompanyName
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(borrowerControlledAccess);
