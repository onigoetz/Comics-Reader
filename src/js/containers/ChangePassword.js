import React, { Component } from "react";

import Dialog from "../components/Dialog";

export default class ChangePassword extends Component {

  constructor(props) {
    super(props);

    this.state = {
      password: "",
      current_password: "",
      confirm_password: ""
    };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleExit = () => {
    console.log("Exit dialog");
  }

  arePasswordsDifferent() {
    return this.state.confirm_password && this.state.confirm_password !== this.state.password;
  }

  render() {
    return <Dialog title="Change password" onExit={this.handleExit}>
      <form onSubmit={this.handleSubmit}>
        <label className="Label">
          Current Password
          <input className="Input"
            name="current_password"
            type="password"
            value={this.state.current_password}
            onChange={this.handleChange}
          />
        </label>

        <br />
        <label className="Label">
          New Password
          <input className="Input"
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
        </label>

        <label className="Label">
          Confirm Password
          <input className="Input"
            name="confirm_password"
            type="password"
            value={this.state.confirm_password}
            onChange={this.handleChange}
          />
          {this.arePasswordsDifferent() && <span className="Label__text">Passwords are different</span>}
        </label>

        <div style={{textAlign: "right"}}>
          <button className="Button Button--big">Change</button>
        </div>
      </form>
    </Dialog>;
  }
}