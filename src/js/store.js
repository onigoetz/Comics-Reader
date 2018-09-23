/* global process */
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import rootReducer, {loadUserData} from "./reducers/index";

const middleware = [thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middleware)));

if (store.getState().auth.token) {
  loadUserData(store.dispatch);
}


export default store;
