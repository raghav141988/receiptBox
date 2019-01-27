import {Navigation} from 'react-native-navigation';
import {colors} from '../Utils/theme';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import {Platform} from 'react-native';

export const showAddReceipt=(receipt,isEdit)=>{
  Promise.all([
    Icon.getImageSource(Platform.OS === 'android' ? "md-save" : "ios-save", 25,'white')
  
   
  ]).then(sources => {
    
    Navigation.showModal({
    stack: {
      
      children: [{
        component: {
          options:{
        
            statusBar: {
              //visible: false,
              backgroundColor:colors.primary,
              drawBehind: false,
              style:  'light',
                          visible: true,
            },
            topBar: {
              
              visible:true,
              animate: true, 
              buttonColor: colors.buttonEnabledColor,
              background:{
                color: colors.primary,
               // translucent: true,
               
              },
             // buttonColor: 'red',
              rightButtons:[
             
                {
                 id:'save',
                 icon:sources[0],
                 color: colors.buttonEnabledColor
                 
                },
                {
                  id:'cancel',
                  text:'Cancel',
                  color: colors.buttonEnabledColor
                  }
              ],
  
              title: {
                text: isEdit?'Edit Receipt':'Add Receipt',
                color: colors.primaryTextColor,
              }
            }
          
        },
          name: 'receiptManager.addreceipt-screen',
          passProps: {
            receipt: receipt,
            isEdit:isEdit
          },
          
          
        },
       
      }]
    }
  });
});
}


export const showAddReceiptFromCamera=(cameraResp)=>{
  Promise.all([
    Icon.getImageSource(Platform.OS === 'android' ? "md-save" : "ios-save", 25,'white')
  
   
  ]).then(sources => {
  Navigation.showModal({
  stack: {
    
    children: [{
      
      component: {
        name: 'receiptManager.addreceipt-screen',
        passProps: {
          cameraPicUri: cameraResp.uri,
          camData:cameraResp.data
         
        },
        options: {
          
          topBar: {
            statusBar: {
              
              backgroundColor:colors.primary,
              drawBehind: false,
                          style:  'light',
                       
            },
     // hideOnScroll: true,
     visible:true,
     animate: true, 
     buttonColor: colors.buttonEnabledColor,
     background:{
       color: colors.primary,
      // translucent: true,
      
     },
            rightButtons:[
              {
                id: 'save',
                //color: colors.buttonEnabledColor,
                icon: sources[0],
                color: colors.buttonEnabledColor,
             },
             {
              id: 'cancel',
             
              text: 'Cancel',
              color: colors.buttonEnabledColor,
           }],
           buttonColor: colors.buttonEnabledColor,
            title: {
              text: 'Add Receipt',
              color: colors.primaryTextColor,
            },
            
           
            
          }
        }
      }
    }]
  }
});
  });
}