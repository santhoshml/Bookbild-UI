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
export const SAVE_DEAL_COMPARISION_DATA = 'SAVE_DEAL_COMPARISION_DATA';
export const SEND_CONTACT_US_EMAIL = 'SEND_CONTACT_US_EMAIL';
export const SAVE_COMPLIANCE_DATA = 'SAVE_COMPLIANCE_DATA';
export const GET_COMPLIANCE_DATA = 'GET_COMPLIANCE_DATA';

export const FETCH_POSTS = "fetch_posts";
export const FETCH_POST = "fetch_post";
export const CREATE_POST = "create_post";
export const DELETE_POST = "delete_post";


// const ROOT_URL = 'http://127.0.0.1:1127';
// const ROOT_URL = 'http://ec2-52-37-86-2.us-west-2.compute.amazonaws.com:1127';
const ROOT_URL = 'https://services.bookbild.com';

export function getComplianceData(companyId){
  console.log('In getComplianceData, companyId:'+companyId);
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

export function saveComplianceData(data){
  console.log('In saveComplianceData action, data: ');
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
  console.log('In sendContactUsEmailAction, data: '+JSON.stringify(data));
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
  console.log('data: '+JSON.stringify(data));
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

export function getLinkDocsWithRFPAndIOIAction(rfpId, ioiId){
  console.log('In actions.getLinkDocsWithRFPAndIOIAction');
  const request=axios({
    url : '/getLinkDocsWithRFPAndIOI?rfpId='+rfpId+'&ioiId='+ioiId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_LINKS_DOCS_WITH_RFP_IOI,
    payload: request
  }
}

export function getLinkDocsWithRFPAndIOIAndCompanyAction(rfpId, ioiId, companyId){
  console.log('In actions.getLinkDocsWithRFPAndIOIAndCompanyAction');
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

export function getLinksWithCompanyIdAction(companyId){
  console.log('In actions.getLinksWithCompanyIdAction');
  const request=axios({
    url : '/getLinksWithCompanyId?companyId='+companyId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: GET_LINKS_WITH_COMPANYID,
    payload: request
  }
}

export function downloadLinkDocumentAction(fileName){
  console.log('In actions.downloadLinkDocumentAction');
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
  console.log('In actions.deleteLinkDocumentAction');
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
  console.log('In actions.getLinkDocsWithRFPIdAction');
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
  console.log('In actions.uploadDocumentRequest');
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

  console.log('request:'+JSON.stringify(request));
  return{
    type: UPLOAD_FILE_TO_S3,
    payload: request
  }
}

export function updateContactCellWGLAction(data){
  console.log('In actions.updateContactCellWGLAction');
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
  console.log('In actions.deleteContactFromWGLAction');
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
  console.log('In actions.addContactToWGLAction');
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

export function getWGLByCompanyIdAction(type, companyId){
  console.log('In actions.getWGLByCompanyIdAction');
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
  console.log('In actions.inviteLenderAction');
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
  console.log('In actions.getIOIForRFPAndCompanyAction');
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

export function resetActivityTermSheetStatsAction(props){
  console.log('In actions.resetActivityTermSheetStatsAction');
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
  console.log('In actions.createUnsolicitedPitchAction');
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

export function fetchAllCompanyListForRFP(){
  console.log('In actions.fetchCompanyListForRFP');
  const request=axios({
    // url : '/fetchAllCompanyListForRFP', // FOR TESTING ONLY
    url : '/fetchAllCompanyListForRFPUsingCache',
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_COMPANY_LIST_FOR_RFP,
    payload: request
  }
}

export function fetchTermSheetActivityStatsAction(sector){
  console.log('In actions.fetchTermSheetActivityStatsAction');
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

export function fetchRFPAction(rfpId){
  console.log('In actions.fetchRFPAction');
  const request=axios({
    // url : '/fetchRFP?rfpId='+rfpId,
    url : '/fetchRFPUsingCache?rfpId='+rfpId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_RFP,
    payload: request
  }
}

export function fetchIOIListForCompanyAction(companyId){
  console.log('In actions.fetchIOIListForCompanyAction');
  console.log('In fetchIOIListForCompanyAction, companyId:'+companyId);
  const request=axios({
    url : '/fetchIOIListForCompany?companyId='+companyId,
    method : 'GET',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_IOI_LIST_FOR_COMPANY,
    payload: request
  }
}

export function fetchCompanyRFPListAction(companyId){
  console.log('In actions.fetchCompanyRFPListAction');
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
  console.log('In actions.fetchMyFavoriteRFPListAction');
  console.log('userId:'+userId);
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
  console.log('In actions.fetchIOI');
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

export function fetchIOIListForRFPAction(rfpId){
  console.log('In actions.fetchIOIListForRFPAction');
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
  console.log('In actions.createIOIAction');
  console.log('props:'+JSON.stringify(props));
  const request=axios({
    // url : '/createIOI',
    url : '/createIOIUsingCache',
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
  console.log('In actions.updateIOIAction');
  console.log('props:'+ JSON.stringify(props));
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
  console.log('In actions.getRFPFromFavoritesAction');
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

export function removeRFPFromFavoritesAction(favoriteId){
  console.log('In actions.removeRFPFromFavoritesAction');
  const request=axios({
    url : '/removeRFPFromFavorites',
    method : 'post',
    baseURL : ROOT_URL,
    data : {
      favoriteId : favoriteId
    }
  });

  return{
    type: REMOVE_RFP_FROM_FAVORITES,
    payload: request
  }
}

export function addRFPToFavoritesAction(userId, rfpId){
  console.log('In actions.addToFavoritesAction');
  const request=axios({
    url : '/addRFPToFavorites',
    method : 'post',
    baseURL : ROOT_URL,
    data : {
      rfpId : rfpId,
      userId : userId
    }
  });

  return{
    type: ADD_RFP_TO_FAVORITES,
    payload: request
  }
}

export function fetchUserListAction(companyId){
  console.log('In actions.fetchUserListAction');
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
  console.log('In actions.addUserAction');
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
  console.log('In actions.updateProfileAction');
  console.log('props:'+JSON.stringify(props));
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

export function fetchAddressAction(addressId){
  console.log('In actions.fetchAddressAction');
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
  console.log('In actions.fetchContactAction');
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
  console.log('In actions.fetchAllRFPAction');
  const request=axios({
    // url : '/fetchAllRFPs',
    url : '/fetchAllRFPsUsingCache',
    method : 'get',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_ALL_RFP,
    payload: request
  }
}

export function updateRFPAction(props){
  console.log('In actions.updateRFPAction');
  console.log('props:'+JSON.stringify(props));
  const request=axios({
    // url : '/updateRFP',
    url : '/updateRFPUsingCache',
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
  console.log('In actions.createRFPAction');
  console.log('props:'+JSON.stringify(props));
  const request=axios({
    // url : '/createRFP',
    url : '/createRFPUsingCache',
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
  console.log('In actions.registerCompanyAction');
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
  console.log('In actions.loginAction');
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
