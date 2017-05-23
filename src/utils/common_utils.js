import constants from './constants';
import moment from 'moment';
import sortJsonArray from 'sort-json-array';

exports.getTopThreeSectors = function(obj){
  let sList = [];
  let keys = Object.keys(obj);
  keys.forEach(function(key){
    if(key.startsWith('sector')){
      sList.push({
        sector : key,
        count : obj[key]
      });
    }
  });
  let sortedList = sortJsonArray(sList, 'count', 'des');
  return exports.getSectorDisplayName(sortedList[0].sector)
    +', '+ exports.getSectorDisplayName(sortedList[1].sector)
    +', '+ exports.getSectorDisplayName(sortedList[2].sector);
}

exports.getTopThreeProducts = function(obj){
  let sList = [];
  let keys = Object.keys(obj);
  keys.forEach(function(key){
    if(key.startsWith('struct')){
      sList.push({
        sector : key,
        count : obj[key]
      });
    }
  });
  let sortedList = sortJsonArray(sList, 'count', 'des');
  return exports.getProductDisplayName(sortedList[0].sector)
    +', '+ exports.getProductDisplayName(sortedList[1].sector)
    +', '+ exports.getProductDisplayName(sortedList[2].sector);
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
