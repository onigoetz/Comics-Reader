import ChangePasswordForm from "./ChangePasswordForm";
import { checkAuth, getToken } from "../../serverutils";

export default function Page() {
  checkAuth();

  const token = getToken();

  return <ChangePasswordForm token={token} />;
}
