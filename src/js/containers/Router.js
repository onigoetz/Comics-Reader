import Async from "react-code-splitting";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import React, { Component } from "react";
import { connect } from "react-redux";
import ScrollMemory from "react-router-scroll-memory";

import Header from "./Header";
import Loading from "../components/Loading";
import ListManager from "./ListManager";
import Login from "./Login";
import Logout from "./Logout";
import { loadBooks } from "../reducers/books";

const BookManager = props => (
  <Async componentProps={props} load={import(/* webpackChunkName: "book" */"./BookManager")} />
);

function PrivateRoute ({component: C, render, authed, ...rest}) {

  const rendering = (props) => C ? <C {...props} /> : render(props);

  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? rendering(props)
        : <Redirect to={{pathname: "/login", state: {from: props.location}}} />}
    />
  );
}

class Router extends Component {
  handleRetry = () => {
    this.props.dispatch(loadBooks());
  };

  render() {
    if (this.props.books.error) {
      return (
        <div>
          <h1>Failed to load books with error:</h1>
          <p>
            <strong>{this.props.books.error}</strong>
            <button onClick={this.handleRetry}>Retry</button>
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
            <PrivateRoute authed={!!this.props.token} path="/logout" component={Logout} />
            <PrivateRoute authed={!!this.props.token} path="/list/:path" component={ListManager} />
            <PrivateRoute authed={!!this.props.token} path="/book/" component={BookManager} />
            <PrivateRoute authed={!!this.props.token} render={props => <ListManager {...props} />} />
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default connect(state => ({ token: state.auth.token, books: state.books }))(Router);
