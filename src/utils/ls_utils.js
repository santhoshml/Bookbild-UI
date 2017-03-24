import ls from 'local-storage';

exports.setValue = function(key, value){
  ls.set(key, value);
  return;
}

exports.getValue = function(key){
  return ls.get(key);
}
