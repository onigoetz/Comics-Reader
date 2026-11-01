import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { logout } from "../../auth/auth";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    logout(navigate);
  }, [navigate]);

  return null;
}

export const Route = createFileRoute("/_authed/logout")({
  component: Logout
});
