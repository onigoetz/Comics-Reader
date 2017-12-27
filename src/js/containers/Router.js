import Async from "react-code-splitting";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import React, { Component } from "react";
import { connect } from "react-redux";

import Loading from "../components/Loading";
import ListManager from "./ListManager";
import { loadBooks } from "../reducers/books";

const BookManager = props => (
  <Async componentProps={props} load={import("./BookManager")} />
);

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
        <div>
          <Switch>
            <Route path="/list/:path" component={ListManager} />
            <Route path="/book/" component={BookManager} />
            <Route render={props => <ListManager {...props} />} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default connect(state => ({ books: state.books }))(Router);
