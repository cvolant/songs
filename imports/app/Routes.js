import React from 'react';
import { Switch } from 'react-router-dom';

import AuthRoute from './AuthRoute';
import NotFound from '../ui/NotFound';
import SearchPage from '../ui/SearchPage';
import Dashboard from '../ui/Dashboard';
import SignUp from '../ui/signInUp/SignUp';
import SignIn from '../ui/signInUp/SignIn';

import routesPaths from './routesPaths';

const Routes = ({ lng }) => {
  console.log('From Routes, render. lng', lng);

  return (
    <Switch>
      <AuthRoute
        exact
        path={routesPaths.path(lng, 'home')}
        lng={lng}
        component={SearchPage}
      />
      <AuthRoute
        exact
        path={routesPaths.path(lng, 'search')}
        lng={lng}
        component={SearchPage}
      />
      <AuthRoute
        exact
        path={routesPaths.path(lng, 'search', ':id')}
        lng={lng}
        component={SearchPage}
        render={(props) => <SearchPage songId={props.match.params.id} {...props} />}
      />
      <AuthRoute
        exact
        path={routesPaths.path(lng, 'signin')}
        lng={lng}
        component={SignIn}
        auth={false}
        redirection="dashboard"
      />
      <AuthRoute
        exact
        path={routesPaths.path(lng, 'signup')}
        lng={lng}
        component={SignUp}
        auth={false}
        redirection="dashboard"
      />
      <AuthRoute
        exact
        path={routesPaths.path(lng, 'dashboard')}
        lng={lng}
        component={Dashboard}
        auth
        redirection="home"
      />
      <AuthRoute
        path="/*"
        lng={lng}
        component={NotFound}
      />
    </Switch>
  );
};

export default Routes;
