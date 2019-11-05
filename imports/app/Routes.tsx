import React from 'react';
import { Switch } from 'react-router-dom';

import AuthRoute from './AuthRoute';
import NotFound from '../ui/NotFound';
import SearchPage from '../ui/SearchPage';
import DashboardPage from '../ui/Dashboard';
import SignUp from '../ui/signInUp/SignUp';
import SignIn from '../ui/signInUp/SignIn';

import routesPaths from './routesPaths';

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
        path="/*"
        component={NotFound}
      />
    </Switch>
  );
};

export default Routes;
