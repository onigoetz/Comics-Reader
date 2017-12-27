import fetch from "../fetch";

export const PAGES_LOAD_DONE = "PAGES_LOAD_DONE";
export const PAGES_LOAD_ERROR = "PAGES_LOAD_ERROR";

export function pagesLoaded(id, pages) {
  return { type: PAGES_LOAD_DONE, id, pages };
}

export function pagesLoadError(error) {
  return { type: PAGES_LOAD_ERROR, error };
}

export function loadPages(id) {
  return dispatch => {
    return fetch(`books/${id}.json`)
      .then(response => {
        dispatch(pagesLoaded(id, response.pages));
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
      return { ...state, error: false, books: { ...state.books, [action.id]: action.pages } };
    case PAGES_LOAD_ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
}
