import React, {Component} from 'react';
import { saveComplianceData, getComplianceData, getLinksWithCompanyIdAction, uploadDocumentRequest } from '../actions/index';
import { Link } from "react-router-dom";
import lsUtils from '../utils/ls_utils';
import complainceUtils from '../utils/compliance_utils';
import constants from '../utils/constants';
import NavBar from './sidebar';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/index';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import DataGrid from './data_grid_example';
import Header from './header';
import JSAlert from "js-alert";

const childRowStyle = {
  fontStyle :'italic', 
  fontFamily: 'monospace', 
  paddingLeft:'10px', 
  fontSize:'12px'
};

class complianceForm extends Component{

	constructor(props){
		super(props);
		// console.log('I am in constructor');
		this.state = {
			user : null,
      company : null,
      selectedView : 'monthly',
      selectedYear : 'YR_'+new Date().getFullYear(),
      coloumns : [],
      complianceData : null,
      complianceDisplayData : [],
      complianceDataId : null
		};
  }
  
	componentWillMount() {
    // console.log('I am in documents.componentWillMount');
    let that = this;
		let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
    
    if(user.role === constants.KEY_LENDER){
      this.props.getLinksWithCompanyIdAction(user.companyId)
      .then(function(results){
        // console.log('I am in then, results:'+JSON.stringify(results));
        if(results.payload.status === 200 && results.payload.data.data.length > 0){
          let linkList = results.payload.data.data;
          // console.log('linkList:'+JSON.stringify(linkList));
          for(let i=0; i< linkList.length; i++){
            linkList[i].view = false;
          }
          // console.log('linkList:'+JSON.stringify(linkList));

          that.setState({
            linkList : linkList
          });
        }
      });
    } else {
      this.props.getComplianceData(company.companyId);
    }

    // data should be editable only by company and financial sponsor
    let isColoumnsEditable = false;
    if(user.role === constants.KEY_COMPANY || user.role === constants.KEY_FINANCIAL_SPONSOR)
      isColoumnsEditable = true;
    this.setState({
			user : user,
      company : company,
      coloumns : complainceUtils.getMonthlyColoumns(this.typeCustomFormatter, isColoumnsEditable),
    });    
  }

  componentWillReceiveProps(nextProps){
    console.log('In componentWillReceiveProps ');
    let data = {};

    if(!this.state.complianceData){
      console.log('there is no compliance data in the state');
      if(nextProps.complianceData && nextProps.complianceData.data){
        data = nextProps.complianceData.data;
        let thisYearComplianceData = data[this.state.selectedYear];
        if(!thisYearComplianceData){
          // if there data is not in the db, then do a init
          // console.log('there is no data for the selectedYear :'+this.state.selectedYear+', calling a init');
          data[this.state.selectedYear] = complainceUtils.initComplianceData(this.state.coloumns);
        }
      } else {
        // console.log('there is no data object calling a init');
        data[this.state.selectedYear] = complainceUtils.initComplianceData(this.state.coloumns);
      }
      
      // set the state with data
      this.setState({
        complianceData : data,
        complianceDataId : nextProps.complianceData ? nextProps.complianceData.complianceDataId : null,
        complianceDisplayData : complainceUtils.getDisplayData(data[this.state.selectedYear], this.state.coloumns)
      });
    } else {
      console.log('there is a complianceData object in state');
    }
  }

  typeCustomFormatter(type){
    // console.log('type:'+JSON.stringify(type));
    if(type.value.indexOf('(x)') > 0 
      || type.value.indexOf('(%)') > 0
      || type.value.indexOf('($)') > 0
      || type.value.indexOf('(0.0x)') > 0) {
      return(
        <span style={childRowStyle}>{type.value}</span>  
      );
    } else {
      return (
        <span>{type.value}</span>
      );
    }
  }
  
  handleGridRowsUpdated({ fromRow, toRow, updated }) {
    // console.log('fromRow:'+fromRow+', toRow:'+toRow+', updated:'+JSON.stringify(updated));
    // console.log('year:'+this.state.selectedYear+', view:'+this.state.selectedView);
    let x = fromRow;
    let y = (Object.keys(updated))[0];
    // update the state with the values
    let updatedComplianceData = this.state.complianceData;
    ((updatedComplianceData[this.state.selectedYear])[x])[y] = updated[y];

    // now update the display
    this.setState({
      complianceData : updatedComplianceData,
      complianceDisplayData : complainceUtils.getDisplayData(updatedComplianceData[this.state.selectedYear], this.state.coloumns)
    });
  }

  onChangeYear(event){
    // console.log('I am in onChangeYear, val:'+event.target.value);
    let selectedYear = 'YR_'+event.target.value;
    let cData = this.state.complianceData;
    if(!cData[selectedYear])
      cData[selectedYear] = complainceUtils.initComplianceData(this.state.coloumns);

    this.setState({
      selectedYear : selectedYear,
      complianceData : cData,
      complianceDisplayData : complainceUtils.getDisplayData(cData[selectedYear], this.state.coloumns)

    });
  }

  onChangeSelectView(val){
    // console.log('I am in onClickSelectView, val:'+val);
    if(val === 'quaterly'){
      // console.log('I am in onClickSelectView, quaterly');
      let cols = complainceUtils.getQuaterlyColoumns(this.typeCustomFormatter);
      this.setState({
        selectedView : 'quaterly',
        coloumns : cols,
        complianceDisplayData : complainceUtils.getDisplayData(this.state.complianceData[this.state.selectedYear], cols)
      });
    } else {
      // console.log('I am in onClickSelectView, monthly');
      let isEditable = false;
      if(this.state.user.role === constants.KEY_COMPANY
        || this.state.user.role === constants.KEY_FINANCIAL_SPONSOR )
        isEditable = true;

      let cols = complainceUtils.getMonthlyColoumns(this.typeCustomFormatter, isEditable);
      this.setState({
        selectedView : 'monthly',
        coloumns : cols,
        complianceDisplayData : complainceUtils.getDisplayData(this.state.complianceData[this.state.selectedYear], cols)
      });
    }
  }

  displayComplianceView(){
    // console.log('In displayComplianceView');
    // console.log('this.state:'+JSON.stringify(this.state));
    return(
      <div>
        <DataGrid
          columns={this.state.coloumns}
          dataList={this.state.complianceDisplayData}
          clickableRow="false"
          onGridRowsUpdated={this.handleGridRowsUpdated.bind(this)}
          showFilter = "false"
        />
        <br/>
        <br/>
      </div>
    );
  }

  saveComplianceData(){
    // console.log('In saveComplianceData');
    let dObject = {};
    dObject.companyId = this.state.company.companyId;
    dObject.userId = this.state.user.userId;
    dObject.data = this.state.complianceData;
    dObject.complianceDataId = this.state.complianceDataId;
    this.props.saveComplianceData(dObject);
  }

  addSubmit(){
      return (<span>
        <button type="submit" className="btn btn-primary" onClick={this.saveComplianceData.bind(this)}>Save</button>&nbsp;&nbsp;
        <Link to="/rfpMarketPlace" className="btn btn-danger">Cancel</Link>
      </span>
    );
  }

  displayDropdownSelections(){
    // console.log('In displayDropdownSelections, ');
    return(<div>
      <p>Select the year from the dropdown to view the compliance data. Switch between quaterly and monthly views to view data. </p>
      <br/>
      <div className={`row`}>
        <span className={`form-group col-xs-3 col-md-3`}>
          <select className="form-control" name="year" value={complainceUtils.getYearToDisplay(this.state.selectedYear)} onChange={this.onChangeYear.bind(this)}>
            {complainceUtils.getYearOptions().map(fOption =>
                <option value={fOption} key={fOption} >
                  {fOption}
                </option>
            )}
          </select>
        </span>
        <span className={`form-group col-xs-6 col-md-6 }`}>
          <span>
            <label className="radio-inline">
              <input
                type="radio"
                name="quaterly"
                value="quaterly"
                checked = {this.state.selectedView === 'quaterly' ? true : false}
                onChange={this.onChangeSelectView.bind(this, 'quaterly')}
                />
                Quarterly View
            </label>
          </span>
          <span>
            <label className="radio-inline">
              <input
                type="radio"
                name="monthly"
                value="monthly"
                checked = {this.state.selectedView === 'monthly' ? true : false}
                onChange={this.onChangeSelectView.bind(this, 'monthly')}
                />
                Monthly View
            </label>
          </span>
        </span>
      </div>
      <br/>
    </div>
    );
  }

  getComplianceDataForLender(link){
    // console.log('In getComplianceDataForLender');
    // console.log('linkList :'+JSON.stringify(this.props.linkList));
    // console.log('\nselected link:'+ JSON.stringify(link));
    if((link.accessToLender && this.state.user.role !== constants.KEY_COMPANY && this.state.user.role !== constants.KEY_FINANCIAL_SPONSOR)
      || this.state.user.role === constants.KEY_COMPANY || this.state.user.role === constants.KEY_FINANCIAL_SPONSOR){
        for(let i=0;i< this.state.linkList.length; i++){
          if(this.state.linkList[i].linkId === link.linkId)
            this.state.linkList[i].view =  true;
          else 
          this.state.linkList[i].view =  false;
        }
        this.props.getComplianceData(link.borrowerCompanyId);
    } else {
      // console.log('Cannot see the Quaterly compliance data');
      JSAlert.alert("To view this data, borrower need to grant access to you.");
    }
  }

  displayLinks(){
    // console.log('I am displaying the links');
    let that = this;
    // console.log('In displayLinks :'+ JSON.stringify(this.props.linkList));
		return(<ul>
      {this.state.linkList && this.state.linkList.map(function(link){
        // console.log('link :'+JSON.stringify(link));
        // console.log('link.view :'+link.view);
        return (<li key={link.linkId ? link.linkId : link.rfpId} style={{listStyleType : 'none'}}>
          <Link to="#" onClick={that.getComplianceDataForLender.bind(that, link)}>
            {link.view ? <i className="fa fa-folder-open-o fa-lg" aria-hidden="true"><span className="indent">{link.name}</span></i>
              : <i className="fa fa-folder-o fa-lg" aria-hidden="true"><span className="indent">{link.name}</span></i>}
            
          </Link>
          <br/>
          <br/>
          {link.view ? that.displayDataMatrix() : ''}
        </li>
        );
      })}
      <br/>
      <br/>
      </ul>
    );
  }

  displayDataMatrix(){
    // console.log('I am in displayDataMatrix');
    return (
      <div>
      {this.state.complianceDisplayData.length > 0 ? this.displayDropdownSelections() : ''}
      {this.state.complianceDisplayData.length > 0 ? this.displayComplianceView() : ''}
      </div>
    );
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
			.then(()=>{
				that.myFileInput=null;
			});
		} else {
			// console.log('no file to upload');
		}
	}  

	render(){
    console.log('I am in quaterly_compliance.render');
    if(this.state.user.role === constants.KEY_COMPANY
      || this.state.user.role === constants.KEY_FINANCIAL_SPONSOR){
        return (
          <div>
            <Header/>
            <div style={{ display: 'flex' }}>
              <NavBar history={this.props.history}/>        
              <div className="container main-container-left-padding" >
                <br/>
                <br/>
                <h3>Quarterly Compliance</h3>
                <br/>
                {this.state.complianceDisplayData.length > 0 ? this.displayDropdownSelections() : ''}
                {this.state.complianceDisplayData.length > 0 ? this.displayComplianceView() : ''}
                {this.addSubmit()}
              </div>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
          </div>
        );
      } else if(this.state.user.role === constants.KEY_LENDER){
        return (
          <div>
            <Header/>
            <div style={{ display: 'flex' }}>
              <NavBar history={this.props.history}/>        
              <div className="container main-container-left-padding" >
                <br/>
                <br/>
                <h3>Quarterly Compliance</h3>
                <br/>
                <p>Click on the links below to see the compliance data for the borrower.</p>
                <br/>
                {this.state.linkList ? this.displayLinks() : ''}
              </div>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
          </div>
        );
      }
	}
}

function mapStateToProps(state) {
  // console.log('In mapStateToProps');
  // console.log('state:'+JSON.stringify(state));
  let rObject={};
  
	// if(state.link.linkList){
  //   rObject.linkList = state.link.linkList;

  //   // set the view flag as false
  //   for(let i=0; i<rObject.linkList.length ; i++){
  //     rObject.linkList[i].view = false;
  //   }
  // }
  
  if(state.complianceData.complianceData){
    // console.log('In mapStateToProps, :'+ JSON.stringify(state.complianceData.complianceData));
    let complianceData = state.complianceData.complianceData;
    rObject.complianceData = complianceData;
    
  }
  rObject.a = 'b';

  console.log('returning rObject :'+JSON.stringify(rObject));
  return rObject;
}

function mapDispatchToProps(dispatch) {
  // Whenever selectBook is called, the result shoudl be passed
  // to all of our reducers
  // console.log('In mapDispatchToProps');
  return bindActionCreators({
    saveComplianceData : saveComplianceData,
    getComplianceData : getComplianceData,
    getLinksWithCompanyIdAction  : getLinksWithCompanyIdAction,
    uploadDocumentRequest : uploadDocumentRequest
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(complianceForm);