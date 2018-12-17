import { Component } from "react";
import { connect } from "react-redux";

import logout from "../logout";

class Logout extends Component {
  componentDidMount() {
    logout(this.props.dispatch);
  }

  render () {
    return null;
  }
}

export default connect()(Logout);
