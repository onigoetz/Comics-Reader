import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import Router from "./containers/Router";
import { RawLoading } from "./components/Loading";
import store from "./store";

// eslint-disable-next-line
__webpack_public_path__ = window.baseURL + "static/js/";

const container = document.getElementById("root");

if (window.indexReady) {
  ReactDOM.render(
    <Provider store={store}>
      <Router />
    </Provider>,
    container
  );
} else {
  ReactDOM.render(
    <RawLoading>
      Scanning for Comics...
      <br />
      <small>This might take a while, come back later</small>
    </RawLoading>,
    container
  );
}
