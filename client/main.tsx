import { Meteor } from 'meteor/meteor';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import Loading from '../imports/ui/Loading';

import '../imports/client/load-fonts';
import '../imports/i18n';
import '../imports/startup/client/serviceWorker';

const App = React.lazy(() => import('../imports/ui/App'));

Meteor.startup(() => {
  ReactDOM.render((
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  // eslint-disable-next-line no-undef
  ), document.getElementById('app'));
});
