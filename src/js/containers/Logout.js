import { Component } from "react";
import { connect } from "react-redux";

import { logout } from "../reducers/auth";

class Logout extends Component {
  componentDidMount() {
    this.props.dispatch(logout());
    localStorage.removeItem("comics_id_token");
    window.location.reload();
  }

  render () {
    return null;
  }
}

export default connect()(Logout);
