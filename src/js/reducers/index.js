import { combineReducers } from "redux";

import books, { loadBooks } from "./books";
import pages from "./pages";
import read, { loadRead } from "./read";
import route from "./route";
import auth from "./auth";

export function loadUserData(dispatch) {
  dispatch(loadBooks());
  dispatch(loadRead());
}

export default combineReducers({
  books,
  pages,
  read,
  route,
  auth
});
