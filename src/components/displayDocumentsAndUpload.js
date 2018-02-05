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
		this.state = {
			user : null,
			company : null,
			displayLinkId : null
		};
	}

	componentWillMount() {
		let that = this;
		let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    	let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
		this.setState({
			user : user,
			company : company
		});
	}

	handleFileUpload(type, inputFiles) {
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
				that.props.getLinkDocsWithLinkIdAction(that.props.link.linkId);
				that.myFileInput=null;
			});
		}
	}

	downloadDocument(fileName){
		this.props.downloadLinkDocumentAction(fileName)
		.then((data) => {
			window.open(data.payload.data.data);
		});
	}

	deleteDocument(linkDocId, fileName){
		let that = this;
		this.props.deleteLinkDocumentAction(linkDocId, fileName)
		.then((data) => {
			for(let i=0;i<this.props.linkDocList.length; i++){
				if(that.props.linkDocList[i].linkDocsId == linkDocId)
					that.props.linkDocList.splice(i,1);
			}
			that.forceUpdate()
		});
	}

	addDeleteIcon(item){
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
		var that = this;
		if(this.props.linkDocList && this.props.linkDocList.length > 0){
			let list = this.props.linkDocList.filter(linkDoc => linkDoc.type === type);
			if(list && list.length > 0){
				return list.map(function(item){
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
		return(<div>
				{this.renderTabs()}
			</div>);
	}

}

function mapStateToProps(state) {
	let rObject={};

	if(state.link.linkDocList){
		rObject.linkDocList = state.link.linkDocList;
	}

  return rObject;
}

function mapDispatchToProps(dispatch) {
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
