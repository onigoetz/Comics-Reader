import { useEffect, useState, useCallback, useRef } from "react";

import { useAuth } from "../hoc/withAuth";
import { fetchWithAuth } from "../fetch";

// Ideally we would use useSWR here but it seems to clash with some module
// So we're falling back to this custom made hook
export default function useFetch(url) {
  const { token } = useAuth();

  const inFlight = useRef(false);

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const doTry = useCallback(async () => {
    if (inFlight.current) {
      // Another request is already in progress
      // multiple clicks on retry ?
      return;
    }

    try {
      inFlight.current = true;
      setError(null);

      // Display loading state after a few milliseconds
      // If the server replies fast it avoids a flash of a loading spinner
      setTimeout(() => {
        if (inFlight.current) {
          setLoading(true);
        }
      }, 300);

      const response = await fetchWithAuth(token, url);
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
