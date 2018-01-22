import cUtils from './common_utils';
import { min } from 'moment';
import arraySort from 'array-sort';

exports.makeClubDealList = function(list, rfp){
  // console.log('list : '+ JSON.stringify(list));
  let condensedList = getCondensedList(list);
  // console.log('condensedList :'+JSON.stringify(condensedList));
  if(isEligibleForClub(condensedList, rfp)){
    // console.log('It is eligible for club deal, lets make it');
    let lenderCombinationList = combineLendersForClub(list, rfp);
    if(lenderCombinationList.length === 0){
      // console.log('none of the lenders can be combined, returning empty');
      return null;
    } else {
      // console.log('got the list of lender combinations');
      // sort them by yield and return
      // console.log('lenderCombinationList :'+JSON.stringify(lenderCombinationList));
      return arraySort(lenderCombinationList, 'yield');
    }
  } else {
    // console.log('its not eligible for club, lets exit');
    return null;
  }
}


function combineLendersForClub(list, rfp){
  let clubList = [];
  let rBucket = [], tlBucket=[];
  for(let i=0; i< list.length; i++){
    let ioi = list[i];
    if(ioi.loanStructure.toLowerCase().indexOf('Revolver'.toLowerCase()) >= 0){
      // console.log('got a revolver');
      rBucket.push(ioi);
    } else if(ioi.loanStructure.toLowerCase().indexOf('Term Loan'.toLowerCase()) >= 0
        || ioi.loanStructure.toLowerCase().indexOf('Both'.toLowerCase()) >= 0){
      // console.log('got a term loan or both');
      tlBucket.push(ioi);
    }
  }

  if(rBucket.length > 0 && tlBucket.length > 0){
    // console.log('need to combine revolvers and termloans');
    let minRevolver = rBucket[getIOIWithMinValue('yield', rBucket)];
    for(let i=0; i<tlBucket.length; i++){
      if(minRevolver.loanSize + tlBucket[i].loanSize >= rfp.dealSize){
        clubList.push(getClubDealObject(minRevolver, tlBucket[i]));
      }
    }
  } else if(rBucket.length === 0 && tlBucket.length > 1){
    for(let i=0; i<(tlBucket.length-1); i++){
      if(minRevolver.loanSize + tlBucket[i].loanSize >= rfp.dealSize){
        clubList.push(getClubDealObject(tlBucket[i], tlBucket[i+1]));
      }
    }
    // console.log('need to combine termLoans only');
  }
  return clubList;
}

function getClubDealObject(lender1, lender2){
  let combinedLoanSize = lender1.loanSize + lender2.loanSize;
  let combinedYield = ((lender1.loanSize / combinedLoanSize) * lender1.yield)
    + ((lender2.loanSize / combinedLoanSize) * lender2.yield);
  let clubObject = {
    yield : combinedYield,
    loanSize : combinedLoanSize,
    lenders : [
      lender1.createdByCompanyId,
      lender2.createdByCompanyId
    ]
  };
  // console.log('clubObject :'+ JSON.stringify(clubObject));
  return clubObject;
}

function getIOIWithMinValue(field, list){
  let minValue = 100, minValueIndex = 0;
  for(let i=0; i< list.length; i++){
    if((list[i])[field] < minValue){
      minValue = (list[i])[field];
      minValueIndex = i;
    }
  }
  return minValueIndex;
}

function isEligibleForClub(list, rfp){
  // console.log('checking if its eligible, list : '+JSON.stringify(list));
  if(list.length === 1
    || !hasTermLoan(list)){
    return false;
  } else {
    return true;
  }
}

function hasTermLoan(list){
  for(let i=0; i< list.length; i++){
    if(list[i].loanStructure.toLowerCase().indexOf('ABL-Both'.toLowerCase()) >= 0
      || list[i].loanStructure.toLowerCase().indexOf('ABL-Term Loan'.toLowerCase()) >= 0 
      || list[i].loanStructure.toLowerCase().indexOf('CashFlow-Term Loan'.toLowerCase()) >= 0 
      || list[i].loanStructure.toLowerCase().indexOf('CashFlow-Both'.toLowerCase()) >= 0 )
      return true;
  }
  return false;
}

function getCondensedList(list){
  let condensedList = [];
  for(let i=0; i<list.length; i++){
    if((list[i].warrants && list[i].warrants.toLowerCase() === 'no')
      || !list[i].warrants){
      let obj = {
        loanSize : list[i].loanSize,
        yield : list[i].yield,
        loanStructure : list[i].loanStructure
      };
      condensedList.push(obj);
    }
  }
return condensedList;
}

exports.getTotalGross = function(rfp){
    let totalGross = cUtils.parseNumber(rfp.acctRecvGrossAmt)
        + cUtils.parseNumber(rfp.invtryGrossAmt)
        + cUtils.parseNumber(rfp.ppeGrossAmt)
        + cUtils.parseNumber(rfp.maeGrossAmt)
        + cUtils.parseNumber(rfp.realEstGrossAmt)
        + cUtils.parseNumber(rfp.otherGrossAmt);
    return totalGross;
}

exports.getCollataralArr = function(rfp, collateral){
    let collateralArr = {
        acctReceivable : {
          gross         : cUtils.parseNumber(rfp.acctRecvGrossAmt),
          ineligible    : 0,
          netCollateral : collateral ? ((100 - cUtils.parseNumber(collateral.acctReceivable.ineligible)) * (cUtils.parseNumber(rfp.acctRecvGrossAmt)) / 100) : 0,
          advRate       : 0,
          available     : collateral ? (cUtils.parseNumber(collateral.acctReceivable.netCollateral) * cUtils.parseNumber(collateral.acctReceivable.advRate) / 100) : 0,
          netEffective  : collateral ? (cUtils.parseNumber(collateral.acctReceivable.available) / (cUtils.parseNumber(rfp.acctRecvGrossAmt))) : 0
        },
        inventry : {
          gross         : cUtils.parseNumber(rfp.invtryGrossAmt),
          ineligible    : 0,
          netCollateral : collateral ? ((100 - cUtils.parseNumber(collateral.inventry.ineligible)) * (cUtils.parseNumber(rfp.invtryGrossAmt)) / 100) : 0,
          advRate       : 0,
          available     : collateral ? (cUtils.parseNumber(collateral.inventry.netCollateral) * cUtils.parseNumber(collateral.inventry.advRate) / 100) : 0,
          netEffective  : collateral ? (cUtils.parseNumber(collateral.inventry.available) / (cUtils.parseNumber(rfp.invtryGrossAmt))) : 0
        },
        ppe : {
          gross         : cUtils.parseNumber(rfp.ppeGrossAmt),
          ineligible    : 0,
          netCollateral : collateral ? ((100 - cUtils.parseNumber(collateral.ppe.ineligible)) * (cUtils.parseNumber(rfp.ppeGrossAmt)) / 100) : 0,
          advRate       : 0,
          available     : collateral ? (cUtils.parseNumber(collateral.ppe.netCollateral) * cUtils.parseNumber(collateral.ppe.advRate) / 100) : 0,
          netEffective  : collateral ? (cUtils.parseNumber(collateral.ppe.available) / (cUtils.parseNumber(rfp.ppeGrossAmt))) : 0
        },
        mae : {
          gross         : cUtils.parseNumber(rfp.maeGrossAmt),
          ineligible    : 0,
          netCollateral : collateral ? ((100 - cUtils.parseNumber(collateral.mae.ineligible)) * (cUtils.parseNumber(rfp.maeGrossAmt)) / 100) : 0,
          advRate       : 0,
          available     : collateral ? (cUtils.parseNumber(collateral.mae.netCollateral) * cUtils.parseNumber(collateral.mae.advRate) / 100) : 0,
          netEffective  : collateral ? (cUtils.parseNumber(collateral.mae.available) / (cUtils.parseNumber(rfp.maeGrossAmt))) : 0
        },
        realEst : {
          gross         : cUtils.parseNumber(rfp.realEstGrossAmt),
          ineligible    : 0,
          netCollateral : collateral ? ((100 - cUtils.parseNumber(collateral.realEst.ineligible)) * (cUtils.parseNumber(rfp.realEstGrossAmt)) / 100) : 0,
          advRate       : 0,
          available     : collateral ? (cUtils.parseNumber(collateral.realEst.netCollateral) * cUtils.parseNumber(collateral.realEst.advRate) / 100) : 0,
          netEffective  : collateral ? (cUtils.parseNumber(collateral.realEst.available) / (cUtils.parseNumber(rfp.realEstGrossAmt))) : 0
        },
        other : {
          gross         : cUtils.parseNumber(rfp.otherGrossAmt),
          ineligible    : 0,
          netCollateral : collateral ? ((100 - cUtils.parseNumber(collateral.other.ineligible)) * (cUtils.parseNumber(rfp.otherGrossAmt)) / 100) : 0,
          advRate       : 0,
          available     : collateral ? (cUtils.parseNumber(collateral.other.netCollateral) * cUtils.parseNumber(collateral.other.advRate) / 100) : 0,
          netEffective  : collateral ? (cUtils.parseNumber(collateral.other.available) / (cUtils.parseNumber(rfp.otherGrossAmt))) : 0
        }
      };    
    return collateralArr;
}


let testIOIList = [{"loanSize":125000000,"liborFloor":6,"createdById":"6609a826-8c8b-4999-a64d-602b7a84acb1","cpYear5":2,"pikIntreset":2.5,"forCompanyId":"2c539f66-4c14-48a6-9a1e-9f726621db84","cpYear3":2,"cpYear4":2,"cpYear1":2,"cpYear2":2,"maxDebtAllowed":100000000,"warrants":"Yes","governance":"Yes","yield":15.09,"timestamp":"2018-01-14T18:08:30.654Z","covenants":"MIn Excess Ability","upfrontFee":4.5,"maturity":5,"ioiId":"e4333968-2207-4f14-9bab-18077be997b1","tranche":"Delayed Draw","loanStructure":"ABL-Revolver","year3":5,"year2":1,"year5":2,"year4":5,"cashInterest":5.3,"rfpId":"eb4526f9-392c-4b81-bdeb-e4db06c36f2f","createdByCompanyId":"b056872c-d956-4f49-9078-0101c6039a90","year1":5}];
let testRFP = {"numOfIOI":1,"expiryYearMonth":201801,"maeComment":"N/A","expiryDt":"2018-01-31T08:00:00.000Z","otherGrossAmt":0,"ppeGrossAmt":0,"sector":"IT","createdById":"05bec37d-77f9-4ad8-be12-352449e78f07","isSponsored":"no","ppeComment":"N/A","companyDesc":"dsnfdnmlk","otherComment":"N/A","tenor":5,"acctRecvComment":"N/A","realEstGrossAmt":0,"region":"West Coast","invtryComment":"N/A","dealSize":100000000,"product":"Revolver","ltmEbitda":30000,"companyName":"My company 1","maeGrossAmt":0,"timestamp":"2018-01-10T04:51:40.400Z","ltmRevenue":25000,"contactId":"09e25b2e-73cf-4777-98d4-813de8c3dd5f","invtryGrossAmt":0,"acctRecvGrossAmt":0,"realEstComment":"N/A","requestType":"M&A","category":"Open","txnOverview":"efhklnklmlk","createdByCompanyId":"2c539f66-4c14-48a6-9a1e-9f726621db84","rfpId":"eb4526f9-392c-4b81-bdeb-e4db06c36f2f","createdByCompanyName":"Katy Industries","createdByName":"John Smith Jr.","contactObject":{"phoneNumber":"756347764586","contactId":"09e25b2e-73cf-4777-98d4-813de8c3dd5f","fullName":"Ramone U","email":"ramon.u@yopmail.com","contactRole":"CFO","timestamp":"2018-01-10T04:51:40.245Z"}};

exports.makeClubDealList(testIOIList, testRFP);