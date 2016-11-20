import React from "react";
import ReactDOM from "react-dom";
import Router from "react-router/BrowserRouter";
import Match from "react-router/Match";
import Miss from "react-router/Miss";
import ListManager from "./js/containers/ListManager";
import BookManager from "./js/containers/BookManager";

import "react-photoswipe/lib/photoswipe.css";

ReactDOM.render(<Router basename={window.baseURL}>
    <div>
        <Match pattern="/list/:path" component={ListManager}/>
        <Match pattern="/book/" component={BookManager}/>
        <Miss render={() => <ListManager /> }/>
    </div>
</Router>, document.getElementById('root'));

