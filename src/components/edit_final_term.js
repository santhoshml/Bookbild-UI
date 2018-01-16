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
		// console.log('className:'+JSON.stringify(className));
		// console.log('field:'+JSON.stringify(field));
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

    // this.props.getIOIWithFinalTermAction(paramId);
    this.props.getLinkWithFinalTermAction(paramId);
    this.props.getRFPWithFinalTermAction(paramId);
    this.props.fetchFinalTerm(paramId);

    this.setState({
      company             : company,
      user                : user
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

    // if(nextProps.ioi){
    //   this.setState({
    //     ioi : nextProps.ioi
    //   });
    // }
  }


  onSubmit(props){
    let that = this;

    // console.log('createIOIAction:'+JSON.stringify(props));

    // props.linkId = this.state.link.linkId
    // props.ioiId = this.state.link.ioiId;
    // props.createdById = this.state.user.userId;
    // below 2 may not be nessary
    // props.rfpId = this.state.link.rfpId;
    // props.createdByCompanyId = this.state.createdByCompanyId;
    props.lastEditedById = this.state.user.userId;
    props.finalTermId = this.props.initialValues.finalTermId;
    // console.log('edit final Term:'+JSON.stringify(props));
    this.props.updateFinalTermAction(props)
      .then(() => {
        // send a msg to lender's company
        let lProps = {
          companyId : that.state.user.companyId,
          msg : constants.MESSAGES.FINAL_TERM_EDITED,
          ID : that.props.initialValues.finalTermId
        };
        that.props.sendAMsgFromAdminWithCompanyId(lProps);

        // now send msg to the borrower's company
        let bProps={
          companyId : this.state.rfp.createdByCompanyId,
          msg : constants.MESSAGES.FINAL_TERM_EDITED,
          ID : that.props.initialValues.finaltermId
        };
        that.props.sendAMsgFromAdminWithCompanyId(bProps);
        this.props.history.push(constants.ROUTES_MAP.RFP_MARKETPLACE);
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

  displayFinalTermSheetForm(){
    return(<div>
      <div className={`row`}>
        <Field
          name="loanSize"
          label="Final Loan Size"
          size="col-xs-4 col-md-4"
          component={this.renderField}
        />
        <Field
          name="upfrontFee"
          label="Final OID / Upfront Fee (%)"
          size="col-xs-4 col-md-4"
          component={this.renderField}
        />
        <Field
          name="maturity"
          label="Final Maturity (years)"
          size="col-xs-4 col-md-4"
          component={this.renderField}
        />
      </div>
      <br/>

      <div className={`row`}>
        <fieldset className="form-group col-xs-3 col-md-3 scheduler-border">
          <legend className="scheduler-border">Loan Pricing(%)</legend>
          <Field
            name="cashInterest"
            label="Cash Interest"
            component={this.renderField}
          />
          <br/>
          <Field
            name="pikIntreset"
            label="PIK Interest"
            component={this.renderField}
          />
          <br/>
          <Field
            name="liborFloor"
            label="LIBOR Floor"
            component={this.renderField}
          />
        </fieldset>

        <div className={`form-group col-xs-1 col-md-1`}>
      </div>

      <fieldset className="form-group col-xs-3 col-md-3 scheduler-border">
        <legend className="scheduler-border">Covenants</legend>
        <Field
          name="totalLeverage"
          label="Total Leverage"
          component={this.renderField}
        />
        <br/>
        <Field
          name="intrestCoverage"
          label="Intrest Coverage"
          component={this.renderField}
        />
        <br/>
        <Field
          name="fixedChargeCoverage"
          label="Fixed Charge Coverage"
          component={this.renderField}
        />
      </fieldset>

      <div className={`form-group col-xs-1 col-md-1`}>
      </div>

      <fieldset className="form-group col-xs-3 col-md-3 scheduler-border">
        <legend className="scheduler-border">Amortization(%)</legend>
        <Field
          name="year1"
          label="Year 1"
          component={this.renderField}
        />
        <br/>
        <Field
          name="year2"
          label="Year 2"
          component={this.renderField}
        />
        <br/>
        <Field
          name="year3"
          label="Year 3"
          component={this.renderField}
        />
        <br/>
        <Field
          name="year4"
          label="Year 4"
          component={this.renderField}
        />
        <br/>
        <Field
          name="year5"
          label="Year 5"
          component={this.renderField}
        />
      </fieldset>
    </div>
    <br/>
    </div>);
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
        ioiId 	: this.state.link.ioiId,
        rfpId 	: this.state.rfp.rfpId,
        linkId 	: this.state.link.linkId,
        uploadedCompanyId : this.state.user.companyId
      }).then((data)=>{
          // console.log('file upload completed');
        // that.props.getLinkDocsWithLinkIdAction(that.props.link.linkId);
        that.myFileInput=null;
        this.props.getLinkDocsWithLinkIdAndTypeAction(this.state.link.linkId, "FINAL_TERM");
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

	downloadDocument(fileName){
		// console.log('I am in downloadDocument, fileName:'+fileName);
		// window.open(cUtils.getS3FileURL(fileName));
		this.props.downloadLinkDocumentAction(fileName)
		.then((data) => {
			// console.log('downloaded the docuemnt, now in then, data:'+JSON.stringify(data));
			window.open(data.payload.data.data);
		});
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

  displayFileUploadBlock(){
    // console.log('I am in displayFileUploadBlock');
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

  render(){
    // console.log('I am in create IOI');
    const {handleSubmit} = this.props;

    return(
      <div>
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
              {this.displayFinalTermSheetForm()}
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

  // if(state.ioiList.ioi){
  //   intializedData.ioi = state.ioiList.ioi[0];
  // }

  if(state.finalTerm.finalTerm){
    // console.log('state.finalTerm.finalTerm : '+ JSON.stringify(state.finalTerm.finalTerm));
    let finalTerm = state.finalTerm.finalTerm[0];
    let initData ={
      finalTermId : finalTerm.finalTermId,
      loanSize : finalTerm.loanSize,
      yield : finalTerm.yield,
      maturity : finalTerm.maturity,
      liborFloor : finalTerm.liborFloor,
      upfrontFee : finalTerm.upfrontFee,
      pikIntreset : finalTerm.pikIntreset,
      cashInterest : finalTerm.cashInterest,
      year1 : finalTerm.year1,
      year2 : finalTerm.year2,
      year3 : finalTerm.year3,
      year4 : finalTerm.year4,
      year5 : finalTerm.year5
    }
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

function validate(values){
  // console.log('values:'+JSON.stringify(values));
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
    sendAMsgFromAdminWithCompanyId : sendAMsgFromAdminWithCompanyId
  }, dispatch);
}

EditFinalTermForm = reduxForm({
  'form': 'EditFinalTermForm',
  validate
}) (EditFinalTermForm)

EditFinalTermForm = connect(mapStateToProps, mapDispatchToProps)(EditFinalTermForm)

export default EditFinalTermForm
