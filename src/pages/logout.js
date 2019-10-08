import { useEffect } from "react";
import Router from "next/router";
import withAuth, { logout } from "../hoc/withAuth";
import withDBMode from "../hoc/withDBMode";

function Logout() {
  useEffect(() => {
    logout();
    Router.push("/login");
  }, []);

  return null;
}

export default withDBMode(withAuth(Logout));
