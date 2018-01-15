/* global fetch */
function onlySuccess(v) {
  if (v.status !== 200) {
    throw new Error(
      `Failed with status ${v.status} and message: ${v.statusText}`
    );
  }

  return v.json();
}

export default function(url, options) {
  const fetchOptions = {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
    ...options
  };

  return fetch(`${window.baseURL}api/${url}`, fetchOptions).then(onlySuccess);
}
