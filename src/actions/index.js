import axios from 'axios';

export const REGISTER_COMPANY = 'REGISTER_COMPANY';

const ROOT_URL = 'http://127.0.0.1:/1127';

export function registerCompany(props){
  // const request=axios.post(``, props);

  return{
    type: REGISTER_COMPANY,
    payload: ''
  }
}
