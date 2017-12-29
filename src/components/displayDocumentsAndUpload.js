import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { getLinkDocsWithLinkIdAction, getLinkDocsWithRFPAndIOIAction, uploadDocumentRequest, getLinksWithCompanyIdAction, deleteLinkDocumentAction, downloadLinkDocumentAction } from '../actions/index';
import { Link } from "react-router-dom";
import validator from 'validator';
import lsUtils from '../utils/ls_utils';
import cUtils from '../utils/common_utils';
import constants from '../utils/constants';
import Header from './header';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import FileReaderInput from 'react-file-reader-input';
import * as actionCreators from '../actions/index';
import formatCurrency from 'format-currency';
import dateFormat from 'dateformat';
import moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';


class DisplayDocumentsAndUpload extends Component{
	constructor(props){
		super(props);
		// console.log('I am in constructor');
		this.state = {
			user : null,
			company : null,
			displayLinkId : null
		};
	}

	componentWillMount() {
		// console.log('I am in DisplayDocumentTabs.componentWillMount');
		let that = this;
		let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    	let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
		this.setState({
			user : user,
			company : company
		});
	}

	handleFileUpload(type, inputFiles) {
		// console.log('In handleFileUpload, type:'+type);
		// console.log('this.state:'+JSON.stringify(this.state));
		inputFiles.persist();
		var files = inputFiles.currentTarget.files;
		if(files && files.length > 0){
			let that = this;
		  let file = files[0];
		  this.props.uploadDocumentRequest({
		    file,
		    type	: type,
			ioiId 	: this.props.link.ioiId,
			rfpId 	: this.props.link.rfpId,
			linkId 	: this.props.link.linkId,
			uploadedCompanyId : this.state.user.companyId
		  }).then((data)=>{
			  	// console.log('file upload completed');
				that.props.getLinkDocsWithLinkIdAction(that.props.link.linkId);
				that.myFileInput=null;
			});
		} else {
			// console.log('no file to upload');
		}
	}

	downloadDocument(fileName){
		// console.log('I am in downloadDocument, fileName:'+fileName);
		// window.open(cUtils.getS3FileURL(fileName));
		this.props.downloadLinkDocumentAction(fileName)
		.then((data) => {
			// console.log('downloaded the docuemnt, now in then, data:'+JSON.stringify(data));
			window.open(data.payload.data.data);
		});
	}

	deleteDocument(linkDocId, fileName){
		// console.log('I am in deleteDocument, linkDocId:'+linkDocId);
		let that = this;
		// console.log('this.props.linkDocList:'+JSON.stringify(this.props.linkDocList));
		this.props.deleteLinkDocumentAction(linkDocId, fileName)
		.then((data) => {
			// console.log('deleted the docuemnt, now in then, data:'+JSON.stringify(data));
			// console.log('that.props.linkList:'+JSON.stringify(that.props.linkList));
			for(let i=0;i<this.props.linkDocList.length; i++){
				if(that.props.linkDocList[i].linkDocsId == linkDocId)
					that.props.linkDocList.splice(i,1);
			}
			that.forceUpdate()
		});
	}

	addDeleteIcon(item){
		// console.log('In addDeleteIcon');
		// console.log('item.uploadedCompanyId: '+item.uploadedCompanyId+', this.state.user.companyId:'+this.state.user.companyId);
		if(item.uploadedCompanyId === this.state.user.companyId){
			return(
				<span>
					<Link to="#" onClick={this.deleteDocument.bind(this,item.linkDocsId, cUtils.getS3Filename(item.url))}>
						<span className="glyphicon glyphicon-trash" aria-hidden="true" />
					</Link>
					&nbsp;&nbsp;
				</span>
			);
		}
	}

	renderDocumentItem(type){
		// console.log('In renderDocumentItem');
		var that = this;
		if(this.props.linkDocList && this.props.linkDocList.length > 0){
			let list = this.props.linkDocList.filter(linkDoc => linkDoc.type === type);
			if(list && list.length > 0){
				return list.map(function(item){
					// console.log('item:'+JSON.stringify(item));
					return(<tr key={item.linkDocsId}>
						<td>{item.originalFileName}</td>
						<td>{item.companyName}</td>
						<td>{dateFormat(moment(item.timestamp), 'longDate')}</td>
						<td>
							<Link to="#" onClick={that.downloadDocument.bind(that,cUtils.getS3Filename(item.url))}>
								<span className="glyphicon glyphicon-download-alt" aria-hidden="true" />
							</Link>&nbsp;&nbsp;
							{that.addDeleteIcon(item)}
						</td>
					</tr>);
				});
			} else {
				return(<tr>
					<td colSpan="3">No document uploaded</td>
				</tr>);
			}
		}
	}

	renderRFPAndDocuments(type){
		// console.log('I am in renderRFPAndDocuments');
		let that=this;
		let inputTagStyle= {
			'display':'inline'
		};

		return(<div>
			<table className="table table-bordered table-striped">
				<thead>
					<tr>
						<th>File name</th>
						<th>Company Name</th>
						<th>Date Modified</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody key={this.props.link.linkId+'__'+type}>
					{this.renderDocumentItem(type)}
					<tr>
						<td colSpan="4">
							<span>Select a document to upload </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<input
								id="fileInput"
								ref={(ref) => this.myFileInput = ref}
								style={inputTagStyle}
								type="file"
								onChange={that.handleFileUpload.bind(this, type)} />
						</td>
					</tr>
				</tbody>
			</table>
			<br/>
		</div>);
	}

	renderTabs(){
		// console.log('link :'+ JSON.stringify(this.props.link));
		// console.log('user:'+ JSON.stringify(this.state.user));
		return(
			<Tabs>
				<TabList>
					<Tab>
						Non-Disclosure Agreement(NDA)
					</Tab>
					<Tab disabled={!this.props.link.accessToLender[constants.KEY_ACCESS_CONTROL_DOCUMENTS]}>
						Transaction Overview
					</Tab>
					<Tab disabled={!this.props.link.accessToLender[constants.KEY_ACCESS_CONTROL_DOCUMENTS]}>
						Company
					</Tab>
					<Tab disabled={!this.props.link.accessToLender[constants.KEY_ACCESS_CONTROL_DOCUMENTS]}>
						Financial
					</Tab>
					<Tab disabled={!this.props.link.accessToLender[constants.KEY_ACCESS_CONTROL_DOCUMENTS]}>
						Legal
					</Tab>
					<Tab disabled={!this.props.link.accessToLender[constants.KEY_ACCESS_CONTROL_DOCUMENTS]}>
						Operations
					</Tab>
				</TabList>
				<TabPanel>
					{this.renderRFPAndDocuments('TXN_NDA')}
				</TabPanel>
				<TabPanel>
					{this.renderRFPAndDocuments('TXN_OVERVIEW')}
				</TabPanel>
				<TabPanel>
					{this.renderRFPAndDocuments('COMPANY')}
				</TabPanel>
				<TabPanel>
					{this.renderRFPAndDocuments('FINANCIAL')}
				</TabPanel>
				<TabPanel>
					{this.renderRFPAndDocuments('LEGAL')}
				</TabPanel>
				<TabPanel>
					{this.renderRFPAndDocuments('OPERATIONS')}
				</TabPanel>
			</Tabs>
		);
	}

	render(){
		// console.log('I am in renderLinkList');
		// let that = this;
		// console.log('this.props.link:'+JSON.stringify(this.props.link));
		return(<div>
				{this.renderTabs()}
			</div>);
	}

}

function mapStateToProps(state) {
	// console.log('In documents.mapStateToProps');
	// console.log('In mapStateToProps, state:'+JSON.stringify(state));
	let rObject={};

	if(state.link.linkDocList){
		rObject.linkDocList = state.link.linkDocList;
	}

	// console.log('rObject:'+JSON.stringify(rObject));
  return rObject;
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    uploadDocumentRequest   	: uploadDocumentRequest,
		getLinksWithCompanyIdAction : getLinksWithCompanyIdAction,
		deleteLinkDocumentAction	: deleteLinkDocumentAction,
		downloadLinkDocumentAction	: downloadLinkDocumentAction,
		getLinkDocsWithRFPAndIOIAction	: getLinkDocsWithRFPAndIOIAction,
		getLinkDocsWithLinkIdAction : getLinkDocsWithLinkIdAction
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(DisplayDocumentsAndUpload);
