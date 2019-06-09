import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import logout from "../logout";
import { authMode } from "../utils";

class Logout extends Component {
  componentDidMount() {
    logout(this.props.dispatch);
  }

  render() {
    // Redirect when auth mode isn't db
    if (authMode() !== "db") {
      return <Redirect to={{ pathname: "/", state: { from: "/logout" } }} />;
    }

    return null;
  }
}

export default connect()(Logout);
