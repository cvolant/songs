import React from 'react';
import { Switch } from 'react-router-dom';

import AboutPage from '../ui/About';
import AuthRoute from './AuthRoute';
import NotFoundPage from '../ui/NotFound';
import SearchPage from '../ui/Search';
import DashboardPage from '../ui/Dashboard';
import SignUp from '../ui/Authentication/SignUp';
import SignIn from '../ui/Authentication/SignIn';
import BroadcastFetcher from '../ui/Station/BroadcastFetcher';

import routesPaths from './routesPaths';
import UserCollectionName from '../ui/Dashboard/UserCollectionName';

interface IRoutesProps {
  lng: string;
}

export const Routes: React.FC<IRoutesProps> = ({
  lng,
}) => (
  <Switch>
    <AuthRoute
      exact
      path={routesPaths.path(lng, 'home')}
      component={SearchPage}
    />
    <AuthRoute
      path={routesPaths.path(lng, 'song', ':slug')}
      component={SearchPage}
    />
    <AuthRoute
      exact
      path={routesPaths.path(lng, 'about')}
      component={AboutPage}
    />
    <AuthRoute
      exact
      path={routesPaths.path(lng, 'signin')}
      component={SignIn}
      auth={false}
      redirection="dashboard"
    />
    <AuthRoute
      exact
      path={routesPaths.path(lng, 'signup')}
      component={SignUp}
      auth={false}
      redirection="dashboard"
    />
    <AuthRoute
      exact
      path={routesPaths.path(lng, 'dashboard')}
      component={DashboardPage}
      auth
      redirection="home"
    />
    <AuthRoute
      exact
      path={routesPaths.path(lng, 'dashboard', UserCollectionName.FavoriteSongs)}
      render={(): React.ReactElement => (
        <DashboardPage urlCollection={UserCollectionName.FavoriteSongs} />
      )}
      auth
      redirection="home"
    />
    <AuthRoute
      exact
      path={routesPaths.path(lng, 'dashboard', UserCollectionName.CreatedSongs)}
      render={(): React.ReactElement => (
        <DashboardPage urlCollection={UserCollectionName.CreatedSongs} />
      )}
      auth
      redirection="home"
    />
    <AuthRoute
      exact
      path={routesPaths.path(lng, 'dashboard', UserCollectionName.Folders)}
      render={(): React.ReactElement => (
        <DashboardPage urlCollection={UserCollectionName.Folders} />
      )}
      auth
      redirection="home"
    />
    <AuthRoute
      exact
      path={routesPaths.path(lng, 'dashboard', 'broadcast', ':broadcastId')}
      render={
        ({ match }: {
          match: {
            params: {
              broadcastId: string;
            };
          };
        }): React.ReactElement => <BroadcastFetcher broadcastId={match.params.broadcastId} />
      }
      auth
      redirection="home"
    />
    <AuthRoute
      exact
      path={routesPaths.path(lng, 'reception', ':broadcastId')}
      render={
        ({ match }: {
          match: {
            params: {
              broadcastId: string;
            };
          };
        }): React.ReactElement => <BroadcastFetcher broadcastId={match.params.broadcastId} />
      }
    />
    <AuthRoute
      path="/*"
      component={NotFoundPage}
    />
  </Switch>
);

export default Routes;
