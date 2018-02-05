import React, {Component} from 'react';
import {getLinksWithCompanyIdAction} from '../actions/index';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import NavBar from './sidebar';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/index';
import DisplayDocumentTabs from './displayDocumentTabs';
import Header from './header';
import Dropdown from 'react-dropdown';

class DataRoomDropdown extends Component{
	constructor(props){
		super(props);
	}

	displayDropdownList(){
		let options=[];
		this.props.linkList && this.props.linkList.forEach(link => {
			options.push({
				value : link.linkId,
				label : link.name
			});
		});

		return(<div>
			<Dropdown options={options} onChange={this.props.onChange} value={this.props.selectedDropDown} placeholder="Select an option" />
		</div>);
	}

	render(){
		return (
			<div>
				{this.displayDropdownList()}
			</div>
		    );
	}
}

function mapStateToProps(state) {
	let rObject={};
  return rObject;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({

  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(DataRoomDropdown);
