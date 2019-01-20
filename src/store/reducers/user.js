import { STORE_COGNITO_USER,STORE_NOTIFICATION_SETTINGS,STORE_USER_DB_DETAILS} from "../actions/actionTypes";
import { isNull } from "util";

const initialState = {
  userDBDetails: null,
  userCognitoDetails:null,

};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_COGNITO_USER:
    return {
      ...state,
      userCognitoDetails:action.userDetails
    }
    case STORE_NOTIFICATION_SETTINGS:
    return {
        ...state,
        userDBDetails:{
            ...state.userDBDetails,
            notificationSettings:{...action.notificationSettings}
        }
    }
    case STORE_USER_DB_DETAILS:
    return {
      ...state,
      userDBDetails:action.userDBDetails
    }
    default:
      return state;
  }
};

export default reducer;