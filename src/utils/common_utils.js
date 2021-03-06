import React, { Component } from 'react';
import constants from './constants';
import moment from 'moment';
import sortJsonArray from 'sort-json-array';
import isNumber from 'is-number';
import numbro from 'numbro';
import numeral from 'numeral';
import roundTo from 'round-to';
import ioi_list from '../components/ioi_list';

exports.getCompanyId = function(cList, cName){
  if(cName && cList && cList.length > 0){
    return cList.find((company)=> company.companyName == cName);
  }
  return null;
}

exports.condensedCompanyList = function(cList){
  return cList.map((company) => {
    return company.companyName;
  });
}

exports.getMsgNameForAccess = function(type){
  if(type === constants.KEY_ACCESS_CONTROL_DEAL_TEAM){
    return constants.MESSAGES.ACCESS_DEAL_TEAM;
  } else if(type === constants.KEY_ACCESS_CONTROL_QCOMPLIANCE){
    return constants.MESSAGES.ACCESS_QUATERLY_COMPLIANCE;
  } else if(type === constants.KEY_ACCESS_CONTROL_DOCUMENTS){
    return constants.MESSAGES.ACCESS_DOCUMENTS;
  } else if(type === constants.KEY_ACCESS_CONTROL_WGL){
    return constants.MESSAGES.ACCESS_WGL;
  } 
  return null;
}

exports.formatCurrencyToDisplay=function(amt){
  return numeral(amt).format('($0,0.00)');
}

exports.formatPercentToDisplay=function(val){
  return numeral(val/100).format('(%0,0.00)');
}

exports.formatCurrencyToDisplayAsElement = function(amt){
  return(<span>{exports.formatCurrencyToDisplay(amt)}</span>);
}

exports.formatPercentToDisplayAsElement = function(val){
  return(<span>{exports.formatPercentToDisplay(val)}</span>);
}

exports.getNameToDisplayInSidebar = function(fullName){
  let firstName = fullName.substring(0, fullName.indexOf(' '));
  if(firstName.length > 7){
    return firstName.substring(0, 7);
  } else {
    return firstName;
  }
}

exports.computeDocumentsTabDisabled = function(a2lDocuments, role){
  return (!a2lDocuments
    && (role !== constants.KEY_COMPANY 
      && role !== constants.KEY_FINANCIAL_SPONSOR));
}

exports.updateAccessControll = function(type, alObject){
  alObject[type] = !alObject[type];
  return alObject;
}

exports.extractLenderNames = function(list){
  let lenderMap = [];
  for(let i=0;i< list.length; i++){
    lenderMap.push({
      id: list[i].lenderCompanyId,
      name : list[i].name,
      accessToLender : list[i].accessToLender
    });
  }
  return lenderMap;
}

exports.getDisplayData = function(complianceData, cols){
  let dataArr=[];
  for(let i=0; i<constants.QCOMPLIANCE_ROWS.length;i++){
    let qrow = {};
    for(let j=0;j<cols.length; j++){
      qrow[cols[j].key] = (complianceData[i])[cols[j].key];
    }
    dataArr.push(qrow);
  }
  return dataArr;
}

exports.initComplianceData=function(cols){
  let dataArr=[];
  for(let i=0; i<constants.QCOMPLIANCE_ROWS.length;i++){
    let qrow = {};
    for(let j=0;j<cols.length; j++){
      if(cols[j].key === 'type')
        qrow[cols[j].key] = constants.QCOMPLIANCE_ROWS[i].name;
      else
        qrow[cols[j].key] = 0;
    }
    dataArr.push(qrow);
  }
  return dataArr;
}

exports.getQuaterlyColoumns=function(typeCustomFormatter){
  let cols=constants.COMPLIANCE_QUATERLY_COLS;
  cols[0].formatter = typeCustomFormatter;
  return cols;
}

exports.getMonthlyColoumns=function(typeCustomFormatter){
  let cols=constants.COMPLIANCE_MONTHLY_COLS;
  cols[0].formatter = typeCustomFormatter;
  return cols;
}

exports.maskCompanyName = function(clist, ioiList){
  let counter = 1;
  if(clist && clist.length > 0){
    for(var i=0; i< clist.length; i++){
      clist[i].companyName = 'Lender '+counter;
      counter++;
    }
  }
  return clist;
}

exports.getQuaterObject = function(period, startYear, startQtr){
  let qtrObject = {}, _startQtr = startQtr;
  for(let i=0; i<(period * 4); i++){
    if(i===0 || _startQtr % 4 === 1){
      qtrObject[startYear] = [];
      startYear++;
    }
    _startQtr++;
  }

  let sumOfQtrs = 0;
  let yrsArr = Object.keys(qtrObject);
  for(let j=0; j< yrsArr.length; j++){
    let numOfQtrInThisYear = 4;
    let rStartQtr = 1
    // calculate the number of qtr in this year
    if(j===0){
      numOfQtrInThisYear = 5-startQtr;
      rStartQtr = startQtr;
    } else if(j===yrsArr.length-1){
      numOfQtrInThisYear = (period*4) - sumOfQtrs;
    }
    sumOfQtrs = sumOfQtrs+numOfQtrInThisYear;

    for(let k=rStartQtr;k<(numOfQtrInThisYear+rStartQtr);k++){
      qtrObject[yrsArr[j]].push(k);
    }
  }
  return qtrObject;
}

exports.didValuesChange = function(object1, object2){
  let changed=false;
  if(Object.keys(object1).length !== Object.keys(object2).length)
    changed = true;

  let keys = Object.keys(object1);
  for(let i=0;i<keys.length;i++){
    if(object1[keys[i]] !== object2[keys[i]])
      changed = true;
  }
  return changed;
}


exports.getS3Filename = function(url){
  if(url){
    let idx = url.lastIndexOf('/');
    return url.substring(idx+1);
  }
  return null;
}

exports.getFileName = function(type, list){
  if(list){
    if(list.length > 0){
      for(let i=0; i<list.length; i++){
        if(list[i].type === type){
          return list[i].originalFileName;
        }
      }
    } else { // its an element
      let ele = list;
      if(ele.type === type){
        return ele.originalFileName;
      }
    }
  }
}

exports.getProductCategories = function(ioiList, companyList){
  let prdCatMap = {};
  for(let ioi of ioiList){
    if(prdCatMap[ioi.loanStructure]){
      prdCatMap[ioi.loanStructure].push(exports.getCompanyNameById(ioi.createdByCompanyId, companyList));
    } else {
      prdCatMap[ioi.loanStructure] = [exports.getCompanyNameById(ioi.createdByCompanyId, companyList)];
    }
  }
  return prdCatMap;
}

exports.getCompanyNameById = function(id, cmpyList){
  for(let company of cmpyList){
    if(company.companyId === id)
      return company.companyName;
  }
  return null;
}

exports.getTopThreeSectors = function(obj, grandTotal){
  let sList = [];
  let keys = Object.keys(obj);
  keys.forEach(function(key){
    sList.push({
      sector : key,
      count : Number(obj[key])
    });
  });
  let sortedList = sortJsonArray(sList, 'count', 'des');
  return exports.getSectorDisplayName(sortedList[0].sector) + ' ('+Math.round(Number(sortedList[0].count * 100)/grandTotal)+'%)'
    +', '+ exports.getSectorDisplayName(sortedList[1].sector) + ' ('+Math.round(Number(sortedList[1].count * 100)/grandTotal)+'%)'
    +', '+ exports.getSectorDisplayName(sortedList[2].sector) + ' ('+Math.round(Number(sortedList[2].count * 100)/grandTotal)+'%)';
}

exports.getTopThreeProducts = function(obj, grandTotal){
  let sList = [];
  let keys = Object.keys(obj);
  keys.forEach(function(key){
    sList.push({
      sector : key,
      count : Number(obj[key])
    });
  });
  let sortedList = sortJsonArray(sList, 'count', 'des');
  return exports.getProductDisplayName(sortedList[0].sector) + ' ('+Math.round(Number(sortedList[0].count * 100)/grandTotal)+'%)'
    +', '+ exports.getProductDisplayName(sortedList[1].sector) + ' ('+Math.round(Number(sortedList[1].count * 100)/grandTotal)+'%)'
    +', '+ exports.getProductDisplayName(sortedList[2].sector) + ' ('+Math.round(Number(sortedList[2].count * 100)/grandTotal)+'%)';
}

exports.getSectorDisplayName = function(name){
  return constants.SECTOR_MAP[name];
}

exports.getProductDisplayName = function(name){
  return constants.PRODUCT_MAP[name];
}

exports.getDisplayValue = function(key){
  var val = constants.DISPLAY_VALUES_MAP[key];
  return val===undefined ? key : val;
}

exports.getCompanyNameFromList = function(key, list){
  for(var i=0; i<list.length; i++){
    if(list[i].companyId === key)
      return list[i].companyName;
  }
  return 'N/A';
}

exports.daysBetween = function(d1, d2){
    //Get 1 day in milliseconds
    var one_day=1000*60*60*24;

    // Calculate the difference in milliseconds
    var difference_ms = d1 - d2;

    // Convert back to days and return
    return Math.round(difference_ms/one_day);
}

exports.computeStatus = function(expiryDt){
    let now = new Date();
    let diffInDays = exports.daysBetween(moment(expiryDt), now);
    if( diffInDays > 7){
      return 'Open';
    } else {
      return 'T+'+diffInDays;
    }
  }

exports.parseNumber = (val)=>{
  if(val){
    try{
			if(isNumber(val)){
				return numbro().unformat(val);
			} else if(val.indexOf('%') > -1){
				return numbro().unformat(val) * 100;
			} else {
				return numbro().unformat(val);
			}
		} catch(ex){
      return 0;
		}
  }
  else
    return 0;
}
