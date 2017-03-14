import ls from 'local-storage';

exports.set = function(key, value){
  ls.set(key, value);
  return;
}
