import axios from 'axios';

export const REGISTER_COMPANY = 'REGISTER_COMPANY';
export const LOGIN = 'LOGIN';
export const CREATE_RFP = 'CREATE_RFP';
export const UPDATE_RFP = 'UPDATE_RFP';
export const UPDATE_IOI = 'UPDATE_IOI';
export const FETCH_ALL_RFP = 'FETCH_ALL_RFP';
export const FETCH_RFP = 'FETCH_RFP';
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


const ROOT_URL = 'http://127.0.0.1:1127';
// const ROOT_URL = 'http://ec2-35-167-243-113.us-west-2.compute.amazonaws.com:1127';

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
    // url : '/fetchAllCompanyListForRFP',
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
