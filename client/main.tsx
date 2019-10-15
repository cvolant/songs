import { Meteor } from 'meteor/meteor';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Loading from '../imports/ui/Loading';

import '../imports/client/load-fonts';
import './i18n';
const App = React.lazy(() => import('../imports/app/App'));

Meteor.startup(() => {
  ReactDOM.render((
    <Suspense fallback={<Loading />}>
      <Router>
        <Route path="/:lng?" component={App} />
      </Router>
    </Suspense>
  // eslint-disable-next-line no-undef
  ), document.getElementById('app'));
});
