import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { loadUserData } from "../reducers";
import { navigate } from "../reducers/route";
import { login } from "../reducers/auth";
import { authMode } from "../utils";

class Login extends Component {
  state = {
    username: "",
    password: ""
  };

  componentDidMount() {
    this.props.dispatch(navigate("Login", "/login", {}));
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();

    this.props
      .dispatch(login(this.state.username, this.state.password))
      .then(token => {
        localStorage.setItem("comics_id_token", token);
        return loadUserData(this.props.dispatch);
      });
  };

  render() {
    // Only redirect when books are loaded
    // Redirect when auth mode isn't db
    if (
      (this.props.auth.token && this.props.books_loaded) ||
      authMode() !== "db"
    ) {
      return <Redirect to={{ pathname: "/", state: { from: "/login" } }} />;
    }

    return (
      <form className="Form" onSubmit={this.handleSubmit}>
        {this.props.auth.errorMessage && (
          <div className="Message Message--error">
            {this.props.auth.errorMessage}
          </div>
        )}

        <label className="Label">
          Username
          <input
            className="Input"
            name="username"
            onChange={this.handleChange}
          />
        </label>

        <label className="Label">
          Password
          <input
            className="Input"
            name="password"
            type="password"
            onChange={this.handleChange}
          />
        </label>

        <div style={{ textAlign: "right" }}>
          <button className="Button Button--big">Submit</button>
        </div>
      </form>
    );
  }
}

export default connect(state => ({
  auth: state.auth,
  books_loaded: state.books.loaded
}))(Login);
