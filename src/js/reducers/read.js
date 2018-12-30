import { fetchWithAuth } from "../fetch";
import { LOGOUT } from "./auth";

export const READ_LOAD_DONE = "READ_LOAD_DONE";
export const READ_ADD = "READ_ADD";

export function readLoaded(read) {
  return { type: READ_LOAD_DONE, read };
}

export function readLoadError(error) {
  return { type: READ_LOAD_DONE, error };
}

export function markRead(book) {
  return (dispatch, getState) => {
    return fetchWithAuth(getState().auth.token, `read/${book}`, {
      method: "POST"
    })
      .then(response => {
        dispatch(readLoaded(response));
      })
      .catch(error => {
        dispatch(readLoadError(error.message));
      });
  };
}

export function loadRead() {
  return (dispatch, getState) => {
    return fetchWithAuth(getState().auth.token, "read")
      .then(response => {
        dispatch(readLoaded(response));
      })
      .catch(error => {
        dispatch(readLoadError(error.message));
      });
  };
}

export function isRead(list, path) {
  return list.indexOf(path) > -1;
}

const defaultState = {
  read: []
};

export default function booksReducer(state = defaultState, action) {
  switch (action.type) {
    case READ_LOAD_DONE:
      return { ...state, read: action.read };
    case LOGOUT:
      return defaultState;
    default:
      return state;
  }
}
