import React from 'react';
import { Switch } from 'react-router-dom';

import AboutPage from '../ui/About';
import AuthRoute from './AuthRoute';
import NotFoundPage from '../ui/NotFound';
import SearchPage from '../ui/Search';
import DashboardPage from '../ui/Dashboard';
import SignUpPage from '../ui/Authentication/SignUpPage';
import SignInPage from '../ui/Authentication/SignInPage';
import BroadcastPage from '../ui/Broadcast/BroadcastPage';

import getPath from './utils';

interface IRoutesProps {
  lng: string;
}

export const Routes: React.FC<IRoutesProps> = ({
  lng,
}) => (
  <Switch>
    <AuthRoute
      exact
      path={getPath(lng, 'home')}
      component={SearchPage}
    />
    <AuthRoute
      path={getPath(lng, 'song', ':slug')}
      component={SearchPage}
    />
    <AuthRoute
      exact
      path={getPath(lng, 'about')}
      component={AboutPage}
    />
    <AuthRoute
      exact
      path={getPath(lng, 'signin')}
      component={SignInPage}
      auth={false}
      redirection="dashboard"
    />
    <AuthRoute
      exact
      path={getPath(lng, 'signup')}
      component={SignUpPage}
      auth={false}
      redirection="dashboard"
    />
    <AuthRoute
      path={getPath(lng, 'dashboard')}
      component={DashboardPage}
      auth
      redirection="home"
    />
    <AuthRoute
      exact
      path={getPath(lng, 'dashboard', 'broadcast', ':broadcastId')}
      component={BroadcastPage}
      auth
      redirection="home"
    />
    <AuthRoute
      exact
      path={getPath(lng, 'reception', ':broadcastId')}
      component={BroadcastPage}
    />
    <AuthRoute
      path="/*"
      component={NotFoundPage}
    />
  </Switch>
);

export default Routes;
