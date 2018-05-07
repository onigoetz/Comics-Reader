/* global process */
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import rootReducer from "./reducers/index";
import { loadBooks } from "./reducers/books";
import { loadRead } from "./reducers/read";

const middleware = [thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middleware)));

// Load this data as soon as possible
store.dispatch(loadBooks());
store.dispatch(loadRead());

export default store;
