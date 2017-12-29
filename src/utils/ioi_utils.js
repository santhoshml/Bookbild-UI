import cUtils from './common_utils';

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