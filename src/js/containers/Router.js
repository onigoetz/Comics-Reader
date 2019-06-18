import Async from "react-code-splitting";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import React, { Component } from "react";
import { connect } from "react-redux";
import ScrollMemory from "react-router-scroll-memory";

import Header from "./Header";
import Loading from "../components/Loading";
import ListManager from "./ListManager";
import Logout from "./Logout";
import logout from "../logout";
import { loadBooks } from "../reducers/books";
import { authMode } from "../utils";

const BookManager = props => (
  <Async
    componentProps={props}
    load={import(/* webpackChunkName: "book" */ "./BookManager")}
  />
);

const Login = props => (
  <Async
    componentProps={props}
    load={import(/* webpackChunkName: "auth" */ "./Login")}
  />
);

const ChangePassword = props => (
  <Async
    componentProps={props}
    load={import(/* webpackChunkName: "auth" */ "./ChangePassword")}
  />
);

function PrivateRoute({ component: C, render, authed, ...rest }) {
  const rendering = props => (C ? <C {...props} /> : render(props));

  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          rendering(props)
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}

class Router extends Component {
  handleRetry = () => {
    this.props.dispatch(loadBooks());
  };

  handleLogout = () => {
    logout(this.props.dispatch);
  };

  render() {
    const authed = authMode() === "db" ? !!this.props.token : true;

    if (this.props.books.error) {
      return (
        <div style={{ margin: "1em" }}>
          <h1>Failed to load books with error:</h1>
          <p>
            <strong>{this.props.books.error}</strong>
          </p>
          <p>
            <button className="Button" onClick={this.handleRetry}>
              Retry
            </button>{" "}
            {authMode() === "db" && authed && (
              <button className="Button" onClick={this.handleLogout}>
                Logout
              </button>
            )}
          </p>
        </div>
      );
    }

    if (this.props.books.loading) {
      return <Loading />;
    }

    return (
      <BrowserRouter basename={window.baseURL}>
        <React.Fragment>
          <ScrollMemory />
          <Header />
          <Switch>
            <Route path="/login" exact component={Login} />
            <PrivateRoute authed={authed} path="/logout" component={Logout} />
            <PrivateRoute
              authed={authed}
              path="/change_password"
              component={ChangePassword}
            />
            <PrivateRoute
              authed={authed}
              path="/list/:path"
              component={ListManager}
            />
            <PrivateRoute
              authed={authed}
              path="/book/"
              component={BookManager}
            />
            <PrivateRoute
              authed={authed}
              render={props => <ListManager {...props} />}
            />
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default connect(state => ({
  token: state.auth.token,
  books: state.books
}))(Router);
