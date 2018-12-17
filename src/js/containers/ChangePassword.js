import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { navigate } from "../reducers/route";

class ChangePassword extends Component {
  state = {
    current_password: "",
    password: "",
    confirm_password: ""
  };

  componentDidMount() {
    this.props.dispatch(navigate("Change Password", "/change_password", {}));
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = () => {

  }

  arePasswordsDifferent() {
    return (
      this.state.confirm_password &&
      this.state.confirm_password !== this.state.password
    );
  }

  render() {

    // We're logged out when the password change is applied
    if (!this.props.auth.token) {
      return <Redirect to={{ pathname: "/", state: { from: "/change_password" } }} />;
    }

    return (
      <form className="Form" onSubmit={this.handleSubmit}>
        <label className="Label">
          Current Password
          <input
            className="Input"
            name="current_password"
            type="password"
            value={this.state.current_password}
            onChange={this.handleChange}
          />
        </label>

        <br />
        <label className="Label">
          New Password
          <input
            className="Input"
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
        </label>

        <label className="Label">
          Confirm Password
          <input
            className="Input"
            name="confirm_password"
            type="password"
            value={this.state.confirm_password}
            onChange={this.handleChange}
          />
          {this.arePasswordsDifferent() && (
            <span className="Label__text">Passwords are different</span>
          )}
        </label>

        <div style={{ textAlign: "right" }}>
          <button className="Button Button--big">Change</button>
        </div>
      </form>
    );
  }
}


export default connect(state => ({ auth: state.auth }))(ChangePassword);