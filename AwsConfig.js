import Amplify, { API, Auth,Storage } from 'aws-amplify';
import amplify from './src/aws-exports';
import Analytics from '@aws-amplify/analytics';
import {notificationOpened} from './src/store/actions/ui';
import {addDevice} from './src/store/actions/receipts';
import {Alert} from 'react-native';
import { PushNotificationIOS } from 'react-native';

import PushNotification from '@aws-amplify/pushnotification';



export const configureAmplify=(store)=>{
    
    Amplify.configure(amplify);
/* CONFIGURE ANALYTICS */


Analytics.configure(amplify);
PushNotification.configure(amplify);

console.log('push notification config');
console.log(PushNotificationIOS);
PushNotificationIOS.addEventListener('registrationError', console.log)


// get the registration token
PushNotification.onRegister((token) => {
  Alert.alert(token);
  console.log('in app registration'+ token);
 // SAVE token

 store.dispatch(addDevice(token));
 
});
PushNotification.onNotification((notification) => {
  // Note that the notification object structure is different from Android and IOS
  console.log('in app notification', notification);

  // const screen= notification.data.screen;
  store.dispatch(notificationOpened(notification));
  // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
  notification.finish(PushNotificationIOS.FetchResult.NoData);
});

PushNotification.onNotificationOpened((notification) => {
  
  
  
console.log(screen);

    console.log('the notification is opened', notification);
});
// get the notification data when notification is opened

/* CONFIGURE PUSH NOTIFICATIONS */


/* CONFIGURE STORAGE */
Storage.configure({
  track: true ,
  bucket:amplify.aws_user_files_s3_bucket, //Your bucket ARN;
  region:amplify.aws_project_region, //Specify the region your bucket was created in;
  identityPoolId: amplify.aws_cognito_identity_pool_id//Specify your identityPoolId for Auth and Unauth access to your bucket;
});
return {
    Storage:Storage

}
}