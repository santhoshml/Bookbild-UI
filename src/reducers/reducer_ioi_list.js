import { FETCH_IOI_LIST_FOR_RFP, FETCH_IOI_LIST_FOR_COMPANY, GET_IOI_FOR_RFP_COMPANY, FETCH_IOI } from '../actions/index';
import cUtils from '../utils/common_utils';

const INITIAL_STATE = { ioiList: null, ioiCompanyList : null, ioiUserList : null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case FETCH_IOI_LIST_FOR_RFP:
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      let ioiList = action.payload.data.data.IOI_LIST.Items;
      //remove the childIOI from the above list
      // let filteredIOIList = ioiList && ioiList.filter(ioi => !ioi.parentIOI);
      // remove the parentIOI and set the blended cost value
      let parentIOI = {};
      for(let ioi of ioiList){
        if(ioi.childIOIList){
          parentIOI[ioi.ioiId] = ioi.yield;
        }
      }
      let compiledList = [];
      for(let ioi of ioiList){
        if(!ioi.childIOIList){
          if(ioi.parentIOI){
            ioi.blendedCost = [{
              yield : cUtils.formatPercentToDisplay(parentIOI[ioi.parentIOI]),
              otherLender : ' other tranche'
            }];
          }
          compiledList.push(ioi);
        }
      }

      return {
        ...state
        , ioiList : compiledList
        , ioiCompanyList : action.payload.data.data.COMPANY_DETAILS_LIST
      };
    } else {
      return {
          ...state
          , errObject : action.payload.data
      };
    }
    break;
  case FETCH_IOI_LIST_FOR_COMPANY :
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      let ioiList = action.payload.data.data.IOI_LIST.Items;
      //remove the childIOI from the above list
      let filteredIOIList = ioiList && ioiList.filter(ioi => !ioi.parentIOI);
      return {
        ...state
        , ioiList : filteredIOIList
        // , ioiCompanyList : action.payload.data.data.COMPANY_DETAILS_LIST
        // , ioiUserList : action.payload.data.data.USER_DETAILS_LIST
      };
    } else {
      return {
          ...state
          , errObject : action.payload.data
      };
    }
    break;
case GET_IOI_FOR_RFP_COMPANY:
  if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
    let ioiList = action.payload.data.data.IOI_LIST.Items;
    //remove the childIOI from the above list
    let filteredIOIList = ioiList && ioiList.filter(ioi => !ioi.parentIOI);
    return {
      ...state
      , ioiList : filteredIOIList
    };
  } else {
    return {
        ...state
        , errObject : action.payload.data
    };
  }
  break;
  case FETCH_IOI:
  if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
    return {
      ...state
      , ioi: action.payload.data.data.Items
    };
  } else {
    return {
        ...state
        , errObject : action.payload.data
    };
  }
  break;
  default:
    return state;
  }
}
