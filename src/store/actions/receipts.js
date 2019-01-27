import { ADD_DEVICE, STORE_RECEIPT,DELETE_RECEIPTS,FETCH_LATEST_RECEIPTS,
    FETCH_MY_RECEIPTS,RECEIPT_DETAIL,SEARCH_RECEIPTS,TAG_RECEIPT,
    SHARE_RECEIPT,DOWNLOAD_RECEIPT,MARK_INBOX_SELECTION,FETCH_UNKNOWN_RECEIPTS,RECEIPT_STORE_SUCCESS,NOTIFICATION_OPENED,
    STORE_DEVICE_TOKEN,RECEIPT_DETAIL_RESET,REMOVE_RECEIPTS,STORE_LATEST_RECEIPTS,STORE_UNKNOWN_RECEIPTS,STORE_MY_RECEIPTS,ADD_UPDATE_RECEIPT_SUCCESS, RECEIPT_DETAIL_SUCCESS, UNKNOWN_TO_MY_RECEIPTS_SUCCESS,MOVE_TO_MY_RECEIPTS_SUCCESS,
    STORE_SHARE_URL,
    STORE_NOTIFICATION,
    UPDATE_CATEGORIZED_RECEIPTS,
    FETCH_NOTIFICATIONS
} from './actionTypes';
import Constants from '../../Utils/constants';
import {deleteNotification} from './notificationActions';
import {uiStartLoading,uiStopLoading,modalClose} from './ui';
import RNFetchBlob from 'rn-fetch-blob';
import { Buffer } from 'buffer';
import { deleteReceiptSuccess} from './ui';
import mime from 'mime-types';
import {storeCognitoUser,storeReceiptUser} from './userDetailsAction';
import { API, Auth,Storage } from 'aws-amplify';
//import Base64 from '../../Utils/Base64';
import { Share,Alert,Platform } from 'react-native';
import base64 from 'base64-js'
import constants from '../../Utils/constants';



//import {DIRS} from 'rn-fetch-blob';

const storeUser = async (dispatch) => {
    try {
        //THIS IS WHERE WE CALL API TO STORE THE DEVICE TOKEN
        const apiName = 'userDetailsApi';
        const path = '/user';
        //GET THE RECORD FROM DB 

        const user = await Auth.currentAuthenticatedUser();

        const response = await API.get(apiName, path + '/:' + user.attributes.sub);
        let existingData = {}

        if (response !== undefined && response.length > 0) {

            dispatch(storeCognitoUser(user));
            dispatch(storeReceiptUser(response[0]));
        }

    } catch (err) {

        console.log('User device token save failed' + err);
    }
}
/* Function to store the user device token in the database */
export const addDevice = (deviceToken) => {
    return async dispatch =>{
        try {
        //THIS IS WHERE WE CALL API TO STORE THE DEVICE TOKEN
        const apiName = 'userDetailsApi';
        const path = '/user';
     //GET THE RECORD FROM DB 
   
     const user = await Auth.currentAuthenticatedUser();
        
     const response=  await API.get(apiName, path+'/:'+user.attributes.sub);
     let existingData={}
    
    if(response!==undefined && response.length>0){
        existingData={
            activeInd:true,
            notificationSettings:{
                ...response[0].notificationSettings
            }
        }
    }else {
        existingData={
            activeInd:true,
            notificationSettings:{
               // showPushNotifications:true,
                alertIncomingReceipt:true,
                alertUnKnownEmail:true,
                alertExpiringReceipts:true,
                alertUnknwonRcptExpiring:false,

            }
        }
    }
   
        const data = {
       
          body: {deviceToken:deviceToken.replace('-',''),
              ...existingData
        }
        }
  
        
          const postResponse= await API.post(apiName, path, data);
         
          //DEVICE TOKEN IS SAVED IN DB STORE IT IN STATE
          dispatch({
             type: STORE_DEVICE_TOKEN,
             deviceToken:deviceToken
          });
          dispatch(storeCognitoUser(user));
          dispatch(storeReceiptUser(data.body));
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
            console.log('Storing receipt failed'+err);
           }


           dispatch(uiStopLoading());
         
        
        

    };
};
/* DELETES SELECTED RECEIPTS FROM THE STORAGE */
export const deleteReceipts =  (receipts,isReceiptFolder) => {
    return async dispatch=> {
        dispatch(uiStartLoading());
        let deletedReceipts=[];
        let failedToDeleteReceipts=[];
       let level='private';
        var results = await Promise.all(receipts.map(async (receipt) => {
            try {
                 level=receipt.isLatestReceipt!==undefined && receipt.isLatestReceipt?isReceiptFolder?'protected':'public':'private';
 
                const result= await Storage.remove(receipt.receiptKey, {
                    level,
                   
                });
            
          console.log('S3 delete succeeed'+result);
            if(level!=='public' && level!=='protected' ){
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
        
         
         const response=  await API.del(apiName, path,data);
         
            const days= datediff(new Date(),new Date(receipt.receiptDate));
            console.log(days);
            const conditionDays=isReceiptFolder?10:4;
           // if(days>conditionDays){
                //MOST likely notification entry exists delete it
              const notification={
                 receiptKey:receipt.receiptKey.replace(receipt.userSub+"/",'')
              }
              dispatch(deleteNotification(notification));
           // }
        

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

             dispatch(removeReceipts(deletedReceipts,level,isReceiptFolder));
             dispatch(deleteReceiptSuccess());
        }
        else {
            console.log('Delete receipts succeeded');
            console.log(deletedReceipts);
             dispatch(removeReceipts(deletedReceipts,level,isReceiptFolder));
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
        
      console.log(user);
        const result=  await Storage.list(user.attributes.sub+"/", {level: 'protected'});
        console.log('result');
        console.log(result);
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
       storeUser(dispatch);
       dispatch(storeMyReceipts(response));
       dispatch(uiStopLoading());

       }
       catch(err){
           console.log('Failed to fetch latest Receipts'+err);
           dispatch(uiStopLoading());
       }

    
    }
};

export const fetchMyReceiptDetails = (receipt,isReceiptFolder) => {
    return async (dispatch)=>{
        dispatch(uiStartLoading());
      
    //FETCH RECEIPT BY USER SUB AND RECEIPT KEY
    // const apiName = 'receiptsAPI';
    // const path = '/receipts/object/:'+receipt.userSub+'/'+receipt.receiptKey ;
   
   try{
//      const response= await API.get(apiName, path);
// console.log(response);

const level=receipt.isLatestReceipt!==undefined && receipt.isLatestReceipt===true?isReceiptFolder?'protected':'public':'private';
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

export const datediff=(first, second)=> {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((first-second)/(1000*60*60*24));
}


export const moveToMyReceipts=(receipts,isReceiptFolder)=>{

    return async dispatch=>{
        //CALL MOVE MY DOCUMENTS HANDLER WITH SPECIFIED RECEIPT KEYS
        const apiName = 'moveReceiptsAPI';
        const path = '/moveReceipts';
        const data = {
    
         body: {receipts:receipts,
            isReceiptFolder:isReceiptFolder
         }
     }
     try {
         console.log(receipts);
        console.log('Calling move selected receitps API');
       const response= await API.post(apiName, path, data);

      // dispatch(storeReceiptDetail(result,receipt));
       dispatch(uiStopLoading());
       if(response.succeededReceipts.length>0){
        //DELETE EACH SUCCEDED RECEIPTS FROM NOTIFICATION
        response.succeededReceipts.map(receipt=>{
           const days= datediff(new Date(),new Date(receipt.receiptDate));
           console.log(days);
           const conditionDays=isReceiptFolder?10:4;
          // if(days>conditionDays){
               //MOST likely notification entry exists delete it
             const notification={
                receiptKey:receipt.receiptKey.replace(receipt.userSub+"/",'')
             }
             dispatch(deleteNotification(notification));
          // }
        });
       isReceiptFolder? dispatch(moveReceiptSuccess(response.succeededReceipts)):dispatch(unknownToReceiptSuccess(response.succeededReceipts));
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

export const shareWithIOS=async (fileUrl, type,dispatch,title) =>{
    let filePath = null;
    
    let extension = mime.extension(type);
    if(extension==='false'|| extension===false){
        extension='html';
        type="text/html";
    }
    let file_url_length = fileUrl.length;
    const configOptions = {
      fileCache: true,
      path:
      RNFetchBlob.fs.dirs.DocumentDir + ('/'+title+'.'+extension) // no difference when using jpeg / jpg / png /
    };
    RNFetchBlob.config(configOptions)
      .fetch('GET', fileUrl)
      .then(async resp => {
          console.log(resp);
        filePath = resp.path();
        console.log(filePath);
        let options = {
          type: type,
          message: title,
          url:  (Platform.OS === 'android' ? 'file://' + filePath:filePath)
        };
        console.log(options);

        if(Platform.OS==='ios')
        {
        await Share.share(options);
        // remove the image or pdf from device's storage
         RNFetchBlob.fs.unlink(filePath)
        .then(() => {console.log('unlinked successfully')})
        .catch((err) => { 'unlink error' });
        }
        else { dispatch(storeSharedURL(options))
            setTimeout(() => {
                RNFetchBlob.fs.unlink(filePath)
        .then(() => {console.log('unlinked successfully')})
        .catch((err) => { 'unlink error' });
              
              },60000);
        };
      });
      
  }


export const shareReceipt = (receipt) => {
    return async dispatch=> {
        console.log(Platform.OS);
    if( Platform.OS==='android'){
/*
            const  bufferData= base64.fromByteArray(result.Body);
            let contentType=receipt.contentType;
            if(contentType==='false'|| contentType===false){
                contentType='text/html';
            }
         const shareContent='data:'+contentType+';base64,'+bufferData;
        // consol
            content = {
               //  message: shareContent,
                 title: 'Share receipt',
                 type:contentType,
                 url: shareContent,
               };
        
      
        //console.log(content);
         

          const option = { dialogTitle: 'Share receipt' };
          Share.share(content, option);
          */
         const result=  await Storage.get(receipt.receiptKey, {level: 'private'
       
        });
        //CONVERT 
      
       let content={};
     
       console.log(result.ContentType);
      
      shareWithIOS(result,receipt.contentType,dispatch,receipt.title);

    }
    else {
        const result=  await Storage.get(receipt.receiptKey, {level: 'private'
       
          });
          //CONVERT 
        
         let content={};
       
         console.log(result.ContentType);
      
         shareWithIOS(result,receipt.contentType);
    }
       
     

       


       
    };
};
export const storeSharedURL =(shareDetails)=>{
    return {
        type: STORE_SHARE_URL,
        sharedReceipt:shareDetails,
       
    }  
}
export const moveReceiptSuccess =(receipts)=>{
    return {
        type: MOVE_TO_MY_RECEIPTS_SUCCESS,
        receipts:receipts
    }
}
export const unknownToReceiptSuccess =(receipts)=>{
    return {
        type: UNKNOWN_TO_MY_RECEIPTS_SUCCESS,
        receipts:receipts
    }
}

export const downloadReceipt = (receipt) => {
    return {
        type: DOWNLOAD_RECEIPT,
        receipt:receipt
       
    };
};

export const markInboxSelection=(isReceiptFolder)=>{
    return {
        type: MARK_INBOX_SELECTION,
        isReceiptFolder:isReceiptFolder
       
    };
}

export const fetchUnknownReceipts = () => {
    return async dispatch=>{
        dispatch(uiStartLoading());
        
       try{
        const user = await Auth.currentAuthenticatedUser();
        
      
        const result=  await Storage.list(user.attributes.sub, {level: 'public'});
        const receipts=convertResultsToReceipts(result,user.attributes.sub);
        console.log(result);
       dispatch(storeUnknownFetchedReceipts(receipts));
       dispatch(uiStopLoading());

       }
       catch(err){
           console.log('Failed to fetch unknown Receipts'+err);
           dispatch(uiStopLoading());
       }

    }
};

export const categorizeReceipts=(receipts,category)=>{
    return async dispatch=>{
        dispatch(uiStartLoading());
        console.log(receipts);
        console.log(category);
      

           //THIS IS WHERE WE CALL API TO update THE RECEIPT categ
           const apiName = 'receiptsAPI';
           const path = '/receipts/bulk';
        const data = {
       
          body: {
              receipts:receipts,
              category:category
            }
        }
        try {
           
          const response= await API.post(apiName, path, data);
        
         console.log(response);

        //UPDATE RECEIPTS WITH NEW CATEGORY
        if(response.data.succededReceipts){
            dispatch(updateCategorizedRepors(response.data.succededReceipts));
        }
        
          dispatch(uiStopLoading());
         
           }
           catch(err){
            console.log('Storing receipt failed'+err);
           }
        
    }
}
export const  updateCategorizedRepors =(receipts)=>{
    return {
        type:UPDATE_CATEGORIZED_RECEIPTS,
       
        receipts:receipts,
       
    }
}
export const removeReceipts =(receipts,level,isReceiptFolder)=>{
   
    return {
        type:REMOVE_RECEIPTS,
        level:level,
        removableReceipts:receipts,
        isReceiptFolder:isReceiptFolder
    }
    
}
export const storeLatestFetchedReceipts =(receipts)=>{
    return {
        type:STORE_LATEST_RECEIPTS,
        latestReceipts:receipts,
       

    }
}

export const storeUnknownFetchedReceipts =(receipts)=>{
    return {
        type:STORE_UNKNOWN_RECEIPTS,
        unknownReceipts:receipts,
       

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
          category:Constants.DEFAULT_RECEIPT_CATEGORY,
          contentType:mime.lookup(result.key),
          title:result.key.toString().replace(userSub+'/',''),
          userSub:userSub,
          isLatestReceipt:true
      }
  })
}

    