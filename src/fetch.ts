function onlySuccess<T>(v: Response): Promise<T> {
  if (v.status !== 200) {
    throw new Error(
      `Failed with status ${v.status} and message: ${v.statusText}`
    );
  }

  return v.json();
}

export default function apiFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const fetchOptions: RequestInit = {
    method: "GET",
    credentials: "include",
    ...options,
    headers: { Accept: "application/json", ...(options.headers || {}) }
  };

  const serverSide = typeof window === "undefined";
  const baseUrl = serverSide ? process.env.SERVER_URL : "/";

  return fetch(`${baseUrl}api/${url}`, fetchOptions).then(v =>
    onlySuccess<T>(v)
  );
}

export function fetchWithAuth<T = any>(
  token: string | null,
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const fetchOptions = { ...options, headers };

  return apiFetch<T>(url, fetchOptions);
}
