import { useEffect } from "react";
import {
  createFileRoute,
  getRouteApi,
  Outlet,
  redirect,
  useNavigate
} from "@tanstack/react-router";

import { AuthContext, getToken, LOGOUT_KEY } from "../auth/auth";

const route = getRouteApi("/_authed");

function AuthedLayout() {
  const { token } = route.useRouteContext();
  const navigate = useNavigate();

  useEffect(() => {
    const syncLogout = (event: StorageEvent) => {
      if (event.key === LOGOUT_KEY) {
        navigate({ to: "/login" });
      }
    };

    window.addEventListener("storage", syncLogout);

    return () => {
      window.removeEventListener("storage", syncLogout);
      window.localStorage.removeItem(LOGOUT_KEY);
    };
  }, [navigate]);

  return (
    <AuthContext value={{ token }}>
      <Outlet />
    </AuthContext>
  );
}

/**
 * Layout for all pages that need the authentication token
 * to query the API, the token is provided through `useAuth()`
 */
export const Route = createFileRoute("/_authed")({
  beforeLoad: ({ context }) => {
    let token: string | null = null;
    if (context.authMode === "db") {
      token = getToken();

      if (!token) {
        throw redirect({ to: "/login" });
      }
    }

    return { token };
  },
  component: AuthedLayout
});
