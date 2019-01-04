import {Navigation} from 'react-native-navigation';

export const showAddReceipt=(receipt,isEdit)=>{
    Navigation.showModal({
    stack: {
      children: [{
        component: {
          name: 'receiptManager.addreceipt-screen',
          passProps: {
            receipt: receipt,
            isEdit:isEdit
          },
          options: {
            topBar: {
              title: {
                text: isEdit?'Edit Receipt':'Add Receipt'
              }
            }
          }
        }
      }]
    }
  });
}


export const showAddReceiptFromCamera=(cameraResp)=>{
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
            title: {
              text: 'Add Receipt'
            }
          }
        }
      }
    }]
  }
});
}