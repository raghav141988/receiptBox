import { createStore, combineReducers, compose,applyMiddleware } from 'redux';
import thunk from "redux-thunk";
import receiptReducer from './reducers/receipts';
import uiReducer from './reducers/ui';
import notificationReducer from './reducers/notifications';
import userDetailsReducer from './reducers/user';
const rootReducer = combineReducers({
    receipts: receiptReducer,
    ui:uiReducer,
    notification:notificationReducer,
    user:userDetailsReducer
});

let composeEnhancers = compose;

if (__DEV__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const configureStore = () => {
    const store =createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
    console.log(store);
    return store;
};

export default configureStore;