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
    console.log('In componentWillReceiveProps :');
    this.setState({
      borrowerControlledAccessList : nextProps.borrowerControlledAccessList
    });
    
  }

  onToggleSwitch(e){
    let targetId = e.target.id
    let list = this.state.borrowerControlledAccessList;
    let newStateValue = false;
    for(let i=0;i<list.length; i++){
      if(list[i].lenderCompanyId === targetId){
        list[i].accessToLender = !list[i].accessToLender;
        newStateValue = list[i].accessToLender;
      }
    }
    this.props.updateAccessToLenderFlag({
      lenderCompanyId : targetId,
      borrowerCompanyId : this.state.company.companyId,
      accessToLender : newStateValue
    });
    this.setState({
      borrowerControlledAccessList : list
    });
  }

  displayAccessList(){
    let that = this;
    if(this.state.borrowerControlledAccessList && this.state.borrowerControlledAccessList.length > 0){
      let lenderMap = cUtils.extractLenderNames(this.state.borrowerControlledAccessList);
      return lenderMap.map(function(row){
        return (
          <label key={row.id}>
          <Toggle 
            id = {row.id}
            onChange={that.onToggleSwitch.bind(that)}
            checked={row.accessToLender}/>
            <span className="indent">{row.name}</span>
          </label>
        );
      });
    } else {
      return(<div>
        <h3>No one other than you have access to your Data Room and Compliance data.</h3>
        </div>);
    }
  }

  render(){
    console.log('In render of borrowerControlledAccess');
    return(
      <div>
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >
            <br/>
            <br/>
            <p>Toggle the swtich to modify the acces to dataroom and other sensitive data to the lender</p>
            <br/>
            <br/>
            {this.displayAccessList()}
            <br/>
            <br/>
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
  console.log('state:'+JSON.stringify(state));

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
