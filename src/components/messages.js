import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import DisplayIOIList from './display_IOI_list';
import {fetchAllContactsToMessageAction, postNewMsgAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import cUtils from '../utils/common_utils';
import msgUtils from '../utils/message_utils';
import constants from '../utils/constants';
import NavBar from './sidebar';
import Header from './header';
import Autosuggest from 'react-bootstrap-autosuggest';
import dateFormat from 'dateformat';
import ScrollArea from 'react-scrollbar';
import DisplayMessageLinkList from './display_message_link_list';
import DisplayMessage from './display_message';

class Messages extends Component{
  constructor(props){
    super(props);
  }

  componentWillMount() {
    // console.log('In messages componentWillMount');
    let user    = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    this.setState({
      user : user,
      company : company,
      isComposeNewMsg : false
    });
  }

  onComponseNewMessage(){
    console.log('I am in onComponseNewMessage');
    if(!this.state.isComposeNewMsg){
      this.setState({
        isComposeNewMsg : true
      });
    }
  }

  setActiveMessage(activeMessageId, contactName, companyName){
    // console.log('I am in setActiveMessage');
    this.setState({
      activeMessageId : activeMessageId,
      contactName : contactName,
      companyName : companyName
    });
  }

  resetComposeNewMessage(){
    if(this.state.isComposeNewMsg){
      this.setState({
        isComposeNewMsg : false
      });
    }
  }


  render(){
    // console.log('In messages render');
    return(
      <div>
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >
            <br/>
            <br/>
            <div style={{width: '100%', overflow : 'auto'}}>
              <DisplayMessageLinkList 
                onComponseNewMessage = {this.onComponseNewMessage.bind(this)}
                setActiveMessage = {this.setActiveMessage.bind(this)}
                />
              <DisplayMessage 
                isComposeNewMsg = {this.state.isComposeNewMsg}
                activeMessageId = {this.state.activeMessageId}
                contactName = {this.state.contactName}
                companyName = {this.state.companyName}
                resetComposeNewMessage = {this.resetComposeNewMessage.bind(this)}
                />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let rObject =  {};
  return rObject;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchAllContactsToMessageAction : fetchAllContactsToMessageAction,
    postNewMsgAction  : postNewMsgAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
