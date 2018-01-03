import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import DisplayIOIList from './display_IOI_list';
import { getMsgListAction, fetchAllContactsToMessageAction, postNewMsgAction, fetchAllMessagesForAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import cUtils from '../utils/common_utils';
import msgUtils from '../utils/message_utils';
import constants from '../utils/constants';
import NavBar from './sidebar';
import Header from './header';
// import Autosuggest from 'react-autosuggest';
import Autosuggest from 'react-bootstrap-autosuggest';
import dateFormat from 'dateformat';
import ScrollArea from 'react-scrollbar';



class Messages extends Component{
  constructor(props){
    super(props);

    this.handleNewContentChange = this.handleNewContentChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.getMessageList = this.getMessageList.bind(this);
  }

  componentWillMount() {
    // console.log('In ioiList componentWillMount');
    let user    = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);

    this.props.fetchAllMessagesForAction(user.contactId);
    this.setState({
      user : user,
      company : company,
      isComposeNewMsg : false,
      newContent : null,
      to : null
    });
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.messages){
      this.setState({
        isDisplayMsg : true
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

  handleSubmit(event) {
    // console.log('In handleSubmit');
    // console.log('to : '+ this.state.to);
    // console.log('submit :'+this.state.newContent);
    event.preventDefault();
    let props = {
      toId : msgUtils.getContactId(this.state.to, this.props.contactList),
      msg : this.state.newContent,
      fromId : this.state.user.contactId,
      ccMap : {}
    };
    props.ccMap[props.fromId] = this.state.user.companyId;
    props.ccMap[props.toId] = msgUtils.getCompanyId(props.toId, this.props.contactList);
    // console.log('props :'+JSON.stringify(props));
    this.props.postNewMsgAction(props);
  }

  onComponseNewMessage(){
    this.props.fetchAllContactsToMessageAction();
    if(!this.state.isComposeNewMsg){
      this.setState({
        isComposeNewMsg : true
      });
    }
  }

  displayEachPreviousMsg(){
    return this.props.messages.msgList.map((msg)=>{
          // console.log('msg :'+ JSON.stringify(msg));
          if(msg.fromId === this.state.user.contactId){
            return(
                <div key={new Date().getTime() * Math.random()} style={{display: 'block', textAlign: 'right', width : 'inherit', position : 'relative'}}>
                  <div style={{fontSize : '13px'}}>
                    {this.props.convContactMap[msg.fromId]} says...
                  </div>
                  <div style={{padding: '10px', margin: '5px', borderRadius : '25px', background: '#F5F5F5'}}>
                    {msg.msg}
                  </div>
                  <div style={{fontSize : '13px', textAlign: 'right'}}>
                    {dateFormat(msg.timestamp, 'hh:MM tt, mmm dd')}
                  </div>
                </div>
            );
          } else {
            return(
                <div key={new Date().getTime() * Math.random()} style={{display: 'block', textAlign: 'left', width : 'inherit', position : 'relative'}}>
                  <div style={{fontSize : '13px'}}>
                    {this.props.convContactMap[msg.fromId]} says...
                  </div>
                  <div style={{padding: '10px', margin: '5px', borderRadius : '25px', border : '2px solid #F5F5F5'}}>
                    {msg.msg}
                  </div>
                  <div style={{fontSize : '13px', textAlign: 'left'}}>
                    {dateFormat(msg.timestamp, 'hh:MM tt, mmm dd')}
                  </div>
                </div>
            );
          }
        })
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
        >
          {this.displayEachPreviousMsg.bind(this)}
      </ScrollArea>
    );
  }

  displayMessageBody(){
    if(this.state.isComposeNewMsg){
      return(
        <div>
          <div className="body-header">New Message</div>
          <hr style={{marginTop:'15px', marginBottom:'0px'}}/>
          <form onSubmit={this.handleSubmit}>
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
                placeholder = "old content"
                name="pastContent" 
                value = {this.props.messages ? this.displayPreviousMsgs  : ''}
                disabled />
            </div>
            <div>
              <textArea 
                rows = "10"
                style={{width : '100%', fontSize:'15px', fontWeight:'400', resize:'none'}} 
                name="newContent"
                value = {this.state.newContent}
                onChange = {this.handleNewContentChange}
                placeholder = "Write a message here ..."
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
    } else if(this.state.isDisplayMsg){
      // console.log('now displaying the old content');
      return(
        <div>
          <div><span className="body-header">{this.state.ctName}</span>, <span className="body-header-companyName">{this.state.ctCompanyName}</span></div>
          <hr style={{marginTop:'15px', marginBottom:'0px'}}/>        
          <form onSubmit={this.handleSubmit}>
            <div>
              {this.props.messages ? this.displayPreviousMsgs()  : ''}
            </div>
            <hr style={{marginTop:'0px', marginBottom:'0px'}}/>
            <div>
              <textArea 
                rows = "10"
                style={{width : '100%', fontSize:'15px', fontWeight:'400', resize:'none'}} 
                name="newContent"
                value = {this.state.newContent}
                onChange = {this.handleNewContentChange}
                placeholder = "Write a message here ..."
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

  getMessageList(messageId, ctName, ctCompanyName){
    // console.log('I am in getMessageList : '+messageId);
    this.props.getMsgListAction(messageId);
    this.setState({
      ctName : ctName,
      ctCompanyName : ctCompanyName
    });

  }

  formatMsgLink(msgLink){
    let list = msgLink.groupAsString.split('_').filter((ct)=>{
      if(ct === this.state.user.contactId){
        return false;
      } else return true;
    });
    
    // console.log('list: '+JSON.stringify(list));

    return list.map((ct)=>{
      // console.log('ct:'+ct);
      // console.log('this.props.msgContactMap[ct]'+this.props.msgContactMap[ct]);
      let ctName = this.props.msgContactMap[ct];      
      return (
        <a href="#" key={msgLink.messageId} onClick={this.getMessageList.bind(this, msgLink.messageId, ctName, msgLink.companyName)}>
            <span style={{float : 'left', fontWeight : '400'}}>{ctName}</span>
            <span style={{float : 'right'}}>{dateFormat(msgLink.timestamp, 'mmm dd, yy')}</span>
          <br/>
            <span style={{float : 'left'}}>{msgLink.companyName}</span>
        </a>
      );
    });
  }

  renderMsgLinks(){
      return this.props.msgLinkList.map((msgLink) => {
        return (
          <tr key={msgLink.messageId}>
            <td>{this.formatMsgLink(msgLink)}</td>
          </tr>
        );
      });
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
            <div style={{width: '100%', overflow : 'auto'}}>
              <div style={{float : 'left', width : '30%', height : '700px', border : '1px solid black'}}>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Messages <i onClick={this.onComponseNewMessage.bind(this)} className="fa fa-pencil-square-o" style={{float: 'right'}} aria-hidden="true"></i></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.msgLinkList ? this.renderMsgLinks() : ''}
                  </tbody>
                </table>
              </div>
              <div style={{float : 'right', width : '70%', height : '700px', border : '1px solid black'}}>
                {this.displayMessageBody()}
              </div>
            </div>
          </div>
        </div>
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

  if(state.messages.msgLinkList){
    rObject.msgLinkList = state.messages.msgLinkList;
  }

  if(state.messages.msgContactMap){
    rObject.msgContactMap = state.messages.msgContactMap;
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
    fetchAllMessagesForAction : fetchAllMessagesForAction,
    getMsgListAction :  getMsgListAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
