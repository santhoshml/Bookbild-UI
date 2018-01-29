import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import DisplayIOIList from './display_IOI_list';
import { appendToMsgList, getMsgListAction, fetchAllContactsToMessageAction, postNewMsgAction } from '../actions/index';
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
import Text from 'react-format-text';
import { CircleLoader } from 'react-spinners';


class DisplayMessage extends Component{
  constructor(props){
    super(props);

    this.handleNewContentChange = this.handleNewContentChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNewMsgLinkSubmit = this.handleNewMsgLinkSubmit.bind(this);
  }

  componentWillMount() {
    let user    = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    this.setState({
      user : user,
      company : company,
      activeMessageId : null,
      loading : true
    });
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.isComposeNewMsg && nextProps.isComposeNewMsg !== this.state.isComposeNewMsg){
      // console.log('will compose a new msg');
      this.props.fetchAllContactsToMessageAction();
      this.setState({
        isComposeNewMsg : nextProps.isComposeNewMsg,
        loading : false
      });
    } else if(nextProps.activeMessageId && nextProps.activeMessageId !== this.state.activeMessageId){
      // console.log('will get msgs list for msgId:'+nextProps.activeMessageId);
      this.props.getMsgListAction(nextProps.activeMessageId);
      this.setState({
        activeMessageId : nextProps.activeMessageId,
        loading : false
      });
    }
  }

  handleToChange(value) {
    this.setState({
      to : value
    });
  }

  handleNewContentChange(event) {
    this.setState({
      newContent : event.target.value
    });
  }

  handleNewMsgLinkSubmit(event){
    event.preventDefault();
    let props = {
      toId : msgUtils.getContactId(this.state.to, this.props.contactList),
      msg : this.state.newContent,
      fromId : this.state.user.contactId,
      contactCompanyMap : {}
    };
    props.contactCompanyMap[props.fromId] = this.state.user.companyId;
    props.contactCompanyMap[props.toId] = msgUtils.getCompanyId(props.toId, this.props.contactList);
    // console.log('will do postNewMsgAction, props :'+ JSON.stringify(props));
    this.props.postNewMsgAction(props)
    this.props.resetComposeNewMessage();
  }

  // user is replying to the old msg
  handleSubmit(event) {
    let that = this;
    event.preventDefault();
    let props = {
      messageId : this.props.activeMessageId,
      msg : this.state.newContent,
      fromId : this.state.user.contactId
    };
    // console.log('In display_message.handleSubmit, props:'+ JSON.stringify(props));
    this.props.appendToMsgList(props)
    .then(() => {
      that.props.getMsgListAction(that.props.activeMessageId);
    });
    this.setState({
      newContent : ''
    });
  }

  displayEachPreviousMsg(){
    return this.props.messages.msgList.map((msg)=>{
          // console.log('msg :'+ JSON.stringify(msg));
          if(msg.fromId === this.state.user.contactId){
            return(
                <div key={new Date().getTime() * Math.random()} style={{display: 'block', textAlign: 'right', width : 'inherit', position : 'relative'}}>
                  <div style={{padding: '10px', fontSize : '13px'}}>
                    {this.props.convContactMap[msg.fromId]} says ({dateFormat(msg.timestamp, 'hh:MM tt, mmm dd')})...
                  </div>
                  <div style={{padding: '10px', margin: '5px', borderRadius : '25px', background: '#F5F5F5'}}>
                    {this.getFormattedText(msg.msg)}
                  </div>
                  <br/>
                </div>
            );
          } else {
            return(
                <div key={new Date().getTime() * Math.random()} style={{display: 'block', textAlign: 'left', width : 'inherit', position : 'relative'}}>
                  <div style={{padding: '10px', fontSize : '13px'}}>
                    {this.props.convContactMap[msg.fromId]} says ({dateFormat(msg.timestamp, 'hh:MM tt, mmm dd')})...
                  </div>
                  <div style={{padding: '10px', margin: '5px', borderRadius : '25px', border : '2px solid #F5F5F5'}}>
                  {this.getFormattedText(msg.msg)}
                  </div>
                  <br/>
                </div>
            );
          }
        })
  }

  getFormattedText(msg){
    return (<Text>{msg}</Text>);
  }

  displayPreviousMsgs(){
    // console.log('now displaying adat with scrollArea');
    return (
      <ScrollArea
        speed={0.8}
        className="area"
        contentClassName="content"
        horizontal={false}
        style={{height : '350px', backgroundColor : 'white'}}
        smoothScrolling = {true}
        >
          {this.props.messages ? this.displayEachPreviousMsg.bind(this) : ''}
      </ScrollArea>
    );
  }

  displayMessageBody(){
    // console.log('this.props.isComposeNewMsg :'+this.props.isComposeNewMsg);
    if(this.props.isComposeNewMsg){
      return(
        <div>
          <div className="body-header">New Message</div>
          <hr style={{marginTop:'15px', marginBottom:'0px'}}/>
          <form onSubmit={this.handleNewMsgLinkSubmit}>
            <div>
              <Autosuggest
                datalist = {this.props.nameDropdownList}
                placeholder="Start typing the name..."
                onChange = {this.handleToChange}
                value = {this.state.to}
              />
              </div>
            <div>
              <textArea 
                rows = "17"
                style={{width : '100%', fontSize:'15px', fontWeight:'400'}} 
                placeholder = "your content will showup here..."
                name="pastContent" 
                value = {''}
                disabled />
            </div>
            <div>
              <textArea 
                rows = "10"
                style={{width : '100%', fontSize:'15px', fontWeight:'400', resize:'none'}} 
                name="newContent"
                value = {this.state.newContent}
                onChange = {this.handleNewContentChange}
                placeholder = "Write a message here to reply ..."
                />
            </div>
            <div>
              <input 
                style = {{float:"right", paddingLeft: "20px", paddingRight: "20px", marginRight:"20px"}}
                type="submit" 
                name="buttonArea" 
                value="Send"/>
            </div>
          </form>
        </div>
      );
    } else {
      // console.log('now displaying the old content');
      // console.log('this.state.newContent :'+this.state.newContent);
      return(
        <div>
          <div><span className="body-header">{this.props.contactName}</span>, <span className="body-header-companyName">{this.props.companyName}</span></div>
          <hr style={{marginTop:'15px', marginBottom:'0px'}}/>        
          <form onSubmit={this.handleSubmit}>
            <div>
              {this.displayPreviousMsgs()}
            </div>
            <hr style={{marginTop:'0px', marginBottom:'0px'}}/>
            <div>
              <textArea 
                rows = "10"
                style={{width : '100%', fontSize:'15px', fontWeight:'400', resize:'none'}} 
                name="newContent"
                value = {this.state.newContent}
                onChange = {this.handleNewContentChange}
                placeholder = "Write a message here to reply ..."
                />
            </div>
            <div>
              <input 
                style = {{float:"right", paddingLeft: "20px", paddingRight: "20px", marginRight:"20px"}}
                type="submit" 
                name="buttonArea" 
                value="Send"/>
            </div>
          </form>
        </div>
      );
    }
  }  

  render(){
    
    return(
      <div style={{float : 'right', width : '70%', height : '700px', border : '1px solid black'}}>
        {this.displayMessageBody()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  let rObject =  {};
  
  if(state.contactList.contactList){
    let nameDropdownList = [];
    let ctList = state.contactList.contactList;
    if(ctList && ctList.length > 0){
      for(let i=0; i< ctList.length; i++){
        let contact = ctList[i];
        nameDropdownList.push(contact.fullName+'<'+contact.companyName+'>');
      }
    }
    rObject.nameDropdownList = nameDropdownList;
    rObject.contactList = state.contactList.contactList;
  }

  if(state.messages.messages){
    rObject.messages = state.messages.messages;
  }

  if(state.messages.convContactMap){
    rObject.convContactMap = state.messages.convContactMap;
  }

  return rObject;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchAllContactsToMessageAction : fetchAllContactsToMessageAction,
    postNewMsgAction  : postNewMsgAction,
    getMsgListAction :  getMsgListAction,
    appendToMsgList : appendToMsgList
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayMessage);
