import React, {Component} from 'react';
import {Field, reduxForm, initialize} from 'redux-form';
import { getLenderStatsForDashboard, getBorrowerStatsForDashboard } from '../actions/index';
import {Link} from 'react-router-dom';
import validator from 'validator';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import lsUtils from '../utils/ls_utils';
import cUtils from '../utils/common_utils';
import constants from '../utils/constants';
import NavBar from './sidebar';
import Header from './header';
import { ToastContainer, toast } from 'react-toastify';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';
import SvgIcon from 'react-icons-kit';
import { stack } from 'react-icons-kit/icomoon/stack';

const Icon20 = props => <SvgIcon size={100} icon={props.icon} />;

class Dashboard extends Component{
  constructor(props){
    super(props);
    this.state = {
      message : null,
      user : null,
      company : null
    };
  };

  componentWillMount(){
    let that = this;
    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);

    this.setState({
      user : user,
      company : company
    });

    if(user.role === constants.KEY_LENDER){
      this.props.getLenderStatsForDashboard(company.companyId, user.userId);
    } else if(user.role === constants.KEY_COMPANY 
      || user.role === constants.KEY_FINANCIAL_SPONSOR){
        this.props.getBorrowerStatsForDashboard(company.companyId, user.userId);
    }
  }

  displayRFPCard(){
    if(this.state.user.role === constants.KEY_LENDER){
      return (
        <div className="card" style={{width:25+'rem', margin : 'auto'}}>
          <h1 style={{textAlign : 'center'}}>{this.props.stats.COUNT_RFP}</h1>
          <div className="card-block">
            <h4 className="card-title">Request For Proposal</h4>
            <p className="card-text"># of RFP's in your favorite list.</p>
            <a style={{width: 100+'%', textAlign: 'center', margin : 'auto'}} href={constants.ROUTES_MAP.RFP_MARKETPLACE} className="btn btn-primary">Click to View</a>
          </div>
        </div>
      )
    } else if(this.state.user.role === constants.KEY_COMPANY 
      || this.state.user.role === constants.KEY_FINANCIAL_SPONSOR){
        return (
          <div className="card" style={{width:25+'rem', margin : 'auto'}}>
            <h1 style={{textAlign : 'center'}}>{this.props.stats.COUNT_RFP}</h1>
            <div className="card-block">
              <h4 className="card-title">Request For Proposal</h4>
              <p className="card-text">New or Active RFP's from your company.</p>
              <a style={{width: 100+'%', textAlign: 'center', margin : 'auto'}} href={constants.ROUTES_MAP.RFP_COMPANY_LIST+'/'+this.state.company.companyId} className="btn btn-primary">Click to View</a>
            </div>
          </div>
        )
    }
  }

  displayMessagesCard(){
    return (
      <div className="card" style={{width:25+'rem', margin : 'auto'}}>
        <h1 style={{textAlign : 'center'}}>{this.props.stats.COUNT_MESSAGES}</h1>
        <div className="card-block">
          <h4 className="card-title">Messages</h4>
          <p className="card-text"># of new messages for you.</p>
          <a style={{width: 100+'%', textAlign: 'center', margin : 'auto'}} href={constants.ROUTES_MAP.MESSAGES} className="btn btn-primary">Click to View</a>
        </div>
      </div>
    )
  }

  displayIOICard(){
    if(this.state.user.role === constants.KEY_LENDER){
      return (
        <div className="card" style={{width:25+'rem', margin : 'auto'}}>
          <h1 style={{textAlign : 'center'}}>{this.props.stats.COUNT_IOI}</h1>
          <div className="card-block">
            <h4 className="card-title">Indication of Interest</h4>
            <p className="card-text"># of open IOI's from your company against active RFP's in the market</p>
            <a style={{width: 100+'%', textAlign: 'center', margin : 'auto'}} href={constants.ROUTES_MAP.IOI_LIST+'/'+this.state.company.companyId} className="btn btn-primary">Click to View</a>
          </div>
        </div>
      )
    } else if(this.state.user.role === constants.KEY_COMPANY 
      || this.state.user.role === constants.KEY_FINANCIAL_SPONSOR){
        return (
          <div className="card" style={{width:25+'rem', margin : 'auto'}}>
            <h1 style={{textAlign : 'center'}}>{this.props.stats.COUNT_IOI}</h1>
            <div className="card-block">
              <h4 className="card-title">Indication of Interest</h4>
              <p className="card-text"># of IOI's you received against you active RFP's</p>
              <a style={{width: 100+'%', textAlign: 'center', margin : 'auto'}} href={constants.ROUTES_MAP.IOI_LIST+'/'+this.state.company.companyId} className="btn btn-primary">Click to View</a>
            </div>
          </div>
        )
    }
  }

  displayFinalTermCard(){
    if(this.state.user.role === constants.KEY_LENDER){
      return (
        <div className="card" style={{width:25+'rem', margin : 'auto'}}>
          <h1 style={{textAlign : 'center'}}>{this.props.stats.COUNT_FINAL_TERM_SHEET}</h1>
          <div className="card-block">
            <h4 className="card-title">Final Term sheets</h4>
            <p className="card-text"># of Final term sheets issued by your company to the active RFP's</p>
            <a style={{width: 100+'%', textAlign: 'center', margin : 'auto'}} href={constants.ROUTES_MAP.FINAL_TERM_LIST+'/'+this.state.company.companyId} className="btn btn-primary">Click to View</a>
          </div>
        </div>
      )
    } else if(this.state.user.role === constants.KEY_COMPANY 
      || this.state.user.role === constants.KEY_FINANCIAL_SPONSOR){
        return (
          <div className="card" style={{width:25+'rem', margin : 'auto'}}>
            <h1 style={{textAlign : 'center'}}>{this.props.stats.COUNT_FINAL_TERM_SHEET}</h1>
            <div className="card-block">
              <h4 className="card-title">Final Term sheets</h4>
              <p className="card-text"># of Final Term sheets you received for your active RFP's</p>
              <a style={{width: 100+'%', textAlign: 'center', margin : 'auto'}} href={constants.ROUTES_MAP.FINAL_TERM_LIST+'/'+this.state.company.companyId} className="btn btn-primary">Click to View</a>
            </div>
          </div>
        )
    }
  }  

  render = () => {
    return(
      <div>
        <ToastContainer />
        <Header/>
        <div style={{ display: 'flex' }}>
          {this.state.user ? <NavBar history={this.props.history}/> : ''}
          <div className="container main-container-left-padding" >
          <br/>
          <br/>
          <h3>Dashboard</h3>
          <br/>
          <p>A view all the activity related to your account. Use "Click to View" to jump into the section.</p>
          <br/>          
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>{this.displayRFPCard()}</td>
                <td>{this.displayMessagesCard()}</td>
              </tr>
              <tr>
                <td>{this.displayIOICard()}</td>
                <td>{this.displayFinalTermCard()}</td>
              </tr>                
            </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  if(state.dashboard.stats){
    return {
      stats : state.dashboard.stats
    }
  } else {
    return {
      stats : {
        COUNT_RFP : 0,
        COUNT_IOI : 0,
        COUNT_FINAL_TERM_SHEET : 0,
        COUNT_MESSAGES : 0
      }
    };
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getLenderStatsForDashboard : getLenderStatsForDashboard,
    getBorrowerStatsForDashboard : getBorrowerStatsForDashboard
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)