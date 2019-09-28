import React from 'react';
import PropTypes from 'prop-types';
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
        component={SearchPage}
        // eslint-disable-next-line react/prop-types, react/jsx-props-no-spreading
        render={(props) => <SearchPage songId={props.match.params.id} {...props} />}
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
        component={Dashboard}
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

Routes.propTypes = {
  lng: PropTypes.string.isRequired,
};

export default Routes;
