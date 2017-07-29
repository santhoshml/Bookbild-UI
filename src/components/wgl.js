import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { getWGLByCompanyIdAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import cUtils from '../utils/common_utils';
import Header from './header';

class WGL extends Component{
  constructor(props){
    super(props);
    this.state = {
			rfp : null,
      user : null,
      company : null
		}
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
      console.log('got response for getWGLByCompanyIdAction, data:'+JSON.stringify(data));
    });
  }

  displayWGL(){
    if(this.props.wgl){
      return(
        <div>
        {this.props.wgl.map(wgl => {
          return (
            <span>
              <h3>{wgl.name}</h3>
            </span>
          );
        })}
        </div>
      );
    }
  }

  render(){
    console.log('I am in wgl render');
    return(
      <div>
        <Header />
        {this.displayWGL()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  // Whatever is returned will show up as props
  console.log('In wgl state:'+JSON.stringify(state));

  let rObject = {
    wgl : state.wgl.wgl
  };
  return rObject;
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    getWGLByCompanyIdAction : getWGLByCompanyIdAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WGL);
