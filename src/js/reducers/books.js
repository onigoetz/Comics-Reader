import fetch from "../fetch";
import { TYPE_DIR, TYPE_BOOK } from "../types";
import { dirname, basename } from "../utils";

export const BOOK_LOAD_START = "BOOK_LOAD_START";
export const BOOK_LOAD_DONE = "BOOK_LOAD_DONE";
export const BOOK_LOAD_ERROR = "BOOK_LOAD_ERROR";

export function booksLoaded(books) {
  return { type: BOOK_LOAD_DONE, books };
}

export function booksLoadError(error) {
  return { type: BOOK_LOAD_ERROR, error };
}

export function booksLoadStart() {
  return { type: BOOK_LOAD_START };
}

export function loadBooks() {
  return dispatch => {
    dispatch(booksLoadStart());

    return fetch("books")
      .then(response => {
        dispatch(booksLoaded(response));
      })
      .catch(error => {
        dispatch(booksLoadError(error.message));
      });
  };
}

export function listBooksInside(allBooks, path) {
  return Object.keys(allBooks)
    .filter(key => key.indexOf(`${path}/`) === 0)
    .filter(key => allBooks[key].type === TYPE_BOOK);
}

const defaultState = {
  loading: false,
  error: false,
  books: {}
};

function cleanBook(key, entry) {
  entry.parent = dirname(key);
  entry.path = key;
  if (!entry.name) {
    entry.name = basename(key);
  }

  if (entry.books) {
    entry.loaded = true;
    entry.books = entry.books.map(book => (key ? `${key}/${book}` : book));
  }

  if (!entry.loaded) {
    entry.loaded = !!entry.books;
  }

  entry.type = entry.books ? TYPE_DIR : TYPE_BOOK;

  return entry;
}

function cleanBooks(data) {
  const cleanedData = {};

  Object.keys(data).forEach(key => {
    cleanedData[key] = cleanBook(key, data[key]);
  });

  return cleanedData;
}

export default function booksReducer(state = defaultState, action) {
  switch (action.type) {
    case BOOK_LOAD_START:
      return { ...state, loading: true, error: false };
    case BOOK_LOAD_DONE:
      return {
        ...state,
        loading: false,
        error: false,
        books: cleanBooks(action.books)
      };
    case BOOK_LOAD_ERROR:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}
