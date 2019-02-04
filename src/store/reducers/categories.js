import {
   
    ADD_CATEGORY,
    STORE_CATEGORIES,
    STORE_USER_FILTERED_CATEGORIES
   
  
  } from "../actions/actionTypes";

  
  const initialState = {
    categories: [],
    userFilteredCategories:[]
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case ADD_CATEGORY:
        return {
          ...state,
          categories:state.categories.concat(action.category)
        };
        case STORE_USER_FILTERED_CATEGORIES:
        return {
            ...state,
            userFilteredCategories:[...action.categories]
        }
        case STORE_CATEGORIES:
        return {
          ...state,
          categories:[...action.categories]
        };
     
      default:
        return state;
    }
  };
 
  export default reducer;
  