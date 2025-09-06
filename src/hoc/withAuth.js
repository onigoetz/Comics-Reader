/* global process */
import React, { createContext, useContext, useEffect } from "react";
import Router from "next/router";
import nextCookie from "next-cookies";
import cookie from "js-cookie";

import { fetchWithAuth } from "../fetch";
import { redirect, getDisplayName, getAuthMode } from "../utils";

const LOGOUT_KEY = "comics_logout";
const COOKIE_NAME = "comics_token";

export function login(token) {
  cookie.set(COOKIE_NAME, token, { expires: 1 });
  window.localStorage.setItem(COOKIE_NAME, token);
  Router.push("/");
}

export function logout() {
  cookie.remove(COOKIE_NAME);
  window.localStorage.removeItem(COOKIE_NAME);

  // to support logging out from all windows
  window.localStorage.setItem(LOGOUT_KEY, Date.now());
  Router.push("/login");
}

/**
 * Some devices (iPad) don't keep cookies when closing the page / app
 * This is here so that we can query the localStorage for the session token
 * If this token exists, we do a query on the server to check if it's valid and then we set the cookie's
 * value again so that server rendered pages can be rendered. Since SSR can't access localStorage
 */
export function tryLoginWithLocalStorage() {
  const token = window.localStorage.getItem(COOKIE_NAME);
  if (token) {
    fetchWithAuth(token, "list")
      .then(() => {
        login(token);
      })
      .catch(err => {
        /* eslint-disable-next-line no-console */
        console.error(err);
        window.localStorage.removeItem(COOKIE_NAME);
      });
  }
}

const AuthContext = createContext({
  token: null
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function withAuth(WrappedComponent) {
  function Component({ token, ...props }) {
    useEffect(() => {
      const syncLogout = event => {
        if (event.key === LOGOUT_KEY) {
          Router.push("/login");
        }
      };

      window.addEventListener("storage", syncLogout);

      return () => {
        window.removeEventListener("storage", syncLogout);
        window.localStorage.removeItem(LOGOUT_KEY);
      };
    }, []);

    return (
      <AuthContext.Provider value={{ token }}>
        <WrappedComponent {...props} />
      </AuthContext.Provider>
    );
  }

  Component.getInitialProps = async ctx => {
    const authMode = await getAuthMode();

    let token = null;
    if (authMode === "db") {
      const cookies = nextCookie(ctx);
      token = cookies[COOKIE_NAME];

      // We're logged out when the password change is applied
      if (!token) {
        redirect(ctx.res, Router, "/login");
        return {};
      }
    }

    ctx.token = token;

    const componentProps =
      WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx));

    return { ...componentProps, token };
  };

  Component.displayName = `withAuth(${getDisplayName(WrappedComponent)})`;

  return Component;
}
