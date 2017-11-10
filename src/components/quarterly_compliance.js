import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { Link } from "react-router-dom";
import lsUtils from '../utils/ls_utils';
import cUtils from '../utils/common_utils';
import constants from '../utils/constants';
import NavBar from './sidebar';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/index';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import DataGrid from './data_grid_example';
import Header from './header';

export default class DocumentForm extends Component{

	constructor(props){
		super(props);
		console.log('I am in constructor');
		this.state = {
			user : null,
			company : null
		};
	}

	componentWillMount() {
		console.log('I am in documents.componentWillMount');
		let user = lsUtils.getValue(constants.KEY_USER_OBJECT);
    let company = lsUtils.getValue(constants.KEY_COMPANY_OBJECT);
		this.setState({
			user : user,
			company : company
		});
	}

  getColoumns(qtrArr){
    // console.log('num:'+num+', start:'+start);
    let colArr= [{
      key: 'complianceCert',
      name: 'Compliance Certificate',
      locked: true
    }];
    qtrArr.map(function(qtr){
      colArr.push({
        key: qtr+'Q',
        name: qtr+'Q',
        editable : true
      });
    });
    return colArr;
  }

  handleGridRowsUpdated({ fromRow, toRow, updated }) {
    console.log('fromRow:'+fromRow+', toRow:'+toRow+', updated:'+JSON.stringify(updated));

  }

  updateWithDisplayData(qtrArr){
    console.log('In updateWithDisplayData');
    let dataArr=[];
    for(let i=0; i<constants.QCOMPLIANCE_ROWS.length;i++){
      let qrow = { complianceCert : constants.QCOMPLIANCE_ROWS[i] };

      qtrArr.map(function(qtr){
        qrow[qtr+'Q'] = 0;
      });
      dataArr.push(qrow);
    }
    console.log('dataArr:'+JSON.stringify(dataArr));
    return dataArr;
  }

  onClickTab(year){
    console.log('In onClickTab, year:'+year);
  }

  displayYears(qtrMatrix){
    var that=this;
    let yrsArr = Object.keys(qtrMatrix);
    return yrsArr.map(function(year){
      return (<Tab key={year} onClick={that.onClickTab.bind(that, year)}>{year}</Tab>)
    });
  }

  displayTabPanel(qtrMatrix){
    let that=this;
    let yrsArr = Object.keys(qtrMatrix);
    return yrsArr.map(function(year){
      return (
        <TabPanel key={year}>
          <DataGrid
            columns={that.getColoumns(qtrMatrix[year])}
            dataList={that.updateWithDisplayData(qtrMatrix[year])}
            clickableRow="false"
            onGridRowsUpdated={that.handleGridRowsUpdated}
            />
        </TabPanel>
      );
    });
  }

	render(){
		console.log('I am in documents.render');

    let numOfYears = 3;
    let startYear = 2016;
    let startQtr = 2;
    let qtrMatrix = cUtils.getQuaterObject(numOfYears, startYear, startQtr);

		if(this.state.user.role === 'Company'){
			console.log('forwading to borrower Document form');
			return (
        <div>
          <Header/>
          <div style={{ display: 'flex' }}>
            <NavBar history={this.props.history}/>        
            <div className="container main-container-left-padding" >
              <br/>
              <br/>
              <h3>Quaterly Compliance</h3>
              <Tabs>
                <TabList>{this.displayYears(qtrMatrix)}</TabList>
                {this.displayTabPanel(qtrMatrix)}
              </Tabs>
            </div>
          </div>
        </div>
			);
		} else {
			console.log('forwading to Non-borrower Document form');
			return (
        <div>
          <Header/>
          <div style={{ display: 'flex' }}>
          <NavBar history={this.props.history}/>
            <div className="container main-container-left-padding" >
              <h3>Quaterly Compliance</h3>

            </div>
          </div>
        </div>
			);
		}
	}
}
