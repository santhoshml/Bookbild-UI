import React, {Component, PropTypes} from 'react';
import { registerCompanyAction } from '../actions/index';
import {Link} from 'react-router';
import validator from 'validator';

import * as actionCreators from '../actions/index';

exports default class MyProfile extends Component{
	static contextTypes ={
	    router : PropTypes.object
	};

  componentWillMount() {
    
  }

	render(){
		return (
      <div>

      </div>
    );
	}
}
