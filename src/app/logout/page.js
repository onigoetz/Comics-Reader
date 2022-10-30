import { checkAuth } from "../../serverutils";

import Logout from "./Logout";

export default async function Page() {
  checkAuth();

  return (
    <Logout />
  );
}

