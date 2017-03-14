import axios from 'axios';

export const REGISTER_COMPANY = 'REGISTER_COMPANY';
export const LOGIN = 'LOGIN';
export const CREATE_RFP = 'CREATE_RFP';
export const FETCH_ALL_RFP = 'FETCH_ALL_RFP';

const ROOT_URL = 'http://127.0.0.1:1127';

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
