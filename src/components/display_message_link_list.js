import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import DisplayIOIList from './display_IOI_list';
import { fetchAllMessagesForAction } from '../actions/index';
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



class DisplayMessageLinkList extends Component{
  constructor(props){
    super(props);
  }

  componentWillMount() {
    // console.log('In ioiList componentWillMount');
    let user    = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    this.props.fetchAllMessagesForAction(user.contactId);
    this.setState({
      user : user,
      company : company
    });
  }

  componentWillReceiveProps(nextProps){
    // console.log('In componentWillReceiveProps will get the msgs ');
    if(nextProps.msgLinkList && nextProps.msgLinkList != this.props.msgLinkList){
      let msgObject = msgUtils.getMsgListData(nextProps.msgLinkList[0], this.state.user.contactId);
      this.props.setActiveMessage(msgObject.messageId, msgObject.contactNames, msgObject.companyNames);
    }    
  }

  formatMsgLink(msg){
    // console.log('In formatMsgLink, msgLink :'+JSON.stringify(msg));
    let msgListObject = msgUtils.getMsgListData(msg, this.state.user.contactId);
    return (
      <a href="#" key={msgListObject.messageId}
        onClick={this.props.setActiveMessage.bind(this, msgListObject.messageId, msgListObject.contactNames, msgListObject.companyNames)}>
          <span style={{float : 'left', fontWeight : '400'}}>{msgListObject.contactNames}</span>
          <span style={{float : 'right'}}>{dateFormat(msgListObject.timestamp, 'mmm dd, yy')}</span>
        <br/>
          <span style={{float : 'left'}}>{msgListObject.companyNames}</span>
      </a>
    );
  }

  renderMsgLinks(){
      return this.props.msgLinkList.map((msg) => {
        return (
          <tr key={msg.msgLink.messageId}>
            <td>{this.formatMsgLink(msg)}</td>
          </tr>
        );
      });
  }

  render(){
    
    return(
      <div style={{float : 'left', width : '30%', height : '700px', border : '2px solid black'}}>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Messages <a onClick={this.props.onComponseNewMessage.bind(this)} className="fa fa-pencil-square-o" style={{float: 'right'}} aria-hidden="true"></a></th>
            </tr>
          </thead>
          <tbody>
            {this.props.msgLinkList ? this.renderMsgLinks() : ''}
          </tbody>
        </table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let rObject =  {};
  if(state.messages.msgLinkList){
    rObject.msgLinkList = state.messages.msgLinkList;
    // console.log('rObject.msgLinkList :'+JSON.stringify(rObject.msgLinkList));
  }
  return rObject;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchAllMessagesForAction : fetchAllMessagesForAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayMessageLinkList);
