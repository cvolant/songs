import { Meteor } from "meteor/meteor";
import React from 'react';
import ReactDOM from "react-dom";
import { Tracker } from "meteor/tracker";
import { Router } from 'react-router';
import history from "../imports/routes/history";
import { Session } from 'meteor/session';

import { Routes, onAuthChange } from "../imports/routes/routes";
import '../imports/startup/simple-schema-configuration.js';

Tracker.autorun(() => {
  const isAuthenticated = !!Meteor.userId();
  const currentPagePrivacy = Session.get('currentPagePrivacy');
  onAuthChange(isAuthenticated, currentPagePrivacy);
});

Tracker.autorun(() => {
  const selectedNoteId = Session.get('selectedNoteId');
  Session.set('isNavOpen', false);
  if (selectedNoteId) {
    history.push(`/dashboard/${selectedNoteId}`);
  } else {
    history.push(`/dashboard`);
  }
});

Tracker.autorun(() => {
  const isNavOpen = Session.get('isNavOpen');
  document.body.classList.toggle('is-nav-open', isNavOpen);
});

/* Tracker.autorun(() => {
  const location = history.location;
  history.listen((location, action) => {
    console.log(action, location.pathname, location.state);
  });
}); */

Meteor.startup(() => {
  Session.set('selectedNoteId', undefined);
  Session.set('isNavOpen', false);
  ReactDOM.render((
    <Router history={history}>
      <Routes />
    </Router>
  ), document.getElementById("app"));
});