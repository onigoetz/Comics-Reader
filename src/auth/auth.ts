import { createContext, use } from "react";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import cookie from "js-cookie";

import { fetchWithAuth } from "../fetch";

export const LOGOUT_KEY = "comics_logout";
const COOKIE_NAME = "comics_token";

type Navigate = (options: { to: "/" | "/login" }) => unknown;

export const getToken = createIsomorphicFn()
  .server(() => getCookie(COOKIE_NAME) ?? null)
  .client(() => cookie.get(COOKIE_NAME) ?? null);

export function login(navigate: Navigate, token: string) {
  cookie.set(COOKIE_NAME, token, { expires: 1 });
  window.localStorage.setItem(COOKIE_NAME, token);
  navigate({ to: "/" });
}

export function logout(navigate: Navigate) {
  cookie.remove(COOKIE_NAME);
  window.localStorage.removeItem(COOKIE_NAME);

  window.localStorage.setItem(LOGOUT_KEY, `${Date.now()}`);
  navigate({ to: "/login" });
}

/**
 * Some devices (iPad) don't keep cookies when closing the page / app
 * This is here so that we can query the localStorage for the session token
 * If this token exists, we do a query on the server to check if it's valid and then we set the cookie's
 * value again so that server rendered pages can be rendered. Since SSR can't access localStorage
 */
export function tryLoginWithLocalStorage(navigate: Navigate) {
  const token = window.localStorage.getItem(COOKIE_NAME);
  if (token) {
    fetchWithAuth(token, "list")
      .then(() => {
        login(navigate, token);
      })
      .catch(err => {
        console.error(err);
        window.localStorage.removeItem(COOKIE_NAME);
      });
  }
}

export const AuthContext = createContext<{ token: string | null }>({
  token: null
});

export function useAuth() {
  return use(AuthContext);
}
