import { combineReducers } from "redux";

import books, { loadBooks } from "./books";
import pages from "./pages";
import read, { loadRead } from "./read";
import route from "./route";
import auth from "./auth";

export function loadUserData(dispatch) {
  const loadingBooks = dispatch(loadBooks());
  const loadingRead = dispatch(loadRead());

  return Promise.all([loadingBooks, loadingRead]);
}

export default combineReducers({
  books,
  pages,
  read,
  route,
  auth
});
