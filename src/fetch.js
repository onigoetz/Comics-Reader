/* global process */
import fetch from "isomorphic-unfetch";

function onlySuccess(v) {
  if (v.status !== 200) {
    throw new Error(
      `Failed with status ${v.status} and message: ${v.statusText}`
    );
  }

  return v.json();
}

export default function apiFetch(url, options = {}) {
  const fetchOptions = {
    method: "GET",
    credentials: "include",
    ...options,
    headers: { Accept: "application/json", ...(options.headers || {}) }
  };

  const serverSide = typeof window === "undefined";
  const baseUrl = serverSide ? process.env.SERVER_URL : "/";

  return fetch(`${baseUrl}api/${url}`, fetchOptions).then(onlySuccess);
}

export function fetchWithAuth(token, url, options = {}) {
  const headers = { ...(options.headers || {}) };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const fetchOptions = { ...options, headers };

  return apiFetch(url, fetchOptions);
}
