import { Meteor } from "meteor/meteor";
import ReactDOM from "react-dom";
import { Tracker } from "meteor/tracker";
import { browserHistory } from 'react-router';
import { Session } from 'meteor/session';

import { routes, onAuthChange } from "../imports/routes/routes";
import '../imports/startup/simple-schema-configuration.js';

Tracker.autorun(() => {
  const isAuthenticated = !!Meteor.userId();
  const currentPagePrivacy = Session.get('currentPagePrivacy');
  onAuthChange(isAuthenticated, currentPagePrivacy);
});

Tracker.autorun(() => {
  const selectedNodeId = Session.get('selectedNodeId');
  Session.set('isNavOpen', false);
  if (selectedNodeId) {
    browserHistory.replace(`/dashboard/${selectedNodeId}`);
  } else {
    browserHistory.replace(`/dashboard`);
  }
});

Tracker.autorun(() => {
  const isNavOpen = Session.get('isNavOpen');
  document.body.classList.toggle('is-nav-open', isNavOpen);
});

Meteor.startup(() => {
  Session.set('selectedNodeId', undefined);
  Session.set('isNavOpen', false);
  ReactDOM.render(routes, document.getElementById("app"));
});