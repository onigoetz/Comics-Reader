import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { fetchWithAuth } from "../fetch";
import { navigate } from "../reducers/route";
import logout from "../logout";
import Loading from "../components/Loading";
import { authMode } from "../utils";

class ChangePassword extends Component {
  state = {
    current_password: "",
    password: "",
    confirm_password: "",
    loading: false,
    error: null
  };

  componentDidMount() {
    this.props.dispatch(navigate("Change Password", "/change_password", {}));
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.arePasswordsDifferent()) {
      return;
    }

    fetchWithAuth(this.props.auth.token, "change_password", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        current_password: this.state.current_password,
        password: this.state.password
      })
    })
      .then(() => {
        this.setState({ loading: false, error: null });
        logout(this.props.dispatch);
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });

    this.setState({ loading: true, error: null });
  };

  arePasswordsDifferent() {
    return (
      this.state.confirm_password !== this.state.password
    );
  }

  render() {
    // We're logged out when the password change is applied
    // Redirect when auth mode isn't db
    if (!this.props.auth.token || authMode() !== "db") {
      return (
        <Redirect to={{ pathname: "/", state: { from: "/change_password" } }} />
      );
    }

    return (
      <form className="Form" onSubmit={this.handleSubmit}>
        {this.state.error && (
          <div className="Message Message--error">{this.state.error}</div>
        )}

        {this.state.loading && <Loading />}

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
          {this.state.confirm_password && this.arePasswordsDifferent() && (
            <span className="Label__text">Passwords are different</span>
          )}
        </label>

        <div style={{ textAlign: "right" }}>
          <button
            className="Button Button--big"
            disabled={!this.state.password || this.arePasswordsDifferent() || this.state.loading}
          >
            Change
          </button>
        </div>
      </form>
    );
  }
}

export default connect(state => ({ auth: state.auth }))(ChangePassword);
