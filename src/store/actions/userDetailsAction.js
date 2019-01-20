import {STORE_COGNITO_USER,STORE_NOTIFICATION_SETTINGS,STORE_USER_DB_DETAILS} from '../actions/actionTypes'
import { API } from 'aws-amplify';
export const storeCognitoUser=(userDetails)=>{

    return {
        type:STORE_COGNITO_USER,
        userDetails:userDetails
    }
}

export const updateNotificationSettings=(settings)=>{
    return async dispatch=>{
        try {
            //THIS IS WHERE WE CALL API TO STORE THE DEVICE TOKEN
            const apiName = 'userDetailsApi';
            const path = '/user/notifications';
            //GET THE RECORD FROM DB 
    
           // const user = await Auth.currentAuthenticatedUser();
    
            const data = {
       
                body: {
                  notificationSettings: settings
              }
            }
              const postResponse= await API.post(apiName, path, data);
         


            if (postResponse !== undefined) {
                dispatch(storeNotificationSetting(settings));
            }
    
        } catch (err) {
    
            console.log('Updat notification settings failed' + err);
        }
    
    }
    
}

export const storeNotificationSetting=(notificationSettings)=>{
    return {
        type:STORE_NOTIFICATION_SETTINGS,
        notificationSettings:notificationSettings
    }
}
export const storeReceiptUser=(userDBDetails)=>{

    return {
        type:STORE_USER_DB_DETAILS,
        userDBDetails:userDBDetails
    }
}