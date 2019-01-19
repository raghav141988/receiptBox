import { STORE_NOTIFICATION,
    FETCH_NOTIFICATIONS,
    REMOVE_NOTIFICATION
} from './actionTypes';
import { API, Auth,Storage } from 'aws-amplify';
import {uiStartLoading,uiStopLoading,modalClose} from './ui';
import {moveReceiptSuccess,unknownToReceiptSuccess} from './receipts';
import Constants from '../../Utils/constants';
import mime from 'mime-types';
export const fetchUserNotifications = () => {
    return async dispatch=>{
        dispatch(uiStartLoading());
        
        const apiName = 'notificationAPI';
        const path = '/notifications';
       
       try{
       const response=  await API.get(apiName, path);
       console.log(response);
       dispatch(storeNotifications(response));
       dispatch(uiStopLoading());

       }
       catch(err){
           console.log('Failed to fetch latest Receipts'+err);
           dispatch(uiStopLoading());
       }

    }
};
/* Moves notification to my receipts */
export const moveNotification=(notification)=>{

 return async dispatch=>{
    const user = await Auth.currentAuthenticatedUser();
        
    dispatch(uiStartLoading());
    const isReceiptFolder=(notification.receiptType==='R')?true:false
    const apiName = 'moveReceiptsAPI';
        const path = '/moveReceipts';
        const data = {
    
         body: {receipts:[{
             receiptKey:user.attributes.sub+"/"+notification.receiptKey,
             category:Constants.DEFAULT_RECEIPT_CATEGORY,
              contentType:mime.lookup(notification.receiptKey),
             title:notification.receiptKey.toString().replace(user.attributes.sub+'/',''),
         }],
            isReceiptFolder:isReceiptFolder
         }
     }
     try {
        
       const response= await API.post(apiName, path, data);
      console.log(response);
      // dispatch(storeReceiptDetail(result,receipt));
       dispatch(uiStopLoading());
       if(response.succeededReceipts.length>0){
        //
        
         dispatch(deleteNotification(notification));

       isReceiptFolder? dispatch(moveReceiptSuccess(response.succeededReceipts)):dispatch(unknownToReceiptSuccess(response.succeededReceipts));
       }
      
        }
        catch(err){
         console.log('Move user receipts failed'+err);
        }


 }
}

export const deleteNotification=(notification)=>{
    return async dispatch =>{
        dispatch(uiStartLoading());
        const apiName = 'notificationAPI';
        const path = '/notifications' ;
   
          console.log('Going to delete DB');
          
         try{
            
            const data = {
       
                body: {
                    
                  ... notification
                  }
              }

         const response=  await API.del(apiName, path,data);
         dispatch(removeNotification(notification));
         dispatch(uiStopLoading());
         }
         catch(err){
            console.log('delte failed'+err);
            dispatch(uiStopLoading());
         }
         ;

    }
}
export const removeNotification=(notification)=>{
return {
    type:REMOVE_NOTIFICATION,
    notification:notification
}
}

export const storeNotifications =(notifications)=>{
    return {
        type:STORE_NOTIFICATION,
        notifications:notifications
    }
}
