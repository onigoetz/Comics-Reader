/* global fetch */
function onlySuccess(v) {
  if (v.status !== 200) {
    throw new Error(
      `Failed with status ${v.status} and message: ${v.statusText}`
    );
  }

  return v.json();
}

export default function(url, options = {}) {
  const fetchOptions = {
    method: "GET",
    credentials: "include",
    ...options,
    headers: { Accept: "application/json", ...options.headers || {} }
  };

  return fetch(`${window.baseURL}api/${url}`, fetchOptions).then(onlySuccess);
}
