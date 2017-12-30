import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import Router from "./js/containers/Router";
import store from "./js/store";

// eslint-disable-next-line
__webpack_public_path__ = window.baseURL + "static/js/";

ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>, document.getElementById("root"));

