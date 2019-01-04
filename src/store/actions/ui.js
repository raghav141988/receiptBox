import { UI_START_LOADING,RESET_UI_STATE,DELETE_RECEIPT_SUCCESS, UI_STOP_LOADING,MODAL_CLOSE,MODAL_OPEN ,NOTIFICATION_OPENED,NOTIFICATION_RESET} from './actionTypes';

export const uiStartLoading = () => {
    return {
        type: UI_START_LOADING
    };
};

export const uiStopLoading = () => {
    return {
        type: UI_STOP_LOADING
    };

};

export const modalOpen = () => {
    return {
        type: MODAL_OPEN
    };
    
};

export const modalClose = () => {
    return {
        type: MODAL_CLOSE
    };
    
};
export const deleteReceiptSuccess =()=>{
    return {
        type:DELETE_RECEIPT_SUCCESS,
      

    }
};
export const resetUIState=()=>{
    return {
        type:RESET_UI_STATE,
      

    } 
}

export const resetNotificationData =(screen)=>{
    return {
        type:NOTIFICATION_RESET,
       
       

    } 
} 
export const notificationOpened =(notification)=>{
    return {
        type:NOTIFICATION_OPENED,
        notification:notification
       

    } 
} 

