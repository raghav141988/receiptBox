import { ADD_DEVICE, STORE_RECEIPT,DELETE_RECEIPTS,FETCH_LATEST_RECEIPTS,
    FETCH_MY_RECEIPTS,RECEIPT_DETAIL,SEARCH_RECEIPTS,TAG_RECEIPT,
    SHARE_RECEIPT,DOWNLOAD_RECEIPT,FETCH_UNKNOWN_RECEIPTS,RECEIPT_STORE_SUCCESS,NOTIFICATION_OPENED,
    STORE_DEVICE_TOKEN,RECEIPT_DETAIL_RESET,REMOVE_RECEIPTS,STORE_LATEST_RECEIPTS,STORE_MY_RECEIPTS,ADD_UPDATE_RECEIPT_SUCCESS, RECEIPT_DETAIL_SUCCESS, MOVE_TO_MY_RECEIPTS_SUCCESS
} from './actionTypes';
import {uiStartLoading,uiStopLoading,modalClose} from './ui';
import RNFetchBlob from 'rn-fetch-blob';
import { Buffer } from 'buffer';
import { deleteReceiptSuccess} from './ui';
import mime from 'mime-types';
import { API, Auth,Storage } from 'aws-amplify';
//import Base64 from '../../Utils/Base64';
import { Share,Alert } from 'react-native';
import base64 from 'base64-js'
/* Function to store the user device token in the database */
export const addDevice = (deviceToken) => {
    return async dispatch =>{
        //THIS IS WHERE WE CALL API TO STORE THE DEVICE TOKEN
        const apiName = 'userDetailsApi';
        const path = '/user';
        const data = {
       
          body: {deviceToken:deviceToken.replace('-','')}
        }
        try {
        
          const response= await API.put(apiName, path, data);
       
          //DEVICE TOKEN IS SAVED IN DB STORE IT IN STATE
          dispatch({
             type: STORE_DEVICE_TOKEN,
             deviceToken:deviceToken
          })
           }
           catch(err){
          
            console.log('User device token save failed'+err);
           }
    }
};



/* Stores the user selected receipt in Storage */
export const storeReceipt = (receipt) => {
    return async dispatch =>{
        //STORE THE RECEIPT IN S3 AND DATABASE
        dispatch(uiStartLoading());
    
        
            //console.log(data);
            if(receipt.imageData!==undefined){
            //DATA IS FROM CAMERA
            const bufferData= new Buffer(receipt.imageData, 'base64');
           
            
           
            try {
            result=  await Storage.put(receipt.fileName, bufferData, {
               level: 'private',
               contentType: receipt.contentType
           });

          console.log(result);
        
                }
          catch(err){
        //SHOW ERROR TO USER DISPATCH ERROR EVENT
        dispatch(uiStopLoading());
        console.log('Storing receipt failed'+err);
        }
            }
            else if(receipt.filePath!==undefined){
            const bufferData= await RNFetchBlob.fs.readFile(receipt.filePath, 'base64').then(data => new Buffer(data, 'base64'));
           
            
           
            try {
            result=  await Storage.put(receipt.fileName, bufferData, {
               level: 'private',
               contentType: receipt.contentType
           });

          console.log(result);
        
                }
          catch(err){
        //SHOW ERROR TO USER DISPATCH ERROR EVENT
        dispatch(uiStopLoading());
        console.log('Storing receipt failed'+err);
        }
        }

           //THIS IS WHERE WE CALL API TO STORE THE RECEIPT
           const apiName = 'receiptsAPI';
           const path = '/receipts';
        const data = {
       
          body: {title:receipt.title,
                category:receipt.category,
                receiptKey:receipt.receiptKey,
                contentType:receipt.contentType,
                createdDate:receipt.createdDate
            }
        }
        try {
           
          const response= await API.put(apiName, path, data);
          const result=  await Storage.get(receipt.receiptKey, {level: 'private',
          expires: 300
        });

          dispatch(addOrUpdateReceipt(result,receipt));
          dispatch(uiStopLoading());

          //DEVICE TOKEN IS SAVED IN DB STORE IT IN STATE
          setTimeout(() => {
            dispatch(modalClose());
           
          }, 300);
         
           }
           catch(err){
            console.log('User device token save failed'+err);
           }


           dispatch(uiStopLoading());
         
        
        

    };
};
/* DELETES SELECTED RECEIPTS FROM THE STORAGE */
export const deleteReceipts =  (receipts) => {
    return async dispatch=> {
        dispatch(uiStartLoading());
        let deletedReceipts=[];
        let failedToDeleteReceipts=[];
       let level='private';
        var results = await Promise.all(receipts.map(async (receipt) => {
            try {
                 level=receipt.isLatestReceipt!==undefined && receipt.isLatestReceipt?'public':'private';
 
                const result= await Storage.remove(receipt.receiptKey, {
                    level,
                   
                });
            
          console.log('S3 delete succeeed'+result);
            if(level!=='public'){
        const apiName = 'receiptsAPI';
          const path = '/receipts/object/:'+receipt.userSub+'/'+receipt.receiptKey ;
   
          console.log('Going to delete DB');
          const data = {
       
            body: {title:receipt.title,
                  category:receipt.category,
                  receiptKey:receipt.receiptKey,
                  contentType:receipt.contentType,
                  createdDate:receipt.createdDate
              }
          }
          console.log(data);
         
         const response=  await API.del(apiName, path,data)
         
         ;
        }
          
          
       

           deletedReceipts.push(receipt);
                //TODO SAVE UPLOADED RECEIPT DETAILS TO DATABASE
            
         
            }
             catch(err){
                 //SHOW ERROR TO USER DISPATCH ERROR EVENT
               //  dispatch(uiStopLoading());
                 failedToDeleteReceipts.push(result);
                 console.log('Storing receipt failed'+err);
             }
          }));

        
    
        dispatch(uiStopLoading());
        if(failedToDeleteReceipts.length>0&& deletedReceipts.length==0){
       console.log('ALL Receipt deletes are failed');
       //TODO DISPATCH Fail action
        }else if (failedToDeleteReceipts.length>0&& deletedReceipts.length>0){
            console.log('Delete receipts partially succeeded');
             //TODO DISPATCH Partial success action

             dispatch(removeReceipts(deletedReceipts,level));
             dispatch(deleteReceiptSuccess());
        }
        else {
            console.log('Delete receipts succeeded');
            console.log(deletedReceipts);
             dispatch(removeReceipts(deletedReceipts,level));
             dispatch(deleteReceiptSuccess());
        }
    };
};

/* Fetch Latest Receipts from the Storage */
export const fetchLatestReceipts = () => {
    return async dispatch=>{
        dispatch(uiStartLoading());
        
       try{
        const user = await Auth.currentAuthenticatedUser();
        
      
        const result=  await Storage.list(user.attributes.sub, {level: 'public'});
        const receipts=convertResultsToReceipts(result,user.attributes.sub);
       dispatch(storeLatestFetchedReceipts(receipts));
       dispatch(uiStopLoading());

       }
       catch(err){
           console.log('Failed to fetch latest Receipts'+err);
           dispatch(uiStopLoading());
       }

    }
};

/* Fetch my current receipts */
export const fetchMyReceipts = () => {
    return  async dispatch=> {
        dispatch(uiStartLoading());
        const apiName = 'receiptsAPI';
        const path = '/receipts';
       
       try{
       const response=  await API.get(apiName, path);
       dispatch(storeMyReceipts(response));
       dispatch(uiStopLoading());

       }
       catch(err){
           console.log('Failed to fetch latest Receipts'+err);
           dispatch(uiStopLoading());
       }

    
    }
};

export const fetchMyReceiptDetails = (receipt) => {
    return async (dispatch)=>{
        dispatch(uiStartLoading());
      
    //FETCH RECEIPT BY USER SUB AND RECEIPT KEY
    // const apiName = 'receiptsAPI';
    // const path = '/receipts/object/:'+receipt.userSub+'/'+receipt.receiptKey ;
   
   try{
//      const response= await API.get(apiName, path);
// console.log(response);
console.log((receipt.isLatestReceipt));
const level=receipt.isLatestReceipt!==undefined && receipt.isLatestReceipt===true?'public':'private';
console.log((receipt.receiptKey));
    const result=  await Storage.get(receipt.receiptKey, {level: level,
      expires: 300,
   
     
    });
    console.log(result);
    dispatch(storeReceiptDetail(result,receipt));
    dispatch(uiStopLoading());

    }
catch(err){
    dispatch(uiStopLoading());
    console.log('Error in fetching receipt details '+err);
}
 }
}

export const moveToMyReceipts=(receipts)=>{
    return async dispatch=>{
        //CALL MOVE MY DOCUMENTS HANDLER WITH SPECIFIED RECEIPT KEYS
        const apiName = 'moveReceiptsAPI';
        const path = '/moveReceipts';
        const data = {
    
         body: {receipts:receipts }
     }
     try {
        
       const response= await API.post(apiName, path, data);
      console.log(response);
      // dispatch(storeReceiptDetail(result,receipt));
       dispatch(uiStopLoading());
       if(response.succeededReceipts.length>0){
       dispatch(moveReceiptSuccess(response.succeededReceipts));
       }
      
        }
        catch(err){
         console.log('Move user receipts failed'+err);
        }


       
    }
}



export const searchReceipts = (searchCriteria) => {
    return {
        type: SEARCH_RECEIPTS,
        searchCriteria:searchCriteria
    };
};

export const tagReceipt = (receipt,tags) => {
    return {
        type: TAG_RECEIPT,
        receipt:receipt,
        tags:tags
    };
};

export const shareReceipt = (receipt) => {
    return async dispatch=> {
        const result=  await Storage.get(receipt.receiptKey, {level: 'private',
            download: true,
         
           
          });
          //CONVERT 
        

         console.log('share content *****');
      
        const  bufferData= base64.fromByteArray(result.Body);
        
         const shareContent='data:'+receipt.contentType+';base64,'+bufferData;
        // console.log(shareContent);
         const content = {
           // message: ICON_PLUS_BASE64,
            title: 'Share receipt',
            url: shareContent,
          };
         

          const option = { dialogTitle: 'Share receipt' };
          Share.share(content, option);
          
          

       
    };
};
export const moveReceiptSuccess =(receipts)=>{
    return {
        type: MOVE_TO_MY_RECEIPTS_SUCCESS,
        receipts:receipts
    }
}
export const downloadReceipt = (receipt) => {
    return {
        type: DOWNLOAD_RECEIPT,
        receipt:receipt
       
    };
};

export const fetchUnknownReceipts = () => {
    return {
        type: FETCH_UNKNOWN_RECEIPTS,
     
       
    };
};



export const removeReceipts =(receipts,level)=>{
   
    return {
        type:REMOVE_RECEIPTS,
        level:level,
        removableReceipts:receipts

    }
    
}
export const storeLatestFetchedReceipts =(receipts)=>{
    return {
        type:STORE_LATEST_RECEIPTS,
        latestReceipts:receipts,
       

    }
}

export const storeMyReceipts =(receipts)=>{
    return {
        type:STORE_MY_RECEIPTS,
        myReceipts:receipts

    }
}
export const addOrUpdateReceipt=(result,receipt)=>{
    return {
        type:ADD_UPDATE_RECEIPT_SUCCESS,
        result:result,
        receipt:receipt

    }   
}
export const storeReceiptDetail =(result,receipt)=>{
    return {
        type:RECEIPT_DETAIL_SUCCESS,
        result:result,
        receipt:receipt

    } 
}

export const storeReceiptSuccess =()=>{
    return {
        type:RECEIPT_STORE_SUCCESS
     

    } 
}


export const resetReceiptDetail =()=>{
    return {
        type:RECEIPT_DETAIL_RESET
       

    } 
}

 const convertResultsToReceipts=(results,userSub)=>{
  return results.map(result=>{
      return {
          createdDate:result.lastModified,
          receiptKey:result.key,
          category:'Expense',
          contentType:mime.lookup(result.key),
          title:result.key.toString().replace(userSub+'/',''),
          userSub:userSub,
          isLatestReceipt:true
      }
  })
}

    