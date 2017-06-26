import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import ListManager from "./js/containers/ListManager";
import BookManager from "./js/containers/BookManager";

import "./css/app.scss";
import "react-photoswipe/lib/photoswipe.css";

ReactDOM.render(<BrowserRouter basename={window.baseURL}>
    <div>
        <Switch>
            <Route path="/list/:path" component={ListManager}/>
            <Route path="/book/" component={BookManager}/>
            <Route render={props => <ListManager {...props} /> }/>
        </Switch>
    </div>
</BrowserRouter>, document.getElementById('root'));

