import { useEffect } from "react";
import Router from "next/router";
import withAuth, { logout } from "../hoc/withAuth";

function Logout() {
  useEffect(() => {
    logout();
    Router.push("/login");
  }, []);

  return null;
}

export default withAuth(Logout);
