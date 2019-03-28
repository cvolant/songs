import { Meteor } from "meteor/meteor";
import React from 'react';
import ReactDOM from "react-dom";
import { Tracker } from "meteor/tracker";
import { BrowserRouter as Router } from 'react-router-dom';
import { Session } from 'meteor/session';

import { App } from "../imports/app/App";
import '../imports/startup/simple-schema-configuration.js';

Meteor.startup(() => {
  Session.set('selectedNoteId', undefined);
  Session.set('isNavOpen', false);
  ReactDOM.render((
    <Router>
      <App />
    </Router>
  ), document.getElementById("app"));
});