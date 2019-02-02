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



export const getAvatarPrefix=(category)=>{
    switch(category){
        case FOOD_CATEGORY:
        return {
           text:'F',
           color:'#4caf50'
        }
        case BILLS_CATEGORY:
        return {
            text:'B',
           color:'#5d4037'
        }
        case AUTO_TRANSPORT_CATEGORY:
        return {
            text:'AT',
            color:'#5c6bc0'
        }
        case INTERNET_CATEGORY:
        return {
            text:'I',
            color:'#5c6bc0'
        }
        case FUEL_CATEGORY:
        return {
            text:'F',
            color:'#4caf50'
        }
        case SHOPPING_CATEGORY:
        return {
            text:'S',
            color:'#4caf50'
        }
        case ELECTRONINCS_CATEGORY:
        return {
            text:'E',
            color:'#4caf50'
        }
        case HOUSEHOLD_CATEGORY:
        return {
            text:'H',
            color:'#4caf50'
        }
        case HEALTH_CATEGORY:
        return {
            text:'HF',
            color:'#5d4037'
            
        }
        case ENTERTAINMENT_CATEGORY:
        return {
            text:'E',
            color:'#4caf50'
        }
        case PURCHASES_CATEGORY:
        return {
            text:'P',
            color:'#5d4037'
        }
        case TRAVEL_CATEGORY:
        return {
            text:'T',
            color:'#5c6bc0'
        }
        case GROCERY_CATEGORY:
        return {
            text:'G',
            color:'#4caf50'
        }

        case SHOWS_AND_MOVIES_CATEGORY:
        return {
            text:'SM',
            color:'#4caf50'
        }
        case MISCELLANEOUS_CATEGORY:
        return {
            text:'M',
            color:'#546e7a'
        }
        default :{
            return {
                text:category.charAt(0).toUpperCase(),
                color:'#ef6c00'
            }
        }

    }
}