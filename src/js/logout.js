import { logout } from "./reducers/auth";

export default function(dispatch) {
  dispatch(logout());
  localStorage.removeItem("comics_id_token");
  //window.location.reload();
}
