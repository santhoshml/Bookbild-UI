import constants from './constants';
import moment from 'moment';

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
