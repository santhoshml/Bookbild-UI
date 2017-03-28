import axios from 'axios';

export const REGISTER_COMPANY = 'REGISTER_COMPANY';
export const LOGIN = 'LOGIN';
export const CREATE_RFP = 'CREATE_RFP';
export const FETCH_ALL_RFP = 'FETCH_ALL_RFP';
export const FETCH_ADDRESS = 'FETCH_ADDRESS';
export const FETCH_CONTACT = 'FETCH_CONTACT';
export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE';
export const ADD_USER = 'ADD_USER';
export const FETCH_USER_LIST = 'FETCH_USER_LIST';

const ROOT_URL = 'http://127.0.0.1:1127';

export function fetchUserListAction(company_id){
  console.log('In actions.fetchUserListAction');
  console.log('company_id:'+JSON.stringify(company_id));
  const request=axios({
    url : '/getUserList?companyId='+company_id,
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
  console.log('props:'+JSON.stringify(props));
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
  // console.log('props:'+JSON.stringify(props));
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

export function fetchAddressAction(address_id){
  console.log('In actions.fetchAddressAction');
  const request=axios({
    url : '/fetchAddress?addressId='+address_id,
    method : 'get',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_ADDRESS,
    payload: request
  }
}

export function fetchContactAction(contact_id){
  console.log('In actions.fetchContactAction');
  const request=axios({
    url : '/fetchContact?contactId='+contact_id,
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
    url : '/fetchAllRFPs',
    method : 'get',
    baseURL : ROOT_URL
  });

  return{
    type: FETCH_ALL_RFP,
    payload: request
  }
}

export function createRFPAction(props){

  console.log('In actions, props:'+JSON.stringify(props));
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
    type: REGISTER_COMPANY,
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
