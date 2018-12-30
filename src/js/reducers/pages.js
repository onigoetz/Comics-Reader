import { fetchWithAuth } from "../fetch";
import { LOGOUT } from "./auth";

export const PAGES_LOAD_DONE = "PAGES_LOAD_DONE";
export const PAGES_LOAD_ERROR = "PAGES_LOAD_ERROR";

export function pagesLoaded(id, pages) {
  return { type: PAGES_LOAD_DONE, id, pages };
}

export function pagesLoadError(error) {
  return { type: PAGES_LOAD_ERROR, error };
}

export function loadPages(id) {
  return (dispatch, getState) => {
    return fetchWithAuth(getState().auth.token, `books/${id}`)
      .then(response => {
        dispatch(pagesLoaded(id.replace(/%23/g, "#"), response));
      })
      .catch(error => {
        dispatch(pagesLoadError(error.message));
      });
  };
}

const defaultState = {
  loading: false,
  error: false,
  books: {}
};

export default function pagesReducer(state = defaultState, action) {
  switch (action.type) {
    case PAGES_LOAD_DONE:
      return {
        ...state,
        error: false,
        books: { ...state.books, [action.id]: action.pages }
      };
    case PAGES_LOAD_ERROR:
      return { ...state, error: action.error };
    case LOGOUT:
      return defaultState;
    default:
      return state;
  }
}
