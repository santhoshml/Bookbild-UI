import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { getLinkDocsWithRFPAndIOIAction, uploadDocumentRequest, getLinksWithCompanyIdAction, deleteLinkDocumentAction, downloadLinkDocumentAction } from '../actions/index';
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


class DisplayDocumentTabs extends Component{
	constructor(props){
		super(props);
		console.log('I am in constructor');
		this.state = {
			user : null,
			company : null,
			displayLinkId : null,
			displayRfpId : null
		};
	}

	componentWillMount() {
		console.log('I am in DisplayDocumentTabs.componentWillMount');
		let that = this;
		let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    	let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
		this.setState({
			user : user,
			company : company
		});
		if(this.props.linkList && this.props.linkList.length > 0){
			// console.log('this.props.linkList:'+JSON.stringify(this.props.linkList));
			let firstRFPId = this.props.linkList[0].rfpId;
			let firstIOIId = this.props.linkList[0].ioiId;
			that.props.getLinkDocsWithRFPAndIOIAction(firstRFPId, firstIOIId);
			that.setState({
				displayLinkId : this.props.linkList[0].linkId,
				displayRfpId : this.props.linkList[0].rfpId
			});
		}
	}

	handleFileUpload(type, rfpId, ioiId, linkId, inputFiles) {
		// console.log('In handleFileUpload, type:'+type+', rfpId:'+rfpId+', ioiId:'+ioiId+', linkId:'+linkId);
		// console.log('this.state:'+JSON.stringify(this.state));
		inputFiles.persist();
		var files = inputFiles.currentTarget.files;
		if(files && files.length > 0){
			let that = this;
		  let file = files[0];
		  this.props.uploadDocumentRequest({
		     file,
		     type 	: type,
				 ioiId : ioiId,
				 rfpId : rfpId,
				 linkId : linkId,
				 uploadedCompanyId : this.state.user.companyId
		  })
			.then((data)=>{
				that.props.getLinkDocsWithRFPAndIOIAction(rfpId, ioiId);
				that.myFileInput=null;
			});
		} else {
			console.log('no file to upload');
		}
	}

	downloadDocument(fileName){
		console.log('I am in downloadDocument, fileName:'+fileName);
		// window.open(cUtils.getS3FileURL(fileName));
		this.props.downloadLinkDocumentAction(fileName)
		.then((data) => {
			// console.log('downloaded the docuemnt, now in then, data:'+JSON.stringify(data));
			window.open(data.payload.data.data);
		});
	}

	deleteDocument(linkDocId, fileName){
		console.log('I am in deleteDocument, linkDocId:'+linkDocId);
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
		console.log('In addDeleteIcon');
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

	renderDocumentItem(type, link){
		// console.log('In renderDocumentItem');
		var that = this;
		// console.log('this.props.linkList:'+JSON.stringify(this.props.linkList));
		if(this.props.linkDocList && this.props.linkDocList.length > 0){
			let list = this.props.linkDocList.filter(linkDoc => linkDoc.type === type && linkDoc.rfpId === link.rfpId);
			if(list && list.length > 0){
				return list.map(function(item){
					// console.log('item:'+JSON.stringify(item));
					return(<tr key={item.linkDocsId}>
						<td>{item.originalFileName}</td>
						<td>{item.companyName}</td>
						<td>{dateFormat(moment(item.timestamp), 'longDate')}</td>
						<td>
							{that.addDeleteIcon(item)}
							<Link to="#" onClick={that.downloadDocument.bind(that,cUtils.getS3Filename(item.url))}>
								<span className="glyphicon glyphicon-download-alt" aria-hidden="true" />
							</Link>&nbsp;&nbsp;
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

	renderRFPAndDocuments(link, type){
		// console.log('I am in renderRFPAndDocuments');
		let that=this;
		let inputTagStyle= {
			'display':'inline'
		};

		// <h5>
		// 	<span className="glyphicon glyphicon-file"/>&nbsp;&nbsp;<b>{constants.DOCS_CATEGORY_DISPLAY_NAME_MAP[type]}</b>
		// </h5>
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
				<tbody key={link.linkId+'__'+type}>
					{this.state.displayRfpId === link.rfpId ? this.renderDocumentItem(type, link) : ''}
					<tr>
						<td colSpan="4">
							<span>Select a document to upload </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<input
								id="fileInput"
								ref={(ref) => this.myFileInput = ref}
								style={inputTagStyle}
								type="file"
								onChange={that.handleFileUpload.bind(this, type, link.rfpId, link.ioiId, link.linkId)} />
						</td>
					</tr>
				</tbody>
			</table>
			<br/>
		</div>);
	}

	updateDisplayFlag(linkId, rfpId){
		console.log('In updateDisplayFlag, linkId:'+linkId);
		this.props.getLinkDocsWithRFPAndIOIAction(rfpId, linkId);
		this.setState({
			displayLinkId : linkId,
			displayRfpId	: rfpId
		});
	}

	displaySubtitle(link){
		console.log('In displaySubtitle');
		// console.log('link:'+JSON.stringify(link));
		if(this.props.type === constants.KEY_COMPANY){
			return(
				<h4>{formatCurrency(link.dealSize, constants.CURRENCY_OPTS)+'-'+link.category+'-'+link.requestType}</h4>
			);
		} else {
			return(
				<h4>{link.name}</h4>
			);
		}
	}

	renderTabs(link){
		// console.log('link :'+ JSON.stringify(link));
		// console.log('user:'+ JSON.stringify(this.state.user));
		return(
			<Tabs>
				<TabList>
					<Tab>Non-Disclosure Agreement(NDA)</Tab>
					<Tab disabled={!link.accessToLender && (this.state.user.role !== constants.KEY_COMPANY)}>Transaction Overview</Tab>
					<Tab disabled={!link.accessToLender && (this.state.user.role !== constants.KEY_COMPANY)}>Company</Tab>
					<Tab disabled={!link.accessToLender && (this.state.user.role !== constants.KEY_COMPANY)}>Financial</Tab>
					<Tab disabled={!link.accessToLender && (this.state.user.role !== constants.KEY_COMPANY)}>Legal</Tab>
					<Tab disabled={!link.accessToLender && (this.state.user.role !== constants.KEY_COMPANY)}>Operations</Tab>
				</TabList>
				<TabPanel>
					{this.renderRFPAndDocuments(link, 'TXN_NDA')}
				</TabPanel>
				<TabPanel>
					{this.renderRFPAndDocuments(link, 'TXN_OVERVIEW')}
				</TabPanel>
				<TabPanel>
					{this.renderRFPAndDocuments(link, 'COMPANY')}
				</TabPanel>
				<TabPanel>
					{this.renderRFPAndDocuments(link, 'FINANCIAL')}
				</TabPanel>
				<TabPanel>
					{this.renderRFPAndDocuments(link, 'LEGAL')}
				</TabPanel>
				<TabPanel>
					{this.renderRFPAndDocuments(link, 'OPERATIONS')}
				</TabPanel>
			</Tabs>
		);
	}

	render(){
		console.log('I am in renderLinkList');
		let that = this;
		return(<ul className="folder-open">
			{this.props.linkList && this.props.linkList.map(function(link){
				// console.log('key :'+link.linkId);
				return (<li key={link.linkId ? link.linkId : link.rfpId}>
					<Link to="#" onClick={that.updateDisplayFlag.bind(that, link.linkId, link.rfpId)}>
						{that.displaySubtitle(link)}
					</Link>
						{((link.rfpId === that.state.displayRfpId && !link.linkId) || (link.linkId === that.state.displayLinkId && link.rfpId === that.state.displayRfpId)) ? that.renderTabs(link) : ''}
					<br/>
					<br/>
				</li>
				);
			})}
			<br/>
			<br/>
			</ul>
		);
	}

}

function mapStateToProps(state) {
	console.log('In documents.mapStateToProps');
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
		getLinkDocsWithRFPAndIOIAction	: getLinkDocsWithRFPAndIOIAction
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(DisplayDocumentTabs);
