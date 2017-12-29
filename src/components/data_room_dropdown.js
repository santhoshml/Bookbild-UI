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
		// console.log('In displayDropdownList');
		let options=[];
		// console.log('In displayDropdownList, this.props.linkList:'+JSON.stringify(this.props.linkList));
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
		// console.log('I am in documents.render');
		return (
			<div>
				{this.displayDropdownList()}
			</div>
		    );
	}
}

function mapStateToProps(state) {
	// console.log('In documents.mapStateToProps');
	let rObject={};
  return rObject;
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({

  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(DataRoomDropdown);
