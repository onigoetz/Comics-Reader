/* global process */
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

import rootReducer from "./reducers/index";
import {loadBooks} from "./reducers/books";
import { loadRead} from "./reducers/read";

const middleware = [ thunk ];
if (process.env.NODE_ENV !== "production") {
  middleware.push(createLogger());
}

const store = createStore(
  rootReducer,
  applyMiddleware(...middleware)
);

// Load this data as soon as possible
store.dispatch(loadBooks());
store.dispatch(loadRead());

export default store;