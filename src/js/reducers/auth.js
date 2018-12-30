import fetch from "../fetch";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const LOGOUT = "LOGOUT";

const defaultState = {
  isFetching: false,
  token: localStorage.getItem("comics_id_token") || null
};

function loginRequest() {
  return {type: LOGIN_REQUEST};
}

function loginSuccess(token) {
  return {type: LOGIN_SUCCESS, token};
}

function loginFailure(message) {
  return {type: LOGIN_FAILURE, message};
}

export function login(username, password) {
  return dispatch => {

    loginRequest();

    return fetch("token", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({username, password})
    })
      .then(response => {
        dispatch(loginSuccess(response.token));
        return response.token;
      })
      .catch(error => {
        dispatch(loginFailure(error.message));
        throw error;
      });
  };
}

export function logout() {
  return { type: LOGOUT };
}

// The auth reducer. The starting state sets authentication
// based on a token being in local storage. In a real app,
// we would also want a util to check if the token is expired.
export default function auth(state = defaultState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {...state, isFetching: true };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        token: action.token,
        errorMessage: ""
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.message
      };
    case LOGOUT:
      return {
        ...state,
        isFetching: false,
        token: null
      };
    default:
      return state;
  }
}
