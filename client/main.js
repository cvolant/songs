import { Meteor } from "meteor/meteor";
import React from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from "../imports/app/App";

Meteor.startup(() => {
  ReactDOM.render((
    <Router>
        <Route path="/" component={App} />
    </Router>
  ), document.getElementById("app"));
});