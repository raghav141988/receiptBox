import { ADD_CATEGORY, STORE_CATEGORIES,
    STORE_USER_FILTERED_CATEGORIES

} from './actionTypes';
import { API, Auth } from 'aws-amplify';
import {uiStartLoading,uiStopLoading,modalClose} from './ui';

export const fetchCategories = () => {
    return async dispatch=>{
        dispatch(uiStartLoading());
        
        const apiName = 'receiptCategories';
        const path = '/categories';
       
       try{
       const response=  await API.get(apiName, path);
       
       
       dispatch(storeCategories(response));
       dispatch(uiStopLoading());

       }
       catch(err){
           console.log('Failed to fetch latest Receipts'+err);
           dispatch(uiStopLoading());
       }

    }
};

export const addCategory=(category)=>{
    return {
        type:ADD_CATEGORY,
        category:category
    }
}

export const storeCategories=(categories)=>{
return {
    type:STORE_CATEGORIES,
    categories:categories
}
}

export const addNewCategory=(category)=>{
    return async dispatch=>{
        dispatch(uiStartLoading());
        const apiName = 'receiptCategories';
        const path = '/categories';
       
        const data = {
       
            body: {
                  ...category
              }
          }

       try{

       const response=  await API.put(apiName, path,data);
       
       
       dispatch(addCategory(category));
       dispatch(uiStopLoading());

       }
       catch(err){
           console.log('Failed to fetch latest Receipts'+err);
           dispatch(uiStopLoading());
       }
    }
};

export const storeUserFilteredCategories=(categories)=>{
    return {
        type:STORE_USER_FILTERED_CATEGORIES,
        categories:categories
    }
}

