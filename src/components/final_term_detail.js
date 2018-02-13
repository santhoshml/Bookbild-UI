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
import numeral from "numeral";

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

  displayMaturityElement(ft, isParent){
    if(!isParent){
      return(<tr><td>Maturity (yrs)</td><td>{ft.maturity}</td></tr>);
    }
  }

  displayCashInterestElement(ft, isParent){
    if(!isParent){
      return(<tr><td>Cash Interest</td><td>{cUtils.formatPercentToDisplay(ft.cashInterest)}</td></tr>);
    }
  }

  displayPIKInterestElement(ft, isParent){
    if(!isParent){
      return(<tr><td>PIK Interest</td><td>{cUtils.formatPercentToDisplay(ft.pikIntreset)}</td></tr>);
    }
  }

  displayLIBORFloorElement(ft, isParent){
    if(!isParent){
      return(<tr><td>LIBOR Floor</td><td>{cUtils.formatPercentToDisplay(ft.liborFloor)}</td></tr>);
    }
  }

  displayUpfrontFeeElement(ft, isParent){
    if(!isParent){
      return(<tr><td>Upfront Fee</td><td>{cUtils.formatPercentToDisplay(ft.upfrontFee)}</td></tr>);
    }
  }

  displayAmortizationElement(ft, isParent){
    if(!isParent){
      return(<tr><td>Amortization</td><td></td></tr>);
    }
  }

  displayYear1Element(ft, isParent){
    if(!isParent){
      return(<tr><td>&emsp;&emsp;&emsp;&emsp;&emsp;Year 1</td><td>{cUtils.formatPercentToDisplay(ft.year1)}</td></tr>);
    }
  }

  displayYear2Element(ft, isParent){
    if(!isParent){
      return(<tr><td>&emsp;&emsp;&emsp;&emsp;&emsp;Year 2</td><td>{cUtils.formatPercentToDisplay(ft.year2)}</td></tr>);
    }
  }
  
  displayYear3Element(ft, isParent){
    if(!isParent){
      return(<tr><td>&emsp;&emsp;&emsp;&emsp;&emsp;Year 3</td><td>{cUtils.formatPercentToDisplay(ft.year3)}</td></tr>);
    }
  }

  displayYear4Element(ft, isParent){
    if(!isParent){
      return(<tr><td>&emsp;&emsp;&emsp;&emsp;&emsp;Year 4</td><td>{cUtils.formatPercentToDisplay(ft.year4)}</td></tr>);
    }
  }

  displayYear5Element(ft, isParent){
    if(!isParent){
      return(<tr><td>&emsp;&emsp;&emsp;&emsp;&emsp;Year 5</td><td>{cUtils.formatPercentToDisplay(ft.year5)}</td></tr>);
    }
  }

  displayTotalLeverageElement(ft, isParent){
    if(!isParent){
      return(<tr><td>Total Leverage</td><td>{ft.totalLeverage+'x'}</td></tr>);
    }
  }

  displayInterestCoverageElement(ft, isParent){
    if(!isParent){
      return(<tr><td>Interest Coverage</td><td>{ft.interestCoverage+'x'}</td></tr>);
    }
  }

  displayFixedChargeCoverageElement(ft, isParent){
    if(!isParent){
      return(<tr><td>Fixed Charge Coverage</td><td>{ft.fixedChargeCoverage+'x'}</td></tr>);
    }
  }

  displayFinalTermSheet(finalTerm, isParent){
    // let finalTerm = this.props.finalTerm;
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
              <td>Loan Structure</td>
              <td>{finalTerm.loanStructure}</td>
            </tr>            
            {this.displayMaturityElement(finalTerm, isParent)}
            {this.displayCashInterestElement(finalTerm, isParent)}
            {this.displayPIKInterestElement(finalTerm, isParent)}
            {this.displayLIBORFloorElement(finalTerm, isParent)}
            {this.displayUpfrontFeeElement(finalTerm, isParent)}
            {this.displayTotalLeverageElement(finalTerm, isParent)}
            {this.displayInterestCoverageElement(finalTerm, isParent)}
            {this.displayFixedChargeCoverageElement(finalTerm, isParent)}
            {this.displayAmortizationElement(finalTerm, isParent)}
            {this.displayYear1Element(finalTerm, isParent)}
            {this.displayYear2Element(finalTerm, isParent)}
            {this.displayYear3Element(finalTerm, isParent)}
            {this.displayYear4Element(finalTerm, isParent)}
            {this.displayYear5Element(finalTerm, isParent)}
            <tr>
              <td>Yield Estimate</td>
              <td><b>{cUtils.formatPercentToDisplay(finalTerm.yield)}</b></td>
            </tr>
            <tr>
              <td>Created by Company</td>
              <td>{finalTerm.createdByCompanyName}</td>
            </tr>
            <tr>
              <td>Created by</td>
              <td>{finalTerm.createdByName}</td>
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
    if(this.state.company.companyId === this.props.finalTerm.createdByCompanyId
      && this.props.link.dealState !== 'IN_EXECUTION'){
      return( <span>
      <Link to={constants.ROUTES_MAP.EDIT_FINAL_TERM+"/"+this.props.finalTerm.finalTermId} className="btn btn-primary">
        Edit Final Term Sheet
      </Link>
      &nbsp;&nbsp;&nbsp;
      </span>);
    }
  }

  displayYieldMatrix(yieldMatrix){
    // if(this.props.finalTerm.yieldMatrix){
      var yieldMatrixRender = yieldMatrix && yieldMatrix.map(function(row){
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
    // }
  }

  downloadDocument(fileName){
		this.props.downloadLinkDocumentAction(fileName)
		.then((data) => {
			window.open(data.payload.data.data);
		});
  }
  
	handleFileUpload(inputFiles) {
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
				that.props.fetchLinkDocsWithFinalTermIdAction(that.props.finalTerm.finalTermId);
				that.myFileInput=null;
			});
		}
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
    
	renderDocumentItem(){
		var that = this;
		if(this.props.linkDocList && this.props.linkDocList.length > 0){
      let list = this.props.linkDocList;
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

	renderDocuments(){
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
      } else {
        let props = {
          linkId                : that.props.link.linkId,
          dealState             : 'IN_EXECUTION',
          executedStateSetById  : that.state.user.userId,
          lenderCompanyId       : that.props.link.lenderCompanyId,
          borrowerCompanyId     : that.props.link.borrowerCompanyId
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

  displayTabListForFT(){
    return(
      <TabList>
        <Tab>Final Term Sheet Details</Tab>
        <Tab>Final Term Sheet Yield Estimate</Tab>
        <Tab>Final Term Sheet Documents</Tab>
      </TabList>
    );    
  }

  displayTabListWithChildFT(){
    return(
      <TabList>
        <Tab>Final Term Details</Tab>
        <Tab>Final Term Docs</Tab>
        <Tab>Tranche 1 Details</Tab>
        <Tab>Tranche 1 Yield Estimate</Tab>
        <Tab>Tranche 2 Details</Tab>
        <Tab>Tranche 2 Yield Estimate</Tab>
      </TabList>
    );
  }

  displayTabPanelForFT(){
    return(
      <span>
        <TabPanel>
          {this.props.finalTerm ? this.displayFinalTermSheet(this.props.finalTerm, false) : ''}
        </TabPanel>
        <TabPanel>
          {this.props.finalTerm ? this.displayYieldMatrix(this.props.finalTerm.yieldMatrix) : ''}
        </TabPanel>
        <TabPanel>
          {this.props.finalTerm ? this.renderDocuments() : ''}
        </TabPanel>
      </span>
    );
  }

  displayTabPanelWithChildFT(){
    return(
      <span>
        <TabPanel>
          {this.props.finalTerm ? this.displayFinalTermSheet(this.props.finalTerm, true) : ''}
        </TabPanel>
        <TabPanel>
          {this.props.finalTerm ? this.renderDocuments() : ''}
        </TabPanel>
        <TabPanel>
          {this.props.finalTerm ? this.displayFinalTermSheet(this.props.childFTList[0], false) : ''}
        </TabPanel>
        <TabPanel>
          {this.props.finalTerm ? this.displayYieldMatrix(this.props.childFTList[0].yieldMatrix) : ''}
        </TabPanel>
        <TabPanel>
          {this.props.finalTerm ? this.displayFinalTermSheet(this.props.childFTList[1], false) : ''}
        </TabPanel>
        <TabPanel>
          {this.props.finalTerm ? this.displayYieldMatrix(this.props.childFTList[1].yieldMatrix) : ''}
        </TabPanel>
      </span>
    );
  }

  render(){
    return(
      <div>
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >            
            <br/>
            <h2>Final Term Sheet</h2>
            <br/>
            <p> Details of the final Term sheet are as below. Navigate thru the tabs to find the yield estimate for this term sheet and the documents uplaoded for the same.</p>
            <br/>
            <Tabs>
              {this.props.finalTerm && this.props.finalTerm.childFTList ? this.displayTabListWithChildFT() : this.displayTabListForFT()}
              {this.props.finalTerm && this.props.finalTerm.childFTList ? this.displayTabPanelWithChildFT() : this.displayTabPanelForFT()}
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
  let rObject = {
    childFTList : []
  };
  
  if(state.finalTerm.finalTerm){
    if(Array.isArray(state.finalTerm.finalTerm)){
      rObject.finalTerm = state.finalTerm.finalTerm[0];

      if(state.finalTerm.finalTerm[1])
        rObject.childFTList.push(state.finalTerm.finalTerm[1]);
    
      if(state.finalTerm.finalTerm[2])
        rObject.childFTList.push(state.finalTerm.finalTerm[2]);
    } else {
      rObject.finalTerm = state.finalTerm.finalTerm;
    }
  }

  if(state.link.linkDocList){
    rObject.linkDocList = state.link.linkDocList;
  }

  if(state.link.linkList){
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
