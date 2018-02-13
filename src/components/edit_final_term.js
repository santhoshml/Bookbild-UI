import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { fetchFinalTerm
  , getRFPWithFinalTermAction
  , getIOIWithFinalTermAction
  , getLinkWithFinalTermAction
  , downloadLinkDocumentAction
  , updateFinalTermAction
  , uploadDocumentRequest
  , deleteLinkDocumentAction
  , deleteFTAction
  , getLinkDocsWithLinkIdAndTypeAction
  , fetchLinkDocsWithFinalTermIdAction
  , createFinalTermAction
  , sendAMsgFromAdminWithCompanyId } from '../actions/index';
import {Link} from 'react-router-dom';
import validator from 'validator';
import { bindActionCreators } from 'redux';
import lsUtils from '../utils/ls_utils';
import constants from '../utils/constants';
import cUtils from '../utils/common_utils';
import NavBar from './sidebar';
import NumberFormat from 'react-number-format';
import Select from 'react-select';
import Header from './header';
import { connect } from "react-redux";
import JSAlert from "js-alert";
import dateFormat from 'dateformat';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const loanStructOptions= ['ABL-Revolver', 'ABL-Term Loan', 'ABL-Both', 'CashFlow-Revolver', 'CashFlow-Term Loan', 'CashFlow-Both', '2nd Lien Term Loan', 'Sub Debt', 'Mezzanine'];
class EditFinalTermForm extends Component{

  constructor(props){
    super(props);
    this.state = {
      user : null,
      rfp : null,
      type : props.match.params.type,
      link : null
    };
  }

  renderDropdownField(field) {
    const { meta: { touched, error } } = field;
    const { size } = field;
    const className = `form-group ${size} ${touched && error ? "has-danger" : ""}`;

    return (
      <span className={className}>
        <label>{field.label}</label>
        <select className="form-control" {...field.input}>
          <option value="">Select one</option>
          {field.dpField.map(fOption =>
            <option value={fOption} key={fOption}>
              {fOption}
            </option>
          )}
        </select>
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </span>
    );
  }

  renderField(field) {
		const { meta: { touched, error } } = field;
		const { size } = field;
		const className = `form-group ${size} ${touched && error ? "has-danger" : ""}`;
		return (
			<span className={className}>
				<label>{field.label}</label>
				<input
					className="form-control"
					placeholder={field.placeholder}
					type={field.type}
					{...field.input} />
				<div className="text-help">
					{touched ? error : ""}
				</div>
			</span>
		);
	}

  componentWillMount() {
    let that = this;
    let paramId = this.props.match.params.id;

    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);

    // this.props.getIOIWithFinalTermAction(paramId);
    this.props.getLinkWithFinalTermAction(paramId);
    this.props.getRFPWithFinalTermAction(paramId);
    this.props.fetchLinkDocsWithFinalTermIdAction(paramId);
    this.props.fetchFinalTerm(paramId)
    .then(data => {
      if(data.payload.status === 200 && data.payload.data.status === 'SUCCESS'){
        let ftList = data.payload.data.data.Items;
        if(Array.isArray(ftList) && ftList.length > 1){
          that.setState({
            displayTwoLoanStructures : true
          });
        }
      }
    });
    
    this.setState({
      company             : company,
      user                : user,
      displayTwoLoanStructures : false
    });
  }

  onSubmit(props){
    let that = this;

    props.lastEditedById = this.state.user.userId;
    props.finalTermId = this.props.finalTerm.finalTermId;
    props.rfpId = this.props.rfp.rfpId;
    props.createdById = this.props.finalTerm.createdById;
    props.createdByCompanyId = this.state.company.companyId;
    props.ioiId = this.props.finalTerm.ioiId;
    props.forCompanyId = this.props.rfp.createdByCompanyId;
    props.createdByContactId = this.state.user.contactId;
    
    if(this.state.displayTwoLoanStructures){
      // copy props into 2 diffrent datastructures
      let props_1 = {}, props_2 = {};
      let keys = Object.keys(props);
      for(let i=0; i<keys.length; i++){        
        if(keys[i].indexOf("_1") >= 0){
          let eKey = keys[i].substr(0, keys[i].length-2);
          props_1[eKey] = props[keys[i]];
          delete props[keys[i]];
        } else if(keys[i].indexOf("_2") >= 0){
          let eKey = keys[i].substr(0, keys[i].length-2);
          props_2[eKey] = props[keys[i]];
          delete props[keys[i]];
        }
      }
      // populate Id's
      props_1.lastEditedById = this.state.user.userId;
      props_1.rfpId = this.props.rfp.rfpId;
      props_1.createdById = this.props.finalTerm.createdById;
      props_1.createdByCompanyId = this.state.company.companyId;
      props_1.ioiId = this.props.finalTerm.ioiId;
      props_1.forCompanyId = this.props.rfp.createdByCompanyId;
      props_1.createdByContactId = this.state.user.contactId;

      props_2.lastEditedById = this.state.user.userId;
      props_2.rfpId = this.props.rfp.rfpId;
      props_2.createdById = this.props.finalTerm.createdById;
      props_2.createdByCompanyId = this.state.company.companyId;
      props_2.ioiId = this.props.finalTerm.ioiId;
      props_2.forCompanyId = this.props.rfp.createdByCompanyId;
      props_2.createdByContactId = this.state.user.contactId;

      props.childFTList = [props_1, props_2];
    } else {
      let keys = Object.keys(props);      
      for(let key of keys){
        if(key.indexOf("_1") >= 0){
          let eKey = key.substr(0, key.length-2);
          if(eKey !== 'loanStructure'){ // this is an exception
            props[eKey] = props[key];
          }
          delete props[key];
        }
      }
    }

    let updateDBData = false;
    // find if any fields changed and then set the flags
    if(this.state.displayTwoLoanStructures){

      if(this.isValuesUpdated(props.childFTList[0], "_1")){
        props.childFTList[0].updateData = true;
        updateDBData = true;
      } else {
        props.childFTList[0].updateData = false;
      }

      if(this.isValuesUpdated(props.childFTList[1], "_2")){
        props.childFTList[1].updateData = true;
        updateDBData = true;
      } else {
        props.childFTList[1].updateData = false;
      }

      if(props.loanStructure !== this.props.initialValues.loanStructure
        || updateDBData){
        props.updateData = true;
        updateDBData = true;
      }
    } else {
      // there is only 1 IOI, so just check the main props
      if(this.isValuesUpdated(props, "_1")
        || props.loanStructure !== this.props.initialValues.loanStructure){
        props.updateData = true;
        updateDBData = true;
      } else {
        props.updateData = false;
      }      
    }

    if(updateDBData){
      if(this.props.finalTerm.childFTList && !props.childFTList){
        // initially there were 2 FT's, now has only 1 FT
        // delete the first one and create a new one
        this.props.deleteFTAction(this.props.finalTerm.finalTermId);
        this.props.deleteFTAction(this.props.finalTerm.childFTList[0]);
        this.props.deleteFTAction(this.props.finalTerm.childFTList[1]);
        // use the id of the parent FT which got deleted, since it may have links to other things
        props.finaltermId=this.props.finalTerm.finaltermId;
        this.props.createFinalTermAction(props)
        .then(data => that.sendMsgsAndRedirect(data
            , that.props.finalTerm.finalTermId
            , that.state.user.companyId
            , that.props.rfp.createdByCompanyId)
        );
      } else if(!this.props.finalTerm.childFTList && props.childFTList){
        // initially there was 1 FT, now has 2 FT's
        // delete the first one and create 3 new one's
        this.props.deleteFTAction(this.props.finalTerm.finalTermId);
        // use the id of the parent FT which got deleted, since it may have links to other things
        props.finalTermId=this.props.finalTerm.finalTermId;
        this.props.createFinalTermAction(props)
        .then(data => that.sendMsgsAndRedirect(data
          , that.props.finalTerm.finalTermId
          , that.state.user.companyId
          , that.props.rfp.createdByCompanyId)
        );
      } else {
        // initially there were 2 and now we have 2        
        this.props.updateFinalTermAction(props)
        .then(data => that.sendMsgsAndRedirect(data
          , that.props.finalTerm.finalTermId
          , that.state.user.companyId
          , that.props.rfp.createdByCompanyId)
        );
      }
    } else {
      that.props.history.push({
        pathname : constants.ROUTES_MAP.RFP_MARKETPLACE,
        state : constants.NOTIFICATIONS.EDIT_IOI_SUCCESS
      });
    }
	}

  sendMsgsAndRedirect(data, ftId, lCompanyId, bCompanyId){
    if(data.payload.status === 200 && data.payload.data.status === 'SUCCESS'){
      // send a msg to lender's company
      let lProps = {
        companyId : lCompanyId,
        msg : constants.MESSAGES.FINAL_TERM_EDITED,
        ID : ftId
      };
      this.props.sendAMsgFromAdminWithCompanyId(lProps);

      // now send msg to the borrower's company
      let bProps={
        companyId : bCompanyId,
        msg : constants.MESSAGES.FINAL_TERM_EDITED,
        ID : ftId
      };
      this.props.sendAMsgFromAdminWithCompanyId(bProps);

      this.props.history.push({
        pathname : constants.ROUTES_MAP.RFP_MARKETPLACE,
        state : constants.NOTIFICATIONS.EDIT_FINAL_TERM_SUCCESS
      });
    } else {
      toast(constants.NOTIFICATIONS.EDIT_FINAL_TERM_FAILED, {
        className : "notification-error"
      });  
    }
  }

  isValuesUpdated(ft, suffix){
    if(ft.loanSize !== this.props.initialValues['loanSize'+suffix]
      || ft.loanStructure !== this.props.initialValues['loanStructure'+suffix]
      || ft.maturity !== this.props.initialValues['maturity'+suffix]
      || ft.upfrontFee !== this.props.initialValues['upfrontFee'+suffix]    
      || ft.cashInterest !== this.props.initialValues['cashInterest'+suffix]
      || ft.pikIntreset !== this.props.initialValues['pikIntreset'+suffix]
      || ft.liborFloor !== this.props.initialValues['liborFloor'+suffix]
      || ft.year1 !== this.props.initialValues['year1'+suffix]
      || ft.year2 !== this.props.initialValues['year2'+suffix]
      || ft.year3 !== this.props.initialValues['year3'+suffix]
      || ft.year4 !== this.props.initialValues['year4'+suffix]
      || ft.year5 !== this.props.initialValues['year5'+suffix]
      || ft.totalLeverage !== this.props.initialValues['totalLeverage'+suffix]
      || ft.interestCoverage !== this.props.initialValues['interestCoverage'+suffix]
      || ft.fixedChargeCoverage !== this.props.initialValues['fixedChargeCoverage'+suffix]
    )
    return true;
    return false;
  }

  displayRFPSummary(){
    return (
      <div>
        <h4>RFP Details : </h4>
        <br/>
        {this.props.rfp.companyDesc}
        <br/>
        <br/>
        {this.props.rfp.txnOverview}
        <br/>
        <br/>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td>Sector: {this.props.rfp.sector}</td>
              <td>Deal Size : {this.props.rfp.dealSize} &nbsp; {cUtils.getDisplayValue(this.props.rfp.product)}</td>
            </tr>
            <tr>
              <td>LTM Revenue : {cUtils.formatCurrencyToDisplay(this.props.rfp.ltmRevenue)}</td>
              <td>LTM EBITDA:{cUtils.formatCurrencyToDisplay(this.props.rfp.ltmEbitda)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  displaySubtitle(){
    return (
      <div>
        <h4>Final Term Sheet</h4>
        <br/>
      </div>
    );
  }

  displayStructureFor2Loans(suffix){
    if(this.state.displayTwoLoanStructures){
      return(<span>
        <div className={`row`}>
          <Field
            name={"loanSize"+suffix}
            label="Final Loan Size"
            size="col-xs-6 col-md-6"
            component={this.renderField}
          />
          <Field
            label="Loan Structure"
            name={"loanStructure"+suffix}
            size="col-xs-6 col-md-6"
            component={this.renderDropdownField}
            dpField={loanStructOptions}
          />
        </div>
        <div className={`row`}>
          <Field
            name={"upfrontFee"+suffix}
            label="Final OID / Upfront Fee (%)"
            size="col-xs-6 col-md-6"
            component={this.renderField}
          />
          <Field
            name={"maturity"+suffix}
            label="Final Maturity (years)"
            size="col-xs-6 col-md-6"
            component={this.renderField}
          />
        </div>
      </span>);
    } else {
      return(<span>
        <div className={`row`}>
          <Field
            name={"loanSize"+suffix}
            label="Final Loan Size"
            size="col-xs-4 col-md-4"
            component={this.renderField}
          />
          <Field
            name={"upfrontFee"+suffix}
            label="Final OID / Upfront Fee (%)"
            size="col-xs-4 col-md-4"
            component={this.renderField}
          />
          <Field
            name={"maturity"+suffix}
            label="Final Maturity (years)"
            size="col-xs-4 col-md-4"
            component={this.renderField}
          />
        </div>
      </span>);
    }
  }

  displayFinalTermSheetForm(suffix){
    return(<div>
      { this.displayStructureFor2Loans(suffix) }
      <br/>

      <div className={`row`}>
        <fieldset className="form-group col-xs-3 col-md-3 scheduler-border">
          <legend className="scheduler-border">Loan Pricing(%)</legend>
          <Field
            name={"cashInterest"+suffix}
            label="Cash Interest"
            component={this.renderField}
          />
          <br/>
          <Field
            name={"pikIntreset"+suffix}
            label="PIK Interest"
            component={this.renderField}
          />
          <br/>
          <Field
            name={"liborFloor"+suffix}
            label="LIBOR Floor"
            component={this.renderField}
          />
        </fieldset>

        <div className={`form-group col-xs-1 col-md-1`}>
      </div>

      <fieldset className="form-group col-xs-3 col-md-3 scheduler-border">
        <legend className="scheduler-border">Covenants</legend>
        <Field
          name={"totalLeverage"+suffix}
          label="Total Leverage"
          component={this.renderField}
        />
        <br/>
        <Field
          name={"interestCoverage"+suffix}
          label="Interest Coverage"
          component={this.renderField}
        />
        <br/>
        <Field
          name={"fixedChargeCoverage"+suffix}
          label="Fixed Charge Coverage"
          component={this.renderField}
        />
      </fieldset>

      <div className={`form-group col-xs-1 col-md-1`}>
      </div>

      <fieldset className="form-group col-xs-3 col-md-3 scheduler-border">
        <legend className="scheduler-border">Amortization(%)</legend>
        <Field
          name={"year1"+suffix}
          label="Year 1"
          component={this.renderField}
        />
        <br/>
        <Field
          name={"year2"+suffix}
          label="Year 2"
          component={this.renderField}
        />
        <br/>
        <Field
          name={"year3"+suffix}
          label="Year 3"
          component={this.renderField}
        />
        <br/>
        <Field
          name={"year4"+suffix}
          label="Year 4"
          component={this.renderField}
        />
        <br/>
        <Field
          name={"year5"+suffix}
          label="Year 5"
          component={this.renderField}
        />
      </fieldset>
    </div>
    <br/>
    </div>);
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
        rfpId 	: this.props.rfp.rfpId,
        linkId 	: this.props.link.linkId,
        uploadedCompanyId : this.state.user.companyId
      }).then((data)=>{
        that.myFileInput=null;
        this.props.getLinkDocsWithLinkIdAndTypeAction(this.props.link.linkId, "FINAL_TERM");
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

	downloadDocument(fileName){
		this.props.downloadLinkDocumentAction(fileName)
		.then((data) => {
			window.open(data.payload.data.data);
		});
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

  displayFileUploadBlock(){
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
        <tbody key={this.props.link.linkId+'__FINAL_TERM'}>
          {this.renderDocumentItem('FINAL_TERM')}
          <tr>
            <td colSpan="4">
              <span>Select a document to upload </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <input
                id="fileInput"
                ref={(ref) => this.myFileInput = ref}
                style={inputTagStyle}
                type="file"
                onChange={this.handleFileUpload.bind(this, 'FINAL_TERM')} />
            </td>
          </tr>
        </tbody>
      </table>
      <hr/>
    </div>);
  }

  onSelectLoanStructure(props){
    if((props.target.value === 'ABL-Both' || props.target.value === 'CashFlow-Both') && !this.state.displayTwoLoanStructures) {
      this.setState({
        displayTwoLoanStructures : true
      });
    } else if(this.state.displayTwoLoanStructures){
      this.setState({
        displayTwoLoanStructures : false
      });
    }
  }

  displayTwoFTFields(){
    return(
      <Tabs>
        <TabList>
          <Tab>
            First Tranche
          </Tab>
          <Tab>
            Second Tranche
          </Tab>
        </TabList>
        <TabPanel>
          {this.displayFinalTermSheetForm("_1")}
        </TabPanel>
        <TabPanel>
          {this.displayFinalTermSheetForm("_2")}
        </TabPanel>
      </Tabs>
    );
  }

  render(){
    const {handleSubmit} = this.props;

    return(
      <div>
        <ToastContainer />
        <Header/>
        <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
          <div className="container main-container-left-padding" >
            <h3>Final Term Sheet Revisions</h3>
            <br/>
            <p>Modify Final terms below and submit.</p>
            <br/>
            <hr/>
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
              {this.props.rfp ? this.displayRFPSummary() : ''}
              <br/>
              {this.displaySubtitle()}
              <br/>
              {this.props.link ? this.displayFileUploadBlock() : null}
              <hr/>
              <div className={`row`}>
                <Field
                  label="Loan Structure"
                  name="loanStructure"
                  size="col-xs-12 col-md-12"
                  onChange={this.onSelectLoanStructure.bind(this)}
                  component={this.renderDropdownField}
                  dpField={loanStructOptions}
                />
              </div>
              <br/>
              <hr/>              
              {this.state.displayTwoLoanStructures ? this.displayTwoFTFields() : this.displayFinalTermSheetForm("_1")}
              <div className={`row`}>
                <button type="submit" className="btn btn-primary">SUBMIT</button>&nbsp;&nbsp;
                <Link to="/rfpMarketPlace" className="btn btn-danger">Cancel</Link>
              </div>
            </form>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  let intializedData = { }

  if(state.link.linkDocList){
    intializedData.linkDocList = state.link.linkDocList
  }

  if(state.finalTerm.finalTerm){
    let initData = {};
    let finalTerm = {};

    if(Array.isArray(state.finalTerm.finalTerm)){
      finalTerm = state.finalTerm.finalTerm[0];
  
      let childFTList = [];
      if(state.finalTerm.finalTerm[1]){
        childFTList.push(state.finalTerm.finalTerm[1]);
      }
  
      if(state.finalTerm.finalTerm[2]){
        childFTList.push(state.finalTerm.finalTerm[2]);
      }

      initData = {
        ...setInitData(childFTList[0], "_1"),
        ...setInitData(childFTList[1], "_2")
      }
    } else {
      finalTerm = state.finalTerm.finalTerm;
      initData = setInitData(state.finalTerm.finalTerm, "_1");
    }
    intializedData={finalTerm};
    initData.loanStructure = finalTerm.loanStructure;
    intializedData.initialValues = initData;
  }
  
  if(state.rfpList.rfpList){
    intializedData.rfp = state.rfpList.rfpList[0];
  }

  if(state.link.linkList){
    intializedData.link = state.link.linkList[0];
  }

  if(state.link.linkDocList){
    intializedData.linkDocList = state.link.linkDocList;
  }

  return intializedData;
}

function setInitData(ft, suffix){
  let params = {};
  params['finalTermId'+suffix] = ft.finalTermId;
  params['loanSize'+suffix] = ft.loanSize;
  params['liborFloor'+suffix] = ft.liborFloor;
  params['pikIntreset'+suffix] = ft.pikIntreset;
  params['upfrontFee'+suffix] = ft.upfrontFee;
  params['maturity'+suffix] = ft.maturity;
  params['loanStructure'+suffix] = ft.loanStructure;  
  params['cashInterest'+suffix] = ft.cashInterest;
  params['totalLeverage'+suffix] = ft.totalLeverage;
  params['interestCoverage'+suffix] = ft.interestCoverage;
  params['fixedChargeCoverage'+suffix] = ft.fixedChargeCoverage;
  params['year1'+suffix] = ft.year1;
  params['year2'+suffix] = ft.year2;
  params['year3'+suffix] = ft.year3;
  params['year4'+suffix] = ft.year4;
  params['year5'+suffix] = ft.year5;

  return params;
}

function validate(values){
  const errors={};

  if(!values.cashInterest){
    errors.cashInterest='Enter value for cash interest';
  }

  if(!values.pikIntreset){
    errors.pikIntreset='Enter value for PIK interest';
  }

  if(!values.liborFloor ){
    errors.liborFloor='Enter value for LIBOR floor';
  }

  if(!values.maturity || values.maturity == 0){
    errors.maturity='Enter value for maturity';
  }

  if(!values.upfrontFee){
    errors.upfrontFee='Enter value for upfront fee';
  }

  return errors;
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  return bindActionCreators({
    updateFinalTermAction   : updateFinalTermAction,
    uploadDocumentRequest   : uploadDocumentRequest,
    deleteLinkDocumentAction : deleteLinkDocumentAction,
    getLinkDocsWithLinkIdAndTypeAction : getLinkDocsWithLinkIdAndTypeAction,
    downloadLinkDocumentAction : downloadLinkDocumentAction,
    getLinkWithFinalTermAction : getLinkWithFinalTermAction,
    getIOIWithFinalTermAction : getIOIWithFinalTermAction,
    getRFPWithFinalTermAction : getRFPWithFinalTermAction,
    fetchFinalTerm : fetchFinalTerm,
    createFinalTermAction : createFinalTermAction,
    deleteFTAction : deleteFTAction,
    fetchLinkDocsWithFinalTermIdAction : fetchLinkDocsWithFinalTermIdAction,
    sendAMsgFromAdminWithCompanyId : sendAMsgFromAdminWithCompanyId
  }, dispatch);
}

EditFinalTermForm = reduxForm({
  'form': 'EditFinalTermForm',
  validate
}) (EditFinalTermForm)

EditFinalTermForm = connect(mapStateToProps, mapDispatchToProps)(EditFinalTermForm)

export default EditFinalTermForm
