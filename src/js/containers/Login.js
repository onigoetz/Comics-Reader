import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { loadUserData } from "../reducers";
import { navigate } from "../reducers/route";
import { login } from "../reducers/auth";

class Login extends Component {
  componentDidMount() {
    this.props.dispatch(navigate("Login", "/login", {}));
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();

    this.props.dispatch(login(this.state.username, this.state.password)).then((token) => {
      localStorage.setItem("comics_id_token", token);
      loadUserData(this.props.dispatch);
    });
  };

  render() {
    if (this.props.auth.token) {
      return <Redirect to={{ pathname: "/", state: { from: "/login" } }} />;
    }

    return (
      <form className="Form" onSubmit={this.handleSubmit}>
        <label className="Label">
          Username
          <input className="Input" name="username" onChange={this.handleChange} />
        </label>

        <label className="Label">
          Password
          <input className="Input"
            name="password"
            type="password"
            onChange={this.handleChange}
          />
        </label>

        <div style={{textAlign: "right"}}>
          <button className="Button Button--big">Submit</button>
        </div>
      </form>
    );
  }
}

export default connect(state => ({ auth: state.auth }))(Login);
