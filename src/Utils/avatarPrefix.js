export const PLEASE_SELECT_CATEGORY='Please Select';
export const FOOD_CATEGORY='Food';
export const BILLS_CATEGORY='Bills and utilities';
export const AUTO_TRANSPORT_CATEGORY='Auto and Transport';
export const INTERNET_CATEGORY='Internet';
export const FUEL_CATEGORY='Fuel';
export const SHOPPING_CATEGORY='Shopping';
export const ELECTRONINCS_CATEGORY='Electronics';
export const HOUSEHOLD_CATEGORY='House hold';
export const HEALTH_CATEGORY='Health and fitness';
export const ENTERTAINMENT_CATEGORY='Entertainment';
export const PURCHASES_CATEGORY='Purchase';
export const TRAVEL_CATEGORY='Travel';
export const GROCERY_CATEGORY='Grocery';
export const SHOWS_AND_MOVIES_CATEGORY='Shows And Movies';
export const MISCELLANEOUS_CATEGORY='Miscellaneous';

export const CATEGORIES =
     [
         FOOD_CATEGORY,
        BILLS_CATEGORY,
        AUTO_TRANSPORT_CATEGORY,
        INTERNET_CATEGORY,
        FUEL_CATEGORY,
        SHOPPING_CATEGORY,
        ELECTRONINCS_CATEGORY,
        HOUSEHOLD_CATEGORY,
        HEALTH_CATEGORY,
        ENTERTAINMENT_CATEGORY,
        PURCHASES_CATEGORY,
        TRAVEL_CATEGORY,
        GROCERY_CATEGORY,
        SHOWS_AND_MOVIES_CATEGORY,
        MISCELLANEOUS_CATEGORY
    ];


export const getAvatarByCategory=(receiptCategory,categories)=>{
    
    if(categories){
        let mappedCategory= categories.filter(category=>{
            return receiptCategory===category.category
       });
       if(mappedCategory===undefined ||mappedCategory.length==0){
        return mappedCategory=  {
               text:receiptCategory.charAt(0).toUpperCase(),
               color:'#ef6c00'
           }
       }
       else {
        return {
            ...mappedCategory[0]
           };
       }
     
       
    }
    else {
        return  {
            text:receiptCategory.charAt(0).toUpperCase(),
            color:'#ef6c00'
        }
    }
  
}
export const getAvatarPrefix=(category)=>{
    switch(category){
        
        default :{
            return {
                text:category.charAt(0).toUpperCase(),
                color:'#ef6c00'
            }
        }

    }
}