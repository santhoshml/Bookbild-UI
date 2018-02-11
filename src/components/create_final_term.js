import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { fetchIOIAction
  , getLinkWithIOIAction
  , fetchRFPByIOIAction
  , downloadLinkDocumentAction
  , createFinalTermAction
  , uploadDocumentRequest
  , deleteLinkDocumentAction
  , getLinkDocsWithLinkIdAndTypeAction
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
class CreateFinalTermForm extends Component{

  constructor(props){
    super(props);
    this.state = {
      user : null,
      rfp : null,
      type : props.match.params.type,
      link : null,
      ioi : null
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
    let paramId = this.props.match.params.id;

    let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);

    Promise.all([
      this.props.fetchIOIAction(paramId),
      this.props.fetchRFPByIOIAction(paramId),
      this.props.getLinkWithIOIAction(paramId)
    ]);

    this.setState({
      company             : company,
      user                : user,
      displayCollateralAnalysis : false,
      displayTwoLoanStructures : false
    });
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.rfp){
      this.setState({
        rfp : nextProps.rfp
      });
    }

    if(nextProps.link){
      this.setState({
        link : nextProps.link
      });
    }

    if(nextProps.ioi){
      this.setState({
        ioi : nextProps.ioi
      });
    }

    if(this.props.ioi 
      && !this.state.displayTwoLoanStructures
      && (this.props.ioi.loanStructure === 'ABL-Both'
        || this.props.ioi.loanStructure === 'CashFlow-Both')){
      this.setState({
        displayTwoLoanStructures : true
      });
    }
  }


  onSubmit(props){
    let that = this;
    JSAlert.confirm("Are you sure you want to submit the Final Term Sheet ?")
    .then(function(result){
      if(!result){
        // console.log('user did cancel before submitting the final term');
      } else {
        props.linkId = that.state.link.linkId;
        props.rfpId = that.state.rfp.rfpId;
        props.createdById = that.state.user.userId;
        props.createdByCompanyId = that.state.company.companyId;
        props.ioiId = that.state.ioi.ioiId;
        props.forCompanyId = that.state.rfp.createdByCompanyId;

        if(that.state.displayTwoLoanStructures){
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
          props_1.rfpId = that.props.rfp.rfpId;
          props_1.createdById = that.state.user.userId;
          props_1.createdByCompanyId = that.state.company.companyId;
          props_1.forCompanyId = that.props.rfp.createdByCompanyId;
          props_1.createdByContactId = that.state.user.contactId;
          props_1.ioiId = that.state.ioi.ioiId;
          props_1.linkId = that.state.link.linkId;
    
          props_2.rfpId = that.props.rfp.rfpId;
          props_2.createdById = that.state.user.userId;
          props_2.createdByCompanyId = that.state.company.companyId;
          props_2.forCompanyId = that.props.rfp.createdByCompanyId;
          props_2.createdByContactId = that.state.user.contactId;
          props_2.ioiId = that.state.ioi.ioiId;
          props_2.linkId = that.state.link.linkId;
    
          props.childFTList = [props_1, props_2];
        } else {
          let keys = Object.keys(props);      
          for(let key of keys){
            if(key.indexOf("_1") >= 0){
              let eKey = key.substr(0, key.length-2);
              props[eKey] = props[key];
              delete props[key];
            }
          }
        }

        that.props.createFinalTermAction(props)
        .then((data) => {
          if(data.payload.status === 200 && data.payload.data.status === 'SUCCESS'){ // on succesful login
            // send a msg to lender's company
            let lProps = {
              companyId : that.state.user.companyId,
              msg : constants.MESSAGES.FINAL_TERM_CREATED_LENDER,
              ID : data.payload.data.data
            };
            that.props.sendAMsgFromAdminWithCompanyId(lProps);

            // now send msg to the borrower's company
            let bProps={
              companyId : that.state.rfp.createdByCompanyId,
              msg : constants.MESSAGES.FINAL_TERM_CREATED_BORROWER,
              ID : data.payload.data.data
            };
            that.props.sendAMsgFromAdminWithCompanyId(bProps);

            that.props.history.push({
              pathname : constants.ROUTES_MAP.RFP_MARKETPLACE,
              state : constants.NOTIFICATIONS.CREATE_FINAL_TERM_SUCCESS
            });
          } else {
            toast(constants.NOTIFICATIONS.CREATE_FINAL_TERM_FAILED, {
              className : "notification-error"
            });    
          }
        });
      }
    });
	}

  displayRFPSummary(){
    return (
      <div>
        <h4>RFP Details : </h4>
        <br/>
        {this.state.rfp.companyDesc}
        <br/>
        <br/>
        {this.state.rfp.txnOverview}
        <br/>
        <br/>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td>Sector: {this.state.rfp.sector}</td>
              <td>Deal Size : {this.state.rfp.dealSize} &nbsp; {cUtils.getDisplayValue(this.state.rfp.product)}</td>
            </tr>
            <tr>
              <td>LTM Revenue : {cUtils.formatCurrencyToDisplay(this.state.rfp.ltmRevenue)}</td>
              <td>LTM EBITDA:{cUtils.formatCurrencyToDisplay(this.state.rfp.ltmEbitda)}</td>
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

  displayTwoFinalTermSheetFields(){
    return(
      <Tabs>
        <TabList>
          <Tab>
            First Loan
          </Tab>
          <Tab>
            SecondLoan
          </Tab>
        </TabList>
        <TabPanel>
          {this.displayFinalTermSheetFields("_1")}
        </TabPanel>
        <TabPanel>
          {this.displayFinalTermSheetFields("_2")}
        </TabPanel>
      </Tabs>
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
            name={"loanStructure"+suffix}
            label="Loan Structure"
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
      // there is only 1 IOI
      return (
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
      )
    }
  }

  displayFinalTermSheetFields(suffix){
    return(<div>
      {this.displayStructureFor2Loans(suffix)}
      <br/>
      <div className={`row`}>
        <Field
          name={"warrants"+suffix}
          label="Warrants"
          size="col-xs-12 col-md-12"
          component={this.renderField}
        />
      </div>

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
          name={"intrestCoverage"+suffix}
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
        ioiId 	: this.state.ioi.ioiId,
        rfpId 	: this.state.rfp.rfpId,
        linkId 	: this.state.link.linkId,
        uploadedCompanyId : this.state.user.companyId
      }).then((data)=>{
        that.myFileInput=null;
        this.props.getLinkDocsWithLinkIdAndTypeAction(this.state.link.linkId, "FINAL_TERM");
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
        <tbody key={this.state.link.linkId+'__FINAL_TERM'}>
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
    if((props.target.value === 'ABL-Both' || props.target.value === 'CashFlow-Both') 
    && !this.state.displayTwoLoanStructures) {
      this.setState({
        displayTwoLoanStructures : true
      });
    } else if(this.state.displayTwoLoanStructures){
      this.setState({
        displayTwoLoanStructures : false
      });
    }
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
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
              {this.state.rfp ? this.displayRFPSummary() : ''}
              <br/>
              {this.displaySubtitle()}
              <br/>
              {this.state.link ? this.displayFileUploadBlock() : null}
              <br/>
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
              {this.state.displayTwoLoanStructures ? this.displayTwoFinalTermSheetFields() : this.displayFinalTermSheetFields("_1")}
              {
                // this.displayFinalTermSheetForm()
              }
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
  let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
  let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);

  let intializedData = {};

  if(state.link.linkDocList){
    intializedData.linkDocList = state.link.linkDocList;
  }

  if(state.ioiList.ioi){
    let initData = {};
    let ioi = {};
    if(Array.isArray(state.ioiList.ioi)){
      ioi = state.ioiList.ioi[0];
      intializedData.ioi = ioi;

      let childIOIList = [];
      if(state.ioiList.ioi[1])
        childIOIList.push(state.ioiList.ioi[1]);
  
      if(state.ioiList.ioi[2])
        childIOIList.push(state.ioiList.ioi[2]);
      
      initData = {
        ...setInitData(childIOIList[0], "_1"),
        ...setInitData(childIOIList[1], "_2")
      }      
    } else {
      ioi = state.ioiList.ioi;
      intializedData.ioi = ioi;
      initData = setInitData(state.ioiList.ioi, "_1");      
    }

    initData.loanStructure = ioi.loanStructure;
    intializedData.initialValues = initData;    
  }

  if(state.rfpList.rfpList){
    intializedData.rfp = state.rfpList.rfpList[0];
  }

  if(state.link.linkList){
    intializedData.link = state.link.linkList[0];
  }

  return intializedData;
}

function setInitData(ioi, suffix){
  let params = {};
  params['ioiId'+suffix] = ioi.ioiId;
  params['loanSize'+suffix] = ioi.loanSize;
  params['liborFloor'+suffix] = ioi.liborFloor;
  params['pikIntreset'+suffix] = ioi.pikIntreset;
  params['upfrontFee'+suffix] = ioi.upfrontFee;
  params['maturity'+suffix] = ioi.maturity;
  params['loanStructure'+suffix] = ioi.loanStructure;
  params['cashInterest'+suffix] = ioi.cashInterest;
  params['year1'+suffix] = ioi.year1;
  params['year2'+suffix] = ioi.year2;
  params['year3'+suffix] = ioi.year3;
  params['year4'+suffix] = ioi.year4;
  params['year5'+suffix] = ioi.year5;

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
  return bindActionCreators({
    createFinalTermAction   : createFinalTermAction,
    uploadDocumentRequest   : uploadDocumentRequest,
    deleteLinkDocumentAction : deleteLinkDocumentAction,
    getLinkDocsWithLinkIdAndTypeAction : getLinkDocsWithLinkIdAndTypeAction,
    downloadLinkDocumentAction : downloadLinkDocumentAction,
    fetchRFPByIOIAction : fetchRFPByIOIAction,
    getLinkWithIOIAction : getLinkWithIOIAction,
    fetchIOIAction : fetchIOIAction,
    sendAMsgFromAdminWithCompanyId : sendAMsgFromAdminWithCompanyId
  }, dispatch);
}

CreateFinalTermForm = reduxForm({
  form : 'CreateFinalTermForm',
  enableReinitialize  : true,
  validate
}) (CreateFinalTermForm)

CreateFinalTermForm = connect(mapStateToProps, mapDispatchToProps)(CreateFinalTermForm)

export default CreateFinalTermForm
