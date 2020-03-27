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
      exact
      path={getPath(lng, 'dashboard')}
      component={DashboardPage}
      auth
      redirection="home"
    />
    <AuthRoute
      exact
      path={getPath(lng, 'dashboard', UserCollectionName.FavoriteSongs)}
      render={(): React.ReactElement => (
        <DashboardPage urlCollection={UserCollectionName.FavoriteSongs} />
      )}
      auth
      redirection="home"
    />
    <AuthRoute
      exact
      path={getPath(lng, 'dashboard', UserCollectionName.CreatedSongs)}
      render={(): React.ReactElement => (
        <DashboardPage urlCollection={UserCollectionName.CreatedSongs} />
      )}
      auth
      redirection="home"
    />
    <AuthRoute
      exact
      path={getPath(lng, 'dashboard', UserCollectionName.Folders)}
      render={(): React.ReactElement => (
        <DashboardPage urlCollection={UserCollectionName.Folders} />
      )}
      auth
      redirection="home"
    />
    <AuthRoute
      exact
      path={getPath(lng, 'dashboard', 'broadcast', ':broadcastId')}
      render={
        ({ match }: {
          match: {
            params: {
              broadcastId: string;
            };
          };
        }): React.ReactElement => <BroadcastPage broadcastId={match.params.broadcastId} />
      }
      auth
      redirection="home"
    />
    <AuthRoute
      exact
      path={getPath(lng, 'reception', ':broadcastId')}
      render={
        ({ match }: {
          match: {
            params: {
              broadcastId: string;
            };
          };
        }): React.ReactElement => <BroadcastPage broadcastId={match.params.broadcastId} />
      }
    />
    <AuthRoute
      path="/*"
      component={NotFoundPage}
    />
  </Switch>
);

export default Routes;
