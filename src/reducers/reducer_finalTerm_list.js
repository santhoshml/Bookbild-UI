import { FETCH_FINAL_TERM_LIST_FOR_COMPANY, FETCH_FT_LIST_FOR_RFP } from '../actions/index';

const INITIAL_STATE = { finalTerm: null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
  case FETCH_FINAL_TERM_LIST_FOR_COMPANY :
    if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
      let ftList = action.payload.data.data.Items;
      let filteredFTList = ftList && ftList.filter(ft => !ft.parentFT);
      return {
        ...state
        , finalTermList : filteredFTList
      };
    } else {
      return {
          ...state
          , errObject : action.payload.data
      };
    }
    break;
    case FETCH_FT_LIST_FOR_RFP :
      if(action.payload.status === 200 && action.payload.data.status === 'SUCCESS'){
        let ftList = action.payload.data.data.FT_LIST.Items;
        let parentFT = {};
        for(let ft of ftList){
          if(ft.childFTList){
            parentFT[ft.finalTermId] = ft.yield;
          }
        }
        let compiledList = [];
        for(let ft of ftList){
          if(!ft.childFTList){
            if(ft.parentFT){
              ft.blendedCost = [{
                yield : cUtils.formatPercentToDisplay(parentFT[ft.parentFT]),
                otherLender : ' other tranche'
              }];
            }
            compiledList.push(ft);
          }
        }
        return {
          ...state
          , finalTermList : compiledList
          , finalTermCompanyList : action.payload.data.data.COMPANY_DETAILS_LIST
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
