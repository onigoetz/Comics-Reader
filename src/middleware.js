import { NextResponse } from "next/server";
//import type { NextRequest } from 'next/server'

import { getAuthMode } from "./utils";
import apiFetch from "./fetch";

const accountManagementURLs = /^\/(login|logout|change_password).*/;
const loginURLs = /^\/login.*/;

export async function middleware(request) {
  const authMode = await getAuthMode();

  // Make sure a valid token is in the cookies for all pages except the login page
  if (authMode === "db" && !loginURLs.test(request.nextUrl.pathname)) {
    const token = request.cookies.get("comics_token");

    // We're logged out when the password change is applied
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // These pages shouldn't be accessible when DB auth is disabled
  if (authMode !== "db" && accountManagementURLs.test(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Make sure the index is ready before showing the page
  const indexData = await apiFetch("indexready");
  if (!indexData.ready && !accountManagementURLs.test(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/index_not_ready", request.url));
  }

  // All good. nothing to change
  return undefined;
}

export const config = {
  matcher: ["/((?!api|static|favicon.ico|_next).*)"]
};
