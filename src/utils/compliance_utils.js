import constants from './constants';

exports.getDisplayData = function(complianceData, cols){
    // console.log('In addRows');
    // console.log('cols:'+JSON.stringify(cols));
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
    // console.log('In addRows');
    // console.log('cols:'+JSON.stringify(cols));
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
    // console.log('dataArr:'+JSON.stringify(dataArr));
    return dataArr;
  }
  
  exports.getQuaterlyColoumns=function(typeCustomFormatter, isEditable){
    let cols=constants.COMPLIANCE_QUATERLY_COLS;
    cols[0].formatter = typeCustomFormatter;

    // set isEditable Flag
    if(isEditable){
      for(let i=1;i<cols.length;i++){
          cols[i].editable = true;
      }
    }
  
    return cols;
  }
  
  exports.getMonthlyColoumns=function(typeCustomFormatter, isEditable){
    let cols=constants.COMPLIANCE_MONTHLY_COLS;
    cols[0].formatter = typeCustomFormatter;

    // set isEditable Flag
    if(isEditable){
        for(let i=1;i<cols.length;i++){
            cols[i].editable = true;
        }
    }
    
    return cols;
  }

exports.getYearOptions=function(){
    return (
      [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
    );
}

exports.getYearToDisplay = function(yrString){
    let yr = yrString.substring(yrString.indexOf('_')+1);
    // console.log('getYearToDisplay :'+yr);
    return yr;
}