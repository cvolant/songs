import React from 'react';
import { Switch } from 'react-router-dom';

import AuthRoute from './AuthRoute';
import NotFound from '../ui/NotFound';
import SearchPage from '../ui/SearchPage';
import DashboardPage from '../ui/Dashboard';
import SignUp from '../ui/signInUp/SignUp';
import SignIn from '../ui/signInUp/SignIn';

import routesPaths from './routesPaths';
import UserCollectionName from '../ui/Dashboard/UserCollectionName';

interface IRoutesProps {
  lng: string;
}

export const Routes: React.FC<IRoutesProps> = ({
  lng,
}) => {
  console.log('From Routes, render. lng', lng);

  return (
    <Switch>
      <AuthRoute
        exact
        path={routesPaths.path(lng, 'home')}
        component={SearchPage}
      />
      <AuthRoute
        exact
        path={routesPaths.path(lng, 'search')}
        component={SearchPage}
      />
      <AuthRoute
        exact
        path={routesPaths.path(lng, 'search', ':id')}
        render={
          ({ match }: {
            match: {
              params: {
                id: string;
              };
            };
          }): React.ReactElement => <SearchPage songId={match.params.id} />
        }
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
        path="/*"
        component={NotFound}
      />
    </Switch>
  );
};

export default Routes;
