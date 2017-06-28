import constants from './constants';
import moment from 'moment';
import sortJsonArray from 'sort-json-array';
import isNumber from 'is-number';
import numbro from 'numbro';

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
  // console.log('In sectors, sortedList :'+JSON.stringify(sortedList));
  return exports.getSectorDisplayName(sortedList[0].sector) + '('+Math.round(Number(sortedList[0].count * 100)/grandTotal)+'%)'
    +', '+ exports.getSectorDisplayName(sortedList[1].sector) + '('+Math.round(Number(sortedList[1].count * 100)/grandTotal)+'%)'
    +', '+ exports.getSectorDisplayName(sortedList[2].sector) + '('+Math.round(Number(sortedList[2].count * 100)/grandTotal)+'%)';
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
  // console.log('In products, sortedList :'+JSON.stringify(sortedList));
  return exports.getProductDisplayName(sortedList[0].sector) + '('+Math.round(Number(sortedList[0].count * 100)/grandTotal)+'%)'
    +', '+ exports.getProductDisplayName(sortedList[1].sector) + '('+Math.round(Number(sortedList[1].count * 100)/grandTotal)+'%)'
    +', '+ exports.getProductDisplayName(sortedList[2].sector) + '('+Math.round(Number(sortedList[2].count * 100)/grandTotal)+'%)';
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
			console.log('***ERR exception in sanitize the number, val:'+val+' , '+JSON.stringify(ex));
      return 0;
		}
  }
  else
    return 0;
}
