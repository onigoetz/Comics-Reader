import { useEffect, useState, useCallback, useRef } from "react";

import { useAuth } from "../auth/auth";
import { fetchWithAuth } from "../fetch";

export default function useFetch<T>(url: string) {
  const { token } = useAuth();

  const inFlight = useRef(false);

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  const doTry = useCallback(async () => {
    if (inFlight.current) {
      return;
    }

    try {
      inFlight.current = true;
      setError(null);

      setTimeout(() => {
        if (inFlight.current) {
          setLoading(true);
        }
      }, 300);

      const response = await fetchWithAuth<T>(token, url);
      setData(response);
    } catch (err) {
      setError(err);
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, [token, url]);

  useEffect(() => {
    doTry();
  }, [doTry]);

  return { data, error, loading, retry: doTry };
}
