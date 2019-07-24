import { Meteor } from "meteor/meteor";
import React, { Suspense } from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Loading from '../imports/ui/Loading';
import App from "../imports/app/App";

import '../imports/client/load-fonts';
import './i18n';

Meteor.startup(() => {
  ReactDOM.render((
    <Suspense fallback={<Loading />}>
      <Router>
        <Route path="/:lng?" component={App} />
      </Router>
    </Suspense>
  ), document.getElementById("app"));
});