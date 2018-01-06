
exports.getMsgListData = function(msgLink, currContactId){
    let msgListObject = {};
    msgListObject.timestamp = msgLink.msgLink.timestamp;
    msgListObject.messageId = msgLink.msgLink.messageId;

    let contactList = Object.keys(msgLink.groupMap.contactCompanyMap);
    let contactNames = null, companyNames = null, comma;
    for(let i=0; i< contactList.length; i++){
        if(contactList[i] !== currContactId){
            if(!contactNames)
                contactNames = msgLink.contactMap[contactList[i]];
            else 
                contactNames = contactNames+', '+msgLink.contactMap[contactList[i]];

            // company names
            if(!companyNames)
                companyNames = msgLink.companyMap[msgLink.groupMap.contactCompanyMap[contactList[i]]];
            else 
                companyNames = companyNames+', '+msgLink.companyMap[msgLink.groupMap.contactCompanyMap[contactList[i]]];
        }
    }
    msgListObject.contactNames = contactNames;
    msgListObject.companyNames = companyNames;    
    // console.log('msgListObject :'+JSON.stringify(msgListObject));

    return msgListObject;
}

exports.getContactId = function(val, list){
    let ltIndex = val.indexOf('<');
    let name = val.substring(0, ltIndex);
    // console.log('name :'+name);
    let companyName = val.substring(ltIndex+1, val.length-1);
    // console.log('companyName :'+companyName);
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