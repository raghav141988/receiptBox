import {
   
    STORE_NOTIFICATION,
    REMOVE_NOTIFICATION
   
  
  } from "../actions/actionTypes";

  
  const initialState = {
    notifications: [],
    
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case STORE_NOTIFICATION:
        return {
          ...state,
        notifications:action.notifications
        };
      case REMOVE_NOTIFICATION:
      console.log(removeNotification(state.notifications,action.notification));
      return {
          ...state,
          notifications:removeNotification(state.notifications,action.notification)
      }
       
      default:
        return state;
    }
  };
  export const removeNotification=(notifications, notificationReceipt)=>{
  return notifications.filter(notification=>{
     return notification.receiptKey!==notificationReceipt.receiptKey
  })
  }
  export default reducer;
  