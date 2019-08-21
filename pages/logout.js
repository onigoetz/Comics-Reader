import { useEffect } from "react";
import Router from "next/router";
import withAuth, { logout } from "../src/hoc/withAuth";
import withDBMode from "../src/hoc/withDBMode";

function Logout() {
  useEffect(() => {
    logout();
    Router.push("/login");
  }, []);

  return null;
}

export default withDBMode(withAuth(Logout));
