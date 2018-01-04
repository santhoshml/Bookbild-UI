import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { getLinkWithIOIAction, getLinkWithFinalTermAction, markDealAsExecutedAction, downloadLinkDocumentAction, deleteLinkDocumentAction, fetchLinkDocsWithFinalTermIdAction, uploadDocumentRequest, fetchFinalTermWithYieldMatrixAction } from '../actions/index';
import * as actionCreators from '../actions/index';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import cUtils from '../utils/common_utils';
import dateFormat from 'dateformat';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import NavBar from './sidebar';
import roundTo from 'round-to';
import Header from './header';
import JSAlert from "js-alert";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class FinalTermDetail extends Component{
  constructor(props){
    super(props);
    this.state = {
      user : null,
      company : null,
      displayExecuteButton : false
		}
  }

  componentWillMount() {
    // console.log('In componentWillMount of IOI_DETAIL');
    let paramId = this.props.match.params.id;
    let user    = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    this.setState({
      company : company,
      user    : user
    });

    this.props.fetchFinalTermWithYieldMatrixAction(paramId);
    this.props.fetchLinkDocsWithFinalTermIdAction(paramId);
    this.props.getLinkWithFinalTermAction(paramId);
  }

  componentWillReceiveProps(nextProps){
    // console.log('In componentWillReceiveProps');
    if(nextProps.link && nextProps.link.dealState !== 'IN_EXECUTION'){
      this.setState({
        displayExecuteButton : true
      });
    }
  }

  addStatus(){
    if(this.props.link.dealState){
      return(
        <tr>
          <td>Status</td>
          <td>{this.props.link.dealState}</td>
        </tr>
      );
    }
  }

  displayFinalTermSheet(){
    let finalTerm = this.props.finalTerm;
    // console.log('In displaySelectedIOI, ioi:'+JSON.stringify(ioi));
    return(
      <div>
        <table className="table table-striped table-bordered">
          <tbody>
            {this.addStatus()}
            <tr>
              <td>Loan Size</td>
              <td>{cUtils.formatCurrencyToDisplay(finalTerm.loanSize)}</td>
            </tr>
            <tr>
              <td>Maturity(yrs)</td>
              <td>{finalTerm.maturity}</td>
            </tr>
            <tr>
              <td>LIBOR Floor</td>
              <td>{cUtils.formatPercentToDisplay(finalTerm.liborFloor)}</td>
            </tr>
            <tr>
              <td>Upfront Fee</td>
              <td>{finalTerm.upfrontFee}</td>
            </tr>
            <tr>
              <td>PIK Interest</td>
              <td>{cUtils.formatPercentToDisplay(finalTerm.pikIntreset)}</td>
            </tr>
            <tr>
              <td>Cash Interest</td>
              <td>{finalTerm.cashInterest}</td>
            </tr>
            <tr>
              <td>Yield Estimate</td>
              <td><b>{cUtils.formatPercentToDisplay(finalTerm.yield)}</b></td>
            </tr>
            <tr>
              <td>Year 1</td>
              <td>{cUtils.formatPercentToDisplay(finalTerm.year1)}</td>
            </tr>
            <tr>
              <td>Year 2</td>
              <td>{cUtils.formatPercentToDisplay(finalTerm.year2)}</td>
            </tr>
            <tr>
              <td>Year 3</td>
              <td>{cUtils.formatPercentToDisplay(finalTerm.year3)}</td>
            </tr>
            <tr>
              <td>Year 4</td>
              <td>{cUtils.formatPercentToDisplay(finalTerm.year4)}</td>
            </tr>
            <tr>
              <td>Year 5</td>
              <td>{cUtils.formatPercentToDisplay(finalTerm.year5)}</td>
            </tr>            
            <tr>
              <td>Created by</td>
              <td>{finalTerm.createdByName}</td>
            </tr>
            <tr>
              <td>Created by Company</td>
              <td>{finalTerm.createdByCompanyName}</td>
            </tr>            
            <tr>
              <td>Last Updated on</td>
              <td>{dateFormat(moment(finalTerm.timestamp), 'longDate')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  displayViewAttachedRFPButton(){
      return( <span>
      <Link to={constants.ROUTES_MAP.RFP_DETAIL+"/"+this.props.finalTerm.rfpId} className="btn btn-primary">
        View Attached RFP
      </Link>
      &nbsp;&nbsp;&nbsp;
      </span>);
  }

  displayViewAttachedIOIButton(){
    return( <span>
    <Link to={constants.ROUTES_MAP.IOI_DETAIL+"/"+this.props.finalTerm.ioiId} className="btn btn-primary">
      View Attached IOI
    </Link>
    &nbsp;&nbsp;&nbsp;
    </span>);
}

  displayEditFinalTermButton(){
    if(this.state.company.companyId === this.props.finalTerm.createdByCompanyId){
      return( <span>
      <Link to={constants.ROUTES_MAP.CREATE_FINAL_TERM+"/"+constants.FINAL_TERM_EDIT+"/"+this.props.finalTerm.finalTermId} className="btn btn-primary">
        Edit Final Term Sheet
      </Link>
      &nbsp;&nbsp;&nbsp;
      </span>);
    }
  }

  displayYieldMatrix(){
    if(this.props.finalTerm.yieldMatrix){
      var yieldMatrixRender = this.props.finalTerm.yieldMatrix.map(function(row){
        // console.log('row:'+JSON.stringify(row));
        return(<tr key={row.period}>
            <td>{numeral(row.period).format('0,0.00')}</td>
            <td>{cUtils.formatCurrencyToDisplay(row.cashFlow)}</td>
            <td>{row.startDate}</td>
            <td>{cUtils.formatCurrencyToDisplay(row.amtAtBegin)}</td>
            <td>{cUtils.formatCurrencyToDisplay(row.amort)}</td>
            <td>{cUtils.formatCurrencyToDisplay(row.amtAtEnd)}</td>
            <td>{cUtils.formatCurrencyToDisplay(row.intrestPaymet)}</td>
            <td>{cUtils.formatCurrencyToDisplay(row.cashFlow)}</td>
          </tr>
        );
      });
      return(<div>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Period</th>
              <th>Cash Flows</th>
              <th>Date</th>
              <th>Outstanding Amount Beginning of Quarter</th>
              <th>Amortization</th>
              <th>Outstanding Amount Beginning of Period</th>
              <th>Interest Payment</th>
              <th>Cash Flow</th>
            </tr>
          </thead>
          <tbody>
            {yieldMatrixRender}
          </tbody>
        </table>
        </div>);
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
  
	handleFileUpload(inputFiles) {
		// console.log('In handleFileUpload, type:'+type);
		// console.log('this.state:'+JSON.stringify(this.state));
		inputFiles.persist();
		var files = inputFiles.currentTarget.files;
		if(files && files.length > 0){
			let that = this;
		  let file = files[0];
		  this.props.uploadDocumentRequest({
		    file,
		    type	: 'FINAL_TERM',
			ioiId 	: this.props.linkDocList[0].ioiId,
			rfpId 	: this.props.linkDocList[0].rfpId,
			linkId 	: this.props.linkDocList[0].linkId,
			uploadedCompanyId : this.state.user.companyId
		  }).then((data)=>{
			  	// console.log('file upload completed');
				that.props.fetchLinkDocsWithFinalTermIdAction(that.props.finalTerm.finalTermId);
				that.myFileInput=null;
			});
		} else {
			// console.log('no file to upload');
		}
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
    
	renderDocumentItem(){
		// console.log('In renderDocumentItem');
		var that = this;
		if(this.props.linkDocList && this.props.linkDocList.length > 0){
      let list = this.props.linkDocList;
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

	renderDocuments(){
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
				<tbody>
					{this.renderDocumentItem()}
					<tr>
						<td colSpan="4">
							<span>Select a document to upload </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<input
								id="fileInput"
								ref={(ref) => this.myFileInput = ref}
								style={inputTagStyle}
								type="file"
								onChange={that.handleFileUpload.bind(this)} />
						</td>
					</tr>
				</tbody>
			</table>
			<br/>
		</div>);
  }

  markDealAsExecuted(){
    let that = this;
    JSAlert.confirm("Are you sure you want to execute the deal ? "
    + " Make sure you upload the signed final term, before you click this."
    + " Also disable access to Data Room for any other lenders.")
    .then(function(result){
      if(!result){
        // console.log('user pressed cancel');
      } else {
        // console.log('Borrower is ready to execute the deal');
        let props = {
          linkId                : that.props.link.linkId,
          dealState             : 'IN_EXECUTION',
          executedStateSetById  : that.state.user.userId
        };
        that.props.markDealAsExecutedAction(props)
        .then(()=>{
          that.setState({
            displayExecuteButton : false
          });
        });
      }
    });
  }

  displayExecuteDealButton(){
    if((this.state.user.role === constants.KEY_COMPANY 
      || this.state.user.role === constants.KEY_FINANCIAL_SPONSOR)
      && this.state.company.companyId === this.props.finalTerm.forCompanyId
      && this.state.displayExecuteButton){
      return(<span>
        <Link to="#" onClick={this.markDealAsExecuted.bind(this)} className="btn btn-primary">
          Execute Deal
        </Link>
        &nbsp;&nbsp;&nbsp;
        </span>);
    }
  }
    
  render(){
    // console.log('I am in final term sheet detail render');
    return(
      <div>
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >
            <br/>
            <h2>Final Term Sheet</h2>
            <br/>
            <Tabs>
              <TabList>
                <Tab>Final Term Sheet Details</Tab>
                <Tab>Final Term Sheet Yield Estimate</Tab>
                <Tab>Final Term Sheet Documents</Tab>
              </TabList>
              <TabPanel>
                {this.props.finalTerm ? this.displayFinalTermSheet() : ''}
              </TabPanel>
              <TabPanel>
                {this.props.finalTerm ? this.displayYieldMatrix() : ''}
              </TabPanel>
              <TabPanel>
                {this.props.finalTerm ? this.renderDocuments() : ''}
              </TabPanel>
            </Tabs>
            {this.props.finalTerm ? this.displayViewAttachedRFPButton() : ''}
            {this.props.finalTerm ? this.displayViewAttachedIOIButton() : ''}
            {this.props.finalTerm ? this.displayEditFinalTermButton() : ''}
            {this.props.finalTerm ? this.displayExecuteDealButton() : ''}
            <br/>
            <br/>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let rObject = {};
  if(state.finalTerm.finalTerm){
    rObject.finalTerm = state.finalTerm.finalTerm[0];
  }

  if(state.link.linkDocList){
    rObject.linkDocList = state.link.linkDocList;
  }

  if(state.link.linkList){
    // console.log('IN finalTermDetail mapStateToProps, state.link.linkList :'+JSON.stringify(state.link.linkList));
    rObject.link = state.link.linkList[0];
  }

  return rObject;
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    fetchFinalTermWithYieldMatrixAction  : fetchFinalTermWithYieldMatrixAction,
    uploadDocumentRequest : uploadDocumentRequest,
    fetchLinkDocsWithFinalTermIdAction : fetchLinkDocsWithFinalTermIdAction,
    deleteLinkDocumentAction : deleteLinkDocumentAction,
    downloadLinkDocumentAction : downloadLinkDocumentAction,
    markDealAsExecutedAction : markDealAsExecutedAction,
    getLinkWithFinalTermAction : getLinkWithFinalTermAction,
    getLinkWithIOIAction : getLinkWithIOIAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FinalTermDetail);
