
exports.getContactId = function(val, list){
    let ltIndex = val.indexOf('<');
    let name = val.substring(0, ltIndex);
    console.log('name :'+name);
    let companyName = val.substring(ltIndex+1, val.length-1);
    console.log('companyName :'+companyName);
    for(let i=0; i< list.length; i++){
        var contact = list[i];
        if(contact.fullName === name)
            return contact.contactId;
    }
    return null;
}

exports.getCompanyId = function(contactId, list){
    for(let i=0; i< list.length; i++){
        if(list[i].contactId === contactId){
            return list[i].companyId;
        }
    }
}