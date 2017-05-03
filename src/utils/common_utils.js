import constants from './constants';

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
