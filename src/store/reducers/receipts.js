import {
  STORE_DEVICE_TOKEN,
  DELETE_PLACE,
  STORE_LATEST_RECEIPTS,
  STORE_MY_RECEIPTS,
  REMOVE_RECEIPTS,
  RECEIPT_DETAIL_SUCCESS,
  RECEIPT_DETAIL_RESET,
  MOVE_TO_MY_RECEIPTS_SUCCESS,
  UNKNOWN_TO_MY_RECEIPTS_SUCCESS,
  ADD_UPDATE_RECEIPT_SUCCESS,
  STORE_UNKNOWN_RECEIPTS,
  MARK_INBOX_SELECTION,
  STORE_SHARE_URL,
  UPDATE_CATEGORIZED_RECEIPTS
 

} from "../actions/actionTypes";
import { removeReceipts } from "../actions/receipts";

const initialState = {
  myReceipts: [],
  latestReceipts:[],
  isReceiptFolder:true,
  sharedReceipt:null,
  unknownReceipts:[],
  receiptDetail:{
    uri:null,
    receipt:null
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_DEVICE_TOKEN:
      return {
        ...state,
      deviceToken:action.payload
      };
    
      case STORE_LATEST_RECEIPTS:
      return {
        ...state,
        latestReceipts:action.latestReceipts
      }
      case STORE_UNKNOWN_RECEIPTS:
      return {
        ...state,
        unknownReceipts:action.unknownReceipts
      }
      case ADD_UPDATE_RECEIPT_SUCCESS:
      return {
        ...state,
        myReceipts: updateReceipts(state.myReceipts,action.receipt),
        receiptDetail:{
          uri:action.result,
          receipt:{
            title:action.receipt.title,
            createdDate:action.receipt.createdDate,
            category:action.receipt.category,
            contentType:action.receipt.contentType,
            userSub:action.receipt.userSub,
            receiptKey:action.receipt.receiptKey
          }
        }
      }
      case RECEIPT_DETAIL_SUCCESS:
      return {
        ...state,
       // myReceipts: updateReceipts(state.myReceipts,action.receipt),
        receiptDetail:{
          uri:action.result,
          receipt:{
            title:action.receipt.title,
            createdDate:action.receipt.createdDate,
            category:action.receipt.category,
            contentType:action.receipt.contentType,
            userSub:action.receipt.userSub,
            receiptKey:action.receipt.receiptKey
          }
        }
      }
      case RECEIPT_DETAIL_RESET:
      return {
        ...state,
        receiptDetail:{
          uri:null,
          receipt:null
        }

      }
      case STORE_MY_RECEIPTS:
      return {
        ...state,
        myReceipts:action.myReceipts
      }
      case MARK_INBOX_SELECTION:{
        return {
          ...state,
          isReceiptFolder:action.isReceiptFolder
        }
      }
      case REMOVE_RECEIPTS:
      
      const key=action.isReceiptFolder?'latestReceipts': action.level==='public'?'unknownReceipts':'myReceipts';
      const receipts=action.isReceiptFolder?state.latestReceipts:action.level==='public'?state.unknownReceipts:state.myReceipts;
      
      return {
        ...state,
        [key]:filterReceipts(receipts,action.removableReceipts),
        receiptDetail:{
          uri:null,
          receipt:null
        }
      }
     case STORE_SHARE_URL:
     return {
       ...state,
       sharedReceipt:{
        ...action.sharedReceipt
       }
     }
      case MOVE_TO_MY_RECEIPTS_SUCCESS:
      return {
        ...state,
         myReceipts:addToMyReceipts(state.myReceipts,action.receipts),
        latestReceipts:updateLatestReceipts(state.latestReceipts,action.receipts)
      }
      case UPDATE_CATEGORIZED_RECEIPTS:
      return {
        ...state,
        myReceipts:updateMyCategorizedReceipts(state.myReceipts,action.receipts),
      }
      case UNKNOWN_TO_MY_RECEIPTS_SUCCESS:
      return {
        ...state,
         myReceipts:addToMyReceipts(state.myReceipts,action.receipts),
        unknownReceipts:updateLatestReceipts(state.unknownReceipts,action.receipts)
      }
    default:
      return state;
  }
};

export const addToMyReceipts=(myReceipts,movedReceipts)=>{
  const newlyMovedReceipts=movedReceipts.map(receipt=>{
    return {
      ...receipt,
      receiptKey:receipt.latestReceiptKey,
      isLatestReceipt:false
    }
  })
 
  console.log(newlyMovedReceipts);
  return myReceipts.concat(newlyMovedReceipts);

}

export const updateMyCategorizedReceipts=(myReceipts,receipts)=>{
  
  const movedReceiptKeys = 
  receipts.reduce((obj, receipt) => {
    obj[receipt.receiptKey] = receipt
    return obj
  }, {})


 const newReceipts= myReceipts.map(receipt=>{
     if(movedReceiptKeys[receipt.receiptKey]){
       return movedReceiptKeys[receipt.receiptKey]
     }else {
       return receipt;
     }
  })
return newReceipts;
}
export const updateLatestReceipts=(latestReceipts,movedReceipts)=>{
  const movedReceiptKeys=movedReceipts.map(receipt=>receipt.receiptKey);
  console.log(movedReceiptKeys);
const newReceipts= latestReceipts.filter(receipt=>{
  return !movedReceiptKeys.includes(receipt.receiptKey);
  
})
console.log(newReceipts);
return newReceipts;
}
export const updateReceipts=(myReceipts,currentReceipt)=>{
  if(myReceipts==undefined||myReceipts.length == 0){
return [{...currentReceipt}];
  }else {
    const myReceiptKeys=myReceipts.map(receipt=>receipt.receiptKey);
   if (!myReceiptKeys.includes(currentReceipt.receiptKey)){
   return  myReceipts.concat(currentReceipt);
   }else {
    const myreceipts=myReceipts.map(receipt=>{
      let newReceipt={...receipt};
      if(receipt.receiptKey===currentReceipt.receiptKey){
        newReceipt={...currentReceipt};
      }

      return newReceipt;
    
    })
    return myreceipts;
  }
  }
}
export const filterReceipts=(myReceipts,removableReceipts)=>{
 // const originalReceiptkeys=myReceipts.map(receipt=>receipt.receiptKey);
 console.log(myReceipts);
 console.log(removableReceipts);
 if(removableReceipts instanceof Array){
  const deletableReceiptkeys=removableReceipts.map(receipt=>receipt.receiptKey);
  console.log(deletableReceiptkeys);
  const finalReceipts= myReceipts.filter(receipt=>
    !deletableReceiptkeys.includes(receipt.receiptKey)
    
  );
  console.log(finalReceipts);
  return finalReceipts;
 }else {

  const finalReceipts= myReceipts.filter(receipt=>removableReceipts.receiptKey!==receipt.receiptKey)
    
 
  console.log(finalReceipts);
  return finalReceipts;
 
 }
 
 // const receiptsToBePresent=originalReceiptkeys.filter(receipt=>!deletableReceiptkeys.includes(receipt))

};

export default reducer;
