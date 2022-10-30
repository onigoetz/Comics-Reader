import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import auth from "../server/auth";

export function getAuthMode() {
  return process.env.AUTH_MODE;
}

export function getToken() {
  if (getAuthMode() != "db") {
    return undefined;
  }

  const nextCookies = cookies();
  const token = nextCookies.get("comics_token");

  if (token && token.value) {
    return token.value;
  }

  return null
}

export function checkAuth() {
  if (getAuthMode() != "db") {
    return undefined;
  }

  const token = getToken();

  if (!token) {
    redirect("/login")
  }

  if (!auth.validateToken(token)) {
    // TODO :: could not validate token
    // TODO :: redirect on auth errors
  }
}
