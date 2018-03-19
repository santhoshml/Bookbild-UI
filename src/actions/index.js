import axios from 'axios';

export const REGISTER_COMPANY = 'REGISTER_COMPANY';
export const LOGIN = 'LOGIN';
export const CREATE_RFP = 'CREATE_RFP';
export const UPDATE_RFP = 'UPDATE_RFP';
export const UPDATE_IOI = 'UPDATE_IOI';
export const FETCH_ALL_RFP = 'FETCH_ALL_RFP';
export const FETCH_RFP = 'FETCH_RFP';
export const FETCH_IOI = 'FETCH_IOI';
export const FETCH_ADDRESS = 'FETCH_ADDRESS';
export const FETCH_CONTACT = 'FETCH_CONTACT';
export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE';
export const ADD_USER = 'ADD_USER';
export const FETCH_USER_LIST = 'FETCH_USER_LIST';
export const ADD_RFP_TO_FAVORITES = 'ADD_RFP_TO_FAVORITES';
export const REMOVE_RFP_FROM_FAVORITES = 'REMOVE_RFP_FROM_FAVORITES';
export const GET_RFP_FROM_FAVORITES = 'GET_RFP_FROM_FAVORITES';
export const CREATE_IOI = 'CREATE_IOI';
export const FETCH_IOI_LIST_FOR_RFP = 'FETCH_IOI_LIST_FOR_RFP';
export const FETCH_IOI_LIST_FOR_COMPANY = 'FETCH_IOI_LIST_FOR_COMPANY';
export const FETCH_FAV_RFP_LIST = 'FETCH_FAV_RFP_LIST';
export const FETCH_COMPANY_RFP_LIST = 'FETCH_COMPANY_RFP_LIST';
export const FETCH_TERM_SHEET_ACTIVITY_STATS = 'FETCH_TERM_SHEET_ACTIVITY_STATS';
export const FETCH_COMPANY_LIST_FOR_RFP = 'FETCH_COMPANY_LIST_FOR_RFP';
export const CREATE_PITCH = 'CREATE_PITCH';
export const RESET_TERMSHEET_ACTIVITY = 'RESET_TERMSHEET_ACTIVITY';
export const GET_IOI_FOR_RFP_COMPANY = 'GET_IOI_FOR_RFP_COMPANY';
export const INVITE_LENDER = 'INVITE_LENDER';
export const GET_WGL_BY_COMPANYID = 'GET_WGL_BY_COMPANYID';
export const GET_WGL_BY_LINKID = 'GET_WGL_BY_LINKID';
export const ADD_CONTACT_TO_WGL = 'ADD_CONTACT_TO_WGL';
export const DELETE_CONTACT_FROM_WGL  = 'DELETE_CONTACT_FROM_WGL';
export const UPDATE_CONTACT_CELL_WGL  = 'UPDATE_CONTACT_CELL_WGL';
export const UPLOAD_FILE_TO_S3        = 'UPLOAD_FILE_TO_S3';
export const GET_LINK_DOCS_WITH_RFP_ID = 'GET_LINK_DOCS_WITH_RFP_ID';
export const DELETE_LINK_DOCUMENT  = 'DELETE_LINK_DOCUMENT';
export const GET_LINK_DOCUMENT = 'GET_LINK_DOCUMENT';
export const GET_LINKS_WITH_COMPANYID = 'GET_LINKS_WITH_COMPANYID';
export const GET_LINKS_DOCS_WITH_RFP_IOI = 'GET_LINKS_DOCS_WITH_RFP_IOI';
export const GET_LINKS_DOCS_WITH_RFP_IOI_COMPANY = 'GET_LINKS_DOCS_WITH_RFP_IOI_COMPANY';
export const GET_LINKS_DOCS_WITH_LINK = 'GET_LINKS_DOCS_WITH_LINK';
export const SAVE_DEAL_COMPARISION_DATA = 'SAVE_DEAL_COMPARISION_DATA';
export const SEND_CONTACT_US_EMAIL = 'SEND_CONTACT_US_EMAIL';
export const SAVE_COMPLIANCE_DATA = 'SAVE_COMPLIANCE_DATA';
export const GET_COMPLIANCE_DATA = 'GET_COMPLIANCE_DATA';
export const GET_BORROWER_CONTROLLED_ACCESS_LIST = 'GET_BORROWER_CONTROLLED_ACCESS_LIST';
export const UPDATE_ACCESS_TO_LENDER_FLAG = 'UPDATE_ACCESS_TO_LENDER_FLAG';
export const GET_LINKS_WITH_IOI = 'GET_LINKS_WITH_IOI';
export const GET_COMPLIANCE_DATA_WITH_LINKID = 'GET_COMPLIANCE_DATA_WITH_LINKID';
export const CREATE_FINAL_TERM = 'CREATE_FINAL_TERM';
export const GET_FINAL_TERM_BY_IOI = 'GET_FINAL_TERM_BY_IOI';
export const GET_FINAL_TERM_WITH_YIELD_MATRIX = 'GET_FINAL_TERM_WITH_YIELD_MATRIX';
export const FETCH_FINAL_TERM_LIST_FOR_COMPANY = 'FETCH_FINAL_TERM_LIST_FOR_COMPANY';
export const SEND_INVITE_COMPANY_EMAIL = 'SEND_INVITE_COMPANY_EMAIL';
export const FETCH_LINK_DOCS_WITH_FINAL_TERM_ID = 'FETCH_LINK_DOCS_WITH_FINAL_TERM_ID';
export const GET_LINK_WITH_FINAL_TERM = 'GET_LINK_WITH_FINAL_TERM';
export const MARK_AS_EXECUTED = 'MARK_AS_EXECUTED';
export const GET_CONTACT_LIST = 'GET_CONTACT_LIST';
export const POST_NEW_MSG = 'POST_NEW_MSG';
export const GET_ALL_MESSAGES_FOR = 'GET_ALL_MESSAGES_FOR';
export const GET_MESSAGE_LIST = 'GET_MESSAGE_LIST';
export const APPEND_TO_MSG_LIST = 'APPEND_TO_MSG_LIST';
export const UPDATE_USER = 'UPDATE_USER';
export const UPDATE_CONTACT = 'UPDATE_CONTACT';
export const UPDATE_ADDRESS = 'UPDATE_ADDRESS';
export const SEND_MSG_FROM_ADMIN = 'SEND_MSG_FROM_ADMIN';
export const GET_FINAL_TERM = 'GET_FINAL_TERM';
export const UPDATE_FINAL_TERM = 'UPDATE_FINAL_TERM';
export const REVOKE_IOI = 'REVOKE_IOI';
export const DELETE_IOI = 'DELETE_IOI';
export const DELETE_FINAL_TERM = 'DELETE_FINAL_TERM';
export const FETCH_FT_LIST_FOR_RFP = 'FETCH_FT_LIST_FOR_RFP';
export const GET_DASHBOARD_STATS = 'GET_DASHBOARD_STATS';
export const GET_LINKS_WITH_RFP = 'GET_LINKS_WITH_RFP';
export const GET_ALL_KEY_STATS = 'GET_ALL_KEY_STATS';
export const INVITE_OTHER_LENDERS_FOR_DEAL = 'INVITE_OTHER_LENDERS_FOR_DEAL';


export const FETCH_POSTS = "fetch_posts";
export const FETCH_POST = "fetch_post";
export const CREATE_POST = "create_post";
export const DELETE_POST = "delete_post";

const USE_CACHE = false;

// const ROOT_URL = 'http://127.0.0.1:1127';
const ROOT_URL = 'https://services.bookbild.com';

export function inviteOtherLendersToTheDeal(props){
  console.log(`props : ${JSON.stringify(props, null, 2)}`);
  const request=axios({
    url : '/inviteOtherLendersToTheDeal',
    method : 'POST',
    baseURL : ROOT_URL,
    data : props
  });

  return{
    type: INVITE_OTHER_LENDERS_FOR_DEAL,
    payload: request
  }  
}

export function getAllStatsAction(){
  const request=axios({
    url : '/getAllKeyStats',
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_ALL_KEY_STATS,
    payload: request
  }  
}

export function getLenderStatsForDashboard(companyId, userId){
  const request=axios({
    url : '/getLenderStatsForDashboard?companyId='+companyId+'&userId='+userId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_DASHBOARD_STATS,
    payload: request
  }  
}

export function getBorrowerStatsForDashboard(companyId, userId){
  const request=axios({
    url : '/getBorrowerStatsForDashboard?companyId='+companyId+'&userId='+userId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_DASHBOARD_STATS,
    payload: request
  }  
}

export function deleteFTAction(ftId){
  const request=axios({
    url : '/deleteFinalTerm?finalTermId='+ ftId,
    method : 'DELETE',
    baseURL : ROOT_URL
  });

  return{
    type: DELETE_FINAL_TERM,
    payload: request
  }
}

export function deleteIOIAction(ioiId){
  const request=axios({
    url : '/deleteIOI?ioiId='+ ioiId,
    method : 'DELETE',
    baseURL : ROOT_URL
  });

  return{
    type: DELETE_IOI,
    payload: request
  }
}

export function sendAMsgFromAdminWithCompanyIdAndCompanyName(props){
  const request=axios({
    url : '/sendAMsgFromAdminWithCompanyIdAndCompanyName',
    method : 'POST',
    baseURL : ROOT_URL,
    data : props
  });

  return{
    type: SEND_MSG_FROM_ADMIN,
    payload: request
  }
}

export function revokeIOI(ioiId){
  const request=axios({
    url : '/revokeIOI?ioiId='+ ioiId,
    method : 'DELETE',
    baseURL : ROOT_URL
  });

  return{
    type: REVOKE_IOI,
    payload: request
  }
}

export function sendAMsgFromAdmin(props){
  const request=axios({
    url : '/sendAMsgFromAdmin',
    method : 'POST',
    baseURL : ROOT_URL,
    data : props
  });

  return{
    type: SEND_MSG_FROM_ADMIN,
    payload: request
  }
}

export function sendAMsgFromAdminWithCompanyId(props){
  const request=axios({
    url : '/sendAMsgFromAdminWithCompanyId',
    method : 'POST',
    baseURL : ROOT_URL,
    data : props
  });

  return{
    type: SEND_MSG_FROM_ADMIN,
    payload: request
  }
}

export function appendToMsgList(props){
  const request=axios({
    url : '/appendToMsgList',
    method : 'POST',
    baseURL : ROOT_URL,
    data : props
  });

  return{
    type: APPEND_TO_MSG_LIST,
    payload: request
  }
}

export function getMsgListAction(messageId){
  const request=axios({
    url : '/getMsgList?messageId='+messageId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_MESSAGE_LIST,
    payload: request
  }
}

export function fetchAllMessagesForAction(contactId){
  const request=axios({
    url : '/getAllMessagesFor?contactId='+contactId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_ALL_MESSAGES_FOR,
    payload: request
  }
}

export function postNewMsgAction(props){
  const request=axios({
    url : '/postNewMsg',
    method : 'POST',
    baseURL : ROOT_URL,
    data : props
  });

  return{
    type: POST_NEW_MSG,
    payload: request
  }
}

export function fetchAllContactsToMessageAction(){
  const request=axios({
    url : '/fetchAllContactsToMessage',
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_CONTACT_LIST,
    payload: request
  }
}

export function markDealAsExecutedAction(props){
  const request=axios({
    url : '/markDealAsExecuted',
    method : 'POST',
    baseURL : ROOT_URL,
    data : props
  });

  return{
    type: MARK_AS_EXECUTED,
    payload: request
  }  
}

export function fetchLinkDocsWithFinalTermIdAction(finalTermId){
  const request=axios({
    url : '/fetchLinkDocsWithFinalTermIdFilterFinalTerm?finalTermId='+finalTermId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_LINK_DOCS_WITH_FINAL_TERM_ID,
    payload: request
  }
}

export function sendInviteCompanyEmailAction(props){
  const request=axios({
    url : '/sendInviteCompanyEmail',
    method : 'POST',
    baseURL : ROOT_URL,
    data : props
  });

  return{
    type: SEND_INVITE_COMPANY_EMAIL,
    payload: request
  }
}

export function fetchFinalTermListForLenderCompany(companyId){
  const request=axios({
    url : '/fetchFinalTermListForLenderCompany?companyId='+companyId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_FINAL_TERM_LIST_FOR_COMPANY,
    payload: request
  }
}

export function fetchFinalTermListForBorrowerCompany(companyId){
  const request=axios({
    url : '/fetchFinalTermListForBorrowerCompany?companyId='+companyId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_FINAL_TERM_LIST_FOR_COMPANY,
    payload: request
  }
}

export function fetchFinalTermWithYieldMatrixAction(finalTermId){
  const request=axios({
    url : '/getFinalTermWithYieldMatrix?finalTermId='+finalTermId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_FINAL_TERM_WITH_YIELD_MATRIX,
    payload: request
  }
}

export function fetchFinalTerm(finalTermId){
  const request=axios({
    url : '/getFinalTerm?finalTermId='+finalTermId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_FINAL_TERM,
    payload: request
  }
}

export function fetchFinalIOIAction(ioiId){
  const request=axios({
    url : '/getFinalIOIByIoiId?ioiId='+ioiId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_FINAL_TERM_BY_IOI,
    payload: request
  }
}

export function createFinalTermAction(props){
  const request=axios({
    url : '/createFinalTerm',
    method : 'POST',
    baseURL : ROOT_URL,
    data : props
  });

  return{
    type: CREATE_FINAL_TERM,
    payload: request
  }
}

export function updateFinalTermAction(props){
  const request=axios({
    url : '/updateFinalTerm',
    method : 'POST',
    baseURL : ROOT_URL,
    data : props
  });

  return{
    type: UPDATE_FINAL_TERM,
    payload: request
  }
}

export function getLinkWithIOIAction(ioiId){
  const request=axios({
    url : '/getLinkWithIOI?ioiId='+ioiId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_LINKS_WITH_IOI,
    payload: request
  }
}

export function getLinkWithRFPAction(rfpId){
  const request=axios({
    url : '/getLinkWithRFP?rfpId='+rfpId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_LINKS_WITH_RFP,
    payload: request
  }
}

export function getLinkWithFinalTermAction(finalTermId){
  const request=axios({
    url : '/getLinkWithFinalTerm?finalTermId='+finalTermId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_LINK_WITH_FINAL_TERM,
    payload: request
  }
}


export function updateAccessToLenderFlag(data){
  const request=axios({
    url : '/updateAccessToLenderFlag',
    method : 'POST',
    baseURL : ROOT_URL,
    data : data
  });

  return{
    type: UPDATE_ACCESS_TO_LENDER_FLAG,
    payload: request
  }  
}

export function getBorrowerControlledAccessListAction(borrowerId){
  const request=axios({
    url : '/getBorrowerControlledAccessList?borrowerId='+borrowerId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_BORROWER_CONTROLLED_ACCESS_LIST,
    payload: request
  }
}

export function getComplianceData(companyId){
  const request=axios({
    url : '/getComplianceData?companyId='+companyId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_COMPLIANCE_DATA,
    payload: request
  }
}

export function getComplianceDataWithLinkId(linkId){
  const request=axios({
    url : '/getComplianceDataWithLinkId?linkId='+linkId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_COMPLIANCE_DATA_WITH_LINKID,
    payload: request
  }
}

export function saveComplianceData(data){
  const request=axios({
    url : '/saveComplianceData',
    method : 'POST',
    baseURL : ROOT_URL,
    data : data
  });

  return{
    type: SAVE_COMPLIANCE_DATA,
    payload: request
  }
}

export function sendContactUsEmailAction(data){
  const request=axios({
    url : '/sendContactUsEmail',
    method : 'POST',
    baseURL : ROOT_URL,
    data : data
  });

  return{
    type: SEND_CONTACT_US_EMAIL,
    payload: request
  }
}

export function saveComparisionToolData(data){
  const request=axios({
    url : '/saveDealComparisionData',
    method : 'POST',
    baseURL : ROOT_URL,
    data : data
  });

  return{
    type: SAVE_DEAL_COMPARISION_DATA,
    payload: request
  }
}

export function getLinkDocsWithLinkIdAndTypeAction(linkId, type){
  const request=axios({
    url : '/getLinkDocsWithLinkIdAndType?linkId='+linkId+'&type='+type,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_LINKS_DOCS_WITH_LINK,
    payload: request
  }
}

export function getLinkDocsWithLinkIdAction(linkId){
  const request=axios({
    url : '/getLinkDocsWithLinkId?linkId='+linkId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_LINKS_DOCS_WITH_LINK,
    payload: request
  }
}

export function getLinkDocsWithRFPAndIOIAction(ioiId){
  const request=axios({
    url : '/getLinkDocsWithRFPAndIOI?ioiId='+ioiId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_LINKS_DOCS_WITH_RFP_IOI,
    payload: request
  }
}

export function getLinkDocsWithRFPAndIOIAndCompanyAction(rfpId, ioiId, companyId){
  const request=axios({
    url : '/getLinkDocsWithRFPAndIOIAndCompany?rfpId='+rfpId+'&ioiId='+ioiId+'&companyId='+companyId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_LINKS_DOCS_WITH_RFP_IOI_COMPANY,
    payload: request
  }
}

export function getLinksWithCompanyIdAction(companyId, type){
  const request=axios({
    url : '/getLinksWithCompanyId?companyId='+companyId+'&type='+type,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_LINKS_WITH_COMPANYID,
    payload: request
  }
}

export function downloadLinkDocumentAction(fileName){
  const request=axios({
    url : '/getLinkDocsPublicURL?fileName='+fileName,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_LINK_DOCUMENT,
    payload: request
  }
}

export function deleteLinkDocumentAction(linkDocumentId, fileName){
  const request=axios({
    url : '/deleteLinkDocument?linkDocumentId='+linkDocumentId+'&fileName='+fileName,
    method : 'DELETE',
    baseURL : ROOT_URL
  });

  return{
    type: DELETE_LINK_DOCUMENT,
    payload: request
  }
}

export function getLinkDocsWithRFPIdAction(rfpId){
  const request=axios({
    url : '/getLinkDocsWithRFPId?rfpId='+rfpId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_LINK_DOCS_WITH_RFP_ID,
    payload: request
  }
}

export function uploadDocumentRequest({ file, type, ioiId, rfpId, linkId, uploadedCompanyId }) {
  let data = new FormData();
  data.append('file', file);
  data.append('type', type);
  data.append('ioiId', ioiId);
  data.append('rfpId', rfpId);
  data.append('linkId', linkId);
  data.append('uploadedCompanyId', uploadedCompanyId);

  const request=axios({
    url     : '/uploadFile',
    method  : 'POST',
    baseURL : ROOT_URL,
    data    : data
  });

  return{
    type: UPLOAD_FILE_TO_S3,
    payload: request
  }
}

export function updateContactCellWGLAction(data){
  const request=axios({
    url : '/updateContactCellWGLAction',
    method : 'PUT',
    baseURL : ROOT_URL,
    data : data
  });

  return{
    type: UPDATE_CONTACT_CELL_WGL,
    payload: request
  }
}

export function deleteContactFromWGLAction(wglListId){
  const request=axios({
    url : '/deleteContactFromWGL?wglListId='+wglListId,
    method : 'DELETE',
    baseURL : ROOT_URL
  });

  return{
    type: DELETE_CONTACT_FROM_WGL,
    payload: request
  }
}

export function addContactToWGLAction(data){
  const request=axios({
    url : '/addContactToWGL',
    method : 'POST',
    baseURL : ROOT_URL,
    data : data
  });

  return{
    type: INVITE_LENDER,
    payload: request
  }
}

export function getWGLByLinkIdAction(linkId){
  const request=axios({
    url : '/getWGLByLinkId?linkId='+linkId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_WGL_BY_LINKID,
    payload: request
  }
}

export function getWGLByCompanyIdAction(type, companyId){
  const request=axios({
    url : '/getWGLByCompanyId?type='+type+'&companyId='+companyId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_WGL_BY_COMPANYID,
    payload: request
  }
}

export function inviteLenderAction(data){
  const request=axios({
    url : '/inviteLender',
    method : 'POST',
    baseURL : ROOT_URL,
    data : data
  });

  return{
    type: INVITE_LENDER,
    payload: request
  }
}

export function getIOIForRFPAndCompanyAction(rfpId, companyId){
  const request=axios({
    url : '/getIOIForRFPAndCompany?rfpId='+rfpId+'&companyId='+companyId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_IOI_FOR_RFP_COMPANY,
    payload: request
  }
}

export function getIOIWithFinalTermAction(finalTermId){
  const request=axios({
    url : '/getIOIWithFinalTerm?finalTermId='+finalTermId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_IOI,
    payload: request
  }
}

export function resetActivityTermSheetStatsAction(props){
  const request=axios({
    url : '/resetTermSheetActivity',
    method : 'POST',
    baseURL : ROOT_URL
  });

  return{
    type: RESET_TERMSHEET_ACTIVITY,
    payload: request
  }
}

export function createUnsolicitedPitchAction(props){
  const request=axios({
    url : '/createUnsolicitedPitch',
    method : 'POST',
    baseURL : ROOT_URL,
    data : props
  });

  return{
    type: CREATE_PITCH,
    payload: request
  }
}

export function fetchTermSheetActivityStatsAction(sector){
  const request=axios({
    url : '/fetchTermSheetActivity?sector='+sector,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_TERM_SHEET_ACTIVITY_STATS,
    payload: request
  }
}

export function fetchRFPByIOIAction(ioiId){
  const request=axios({
    url : '/fetchRFPByIOI?ioiId='+ioiId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_RFP,
    payload: request
  }
}

export function getRFPWithFinalTermAction(finalTermId){
  const request=axios({
    url : '/getRFPWithFinalTerm?finalTermId='+finalTermId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_RFP,
    payload: request
  }
}

export function fetchRFPAction(rfpId){
  const request=axios({
    url : '/fetchRFP?rfpId='+rfpId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_RFP,
    payload: request
  }
}

export function fetchIOIListForLenderCompanyAction(companyId){
  const request=axios({
    url : '/fetchIOIListForLenderCompany?companyId='+companyId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_IOI_LIST_FOR_COMPANY,
    payload: request
  }
}

export function fetchIOIListForBorrowerCompanyAction(companyId){
  const request=axios({
    url : '/fetchIOIListForBorrowerCompany?companyId='+companyId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_IOI_LIST_FOR_COMPANY,
    payload: request
  }
}

export function fetchCompanyRFPListAction(companyId){
  const request=axios({
    url : '/fetchCompanyRFPList?companyId='+companyId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_COMPANY_RFP_LIST,
    payload: request
  }
}

export function fetchFavoriteRFPListAction(userId){
  const request=axios({
    url : '/fetchFavRFPList?userId='+userId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_FAV_RFP_LIST,
    payload: request
  }
}

export function fetchIOIAction(ioiId){
  const request=axios({
    url : '/fetchIOI?ioiId='+ioiId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_IOI,
    payload: request
  }
}

export function fetchFinalTermListForRFPAction(rfpId){
  const request=axios({
    url : '/fetchFinalTermListForRFP?rfpId='+rfpId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_FT_LIST_FOR_RFP,
    payload: request
  }
}

export function fetchIOIListForRFPAction(rfpId){
  const request=axios({
    url : '/fetchIOIListForRFP?rfpId='+rfpId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_IOI_LIST_FOR_RFP,
    payload: request
  }
}

export function createIOIAction(props){
  const request=axios({
    url : '/createIOI',
    method : 'POST',
    baseURL : ROOT_URL,
    data : props
  });

  return{
    type: CREATE_IOI,
    payload: request
  }
}

export function updateIOIAction(props){
  const request=axios({
    url : '/updateIOI',
    method : 'POST',
    baseURL : ROOT_URL,
    data : props
  });

  return{
    type: UPDATE_IOI,
    payload: request
  }
}

export function getRFPFromFavoritesAction(userId, rfpId){
  const request=axios({
    url : '/getRFPFavorites?rfpId='+rfpId+'&userId='+userId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_RFP_FROM_FAVORITES,
    payload: request
  }
}

export function removeRFPFromFavoritesAction(props){
  const request=axios({
    url : '/removeRFPFromFavorites',
    method : 'post',
    baseURL : ROOT_URL,
    data : props
  });

  return{
    type: REMOVE_RFP_FROM_FAVORITES,
    payload: request
  }
}

export function addRFPToFavoritesAction(props){
  const request=axios({
    url : '/addRFPToFavorites',
    method : 'post',
    baseURL : ROOT_URL,
    data : props
  });

  return{
    type: ADD_RFP_TO_FAVORITES,
    payload: request
  }
}

export function fetchUserListAction(companyId){
  const request=axios({
    url : '/getUserList?companyId='+companyId,
    method : 'get',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_USER_LIST,
    payload: request
  }
}

export function addUserAction(props){
  const request=axios({
    url : '/addUser',
    method : 'post',
    baseURL : ROOT_URL,
    data : props
  });

  return{
    type: ADD_USER,
    payload: request
  }
}

export function updateUserProfileAction(props){
  const request=axios({
    url : '/updateUserProfile',
    method : 'post',
    baseURL : ROOT_URL,
    data : props
  });

  return{
    type: UPDATE_USER_PROFILE,
    payload: request
  }
}

export function updateUserAction(props){
  const request=axios({
    url : '/updateUser',
    method : 'post',
    baseURL : ROOT_URL,
    data : props
  });

  return{
    type: UPDATE_USER,
    payload: request
  }
}

export function updateAddressAction(props){
  const request=axios({
    url : '/updateAddress',
    method : 'post',
    baseURL : ROOT_URL,
    data : props
  });

  return{
    type: UPDATE_ADDRESS,
    payload: request
  }
}

export function updateContactAction(props){
  const request=axios({
    url : '/updateContact',
    method : 'post',
    baseURL : ROOT_URL,
    data : props
  });

  return{
    type: UPDATE_CONTACT,
    payload: request
  }
}

export function fetchAddressAction(addressId){
  const request=axios({
    url : '/fetchAddress?addressId='+addressId,
    method : 'get',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_ADDRESS,
    payload: request
  }
}

export function fetchContactAction(contactId){
  const request=axios({
    url : '/fetchContact?contactId='+contactId,
    method : 'get',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_CONTACT,
    payload: request
  }
}

export function fetchAllRFPAction(){
  const request=axios({
    url : (USE_CACHE ? '/fetchAllRFPsUsingCache' : '/fetchAllRFPs'),
    method : 'get',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_ALL_RFP,
    payload: request
  }
}

export function updateRFPAction(props){
  const request=axios({
    url : '/updateRFP',
    method : 'post',
    baseURL : ROOT_URL,
    headers : {
      'Content-Type' : 'application/json'
    },
    data: props
  });

  return{
    type: UPDATE_RFP,
    payload: request
  }
}

export function createRFPAction(props){
  const request=axios({
    url : '/createRFP',
    method : 'post',
    baseURL : ROOT_URL,
    headers : {
      'Content-Type' : 'application/json'
    },
    data: props
  });

  return{
    type: CREATE_RFP,
    payload: request
  }
}

export function registerCompanyAction(props){
  const request=axios({
    url : '/registerCompany',
    method : 'post',
    baseURL : ROOT_URL,
    headers : {
      'Content-Type' : 'application/json'
    },
    data: props
  });

  return{
    type: REGISTER_COMPANY,
    payload: request
  }
}

export function loginAction(props){
  const request=axios({
    url : '/login',
    method : 'post',
    baseURL : ROOT_URL,
    headers : {
      'Content-Type' : 'application/json'
    },
    data: props
  });

  return{
    type: LOGIN,
    payload: request
  }
}

export function fetchPosts() {
  const request = axios.get(`${ROOT_URL}/posts${API_KEY}`);

  return {
    type: FETCH_POSTS,
    payload: request
  };
}

export function createPost(values, callback) {
  const request = axios
    .post(`${ROOT_URL}/posts${API_KEY}`, values)
    .then(() => callback());

  return {
    type: CREATE_POST,
    payload: request
  };
}

export function fetchPost(id) {
  const request = axios.get(`${ROOT_URL}/posts/${id}${API_KEY}`);

  return {
    type: FETCH_POST,
    payload: request
  };
}

export function deletePost(id, callback) {
  const request = axios
    .delete(`${ROOT_URL}/posts/${id}${API_KEY}`)
    .then(() => callback());

  return {
    type: DELETE_POST,
    payload: id
  };
}
