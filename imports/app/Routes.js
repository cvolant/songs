import React from "react";
import { Route, Switch } from 'react-router-dom';
import { Session } from 'meteor/session';

import AuthRoute from './AuthRoute';
import NotFound from "../ui/NotFound";
import SearchPage from '../ui/SearchPage';
import Dashboard from '../ui/Dashboard';
import SignUp from "../ui/signInUp/SignUp";
import SignIn from "../ui/signInUp/SignIn";

export default Routes = () => {
  return (
    <Switch>
      <AuthRoute
        exact path="/"
        component={SearchPage}
      />
      <AuthRoute
        exact path="/search"
        component={SearchPage}
      />
      <AuthRoute
        exact path="/search/:id"
        component={SearchPage}
        render={props => <SearchPage songId={props.match.params.id} {...props} />}
      />
      <AuthRoute
        exact path="/signin"
        component={SignIn}
        auth={false}
        redirection='/dashboard'
      />
      <AuthRoute
        exact path="/signup"
        component={SignUp}
        auth={false}
        redirection='/dashboard'
      />
      <AuthRoute
        exact path="/dashboard"
        component={Dashboard}
        auth={true}
        redirection='/'
      />
      <AuthRoute
        path="/dashboard/:id"
        render={props => {
          Session.set("selectedSongId", props.match.params.id);
          return <Dashboard {...props} />;
        }}
        auth={true}
        redirection='/'
      />
      <Route
        path="/*"
        component={NotFound}
      />
    </Switch>
  );
};