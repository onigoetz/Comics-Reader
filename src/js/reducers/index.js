import { combineReducers } from "redux";

import books from "./books";
import pages from "./pages";
import read from "./read";
import route from "./route";

export default combineReducers({
  books,
  pages,
  read,
  route
});