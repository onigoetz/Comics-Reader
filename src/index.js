import Async from "react-code-splitting";
import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Switch} from "react-router-dom";

import ListManager from "./js/containers/ListManager";
import "./js/polyfills";

// eslint-disable-next-line
__webpack_public_path__ = window.baseURL + "static/js/";

const BookManager = (props) => <Async componentProps={props} load={import("./js/containers/BookManager")} />;

ReactDOM.render(<BrowserRouter basename={window.baseURL}>
  <div>
    <Switch>
      <Route path="/list/:path" component={ListManager}/>
      <Route path="/book/" component={BookManager}/>
      <Route render={props => <ListManager {...props} /> }/>
    </Switch>
  </div>
</BrowserRouter>, document.getElementById("root"));

