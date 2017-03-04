import axios from 'axios';

export const REGISTER_COMPANY = 'REGISTER_COMPANY';

const ROOT_URL = 'http://127.0.0.1:1127';

export function registerCompany(props){
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
