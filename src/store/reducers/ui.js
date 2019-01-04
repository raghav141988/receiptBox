import { UI_START_LOADING,NOTIFICATION_RESET, RESET_UI_STATE,DELETE_RECEIPT_SUCCESS,RECEIPT_STORE_SUCCESS,MODAL_CLOSE,MODAL_OPEN,UI_STOP_LOADING,NOTIFICATION_OPENED } from "../actions/actionTypes";
import { isNull } from "util";

const initialState = {
  isLoading: false,
  isModalClosed:false,
  isReceiptStored:false,
  isReceiptDeleted:false,
  notification:null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIPT_STORE_SUCCESS:
    return {
      ...state,
      isReceiptStored:true
    }
    
    case NOTIFICATION_OPENED:
    return {
      ...state,
      notification:action.notification
    }
    case DELETE_RECEIPT_SUCCESS:
    return {
      ...state,
      isReceiptDeleted:true
    }
    case MODAL_CLOSE:
    return {
     ...state,
     isModalClosed:true
    }
    case MODAL_OPEN:
    return {
     ...state,
     isModalClosed:false
    }

    case UI_START_LOADING:
      return {
        ...state,
        isLoading: true,
       
      };
    case UI_STOP_LOADING:
      return {
        ...state,
        isLoading: false
      };
      case RESET_UI_STATE:
      return {
        ...state,
        isLoading: false,
        isModalClosed:false,
        isReceiptStored:false,
        isReceiptDeleted:false
      }
      case NOTIFICATION_RESET:
      return {
        ...state,
        notification:null
      }
    default:
      return state;
  }
};

export default reducer;