import React from "react";
import { Switch, Link } from 'react-router-dom';
import { Session } from 'meteor/session';

import AuthRoute from './AuthRoute';
import NotFound from "../ui/NotFound";
import Dashboard from '../ui/Dashboard';
import SignUp from "../ui/SignUp";
import SignIn from "../ui/SignIn";

export default Routes = () => {
    return (
      <Switch>
        <AuthRoute
          exact path="/"
          component={SignIn}
          auth={false}
          redirection='/dashboard'
          linkChild={<Link to='/signup'>Need an account?</Link>}
        />
        <AuthRoute
          path="/signup"
          component={SignUp}
          auth={false}
          redirection='/dashboard'
          linkChild={<Link to='/'>Already have an account?</Link>}
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
            Session.set("selectedNoteId", props.match.params.id);
            return <Dashboard {...props} />;
          }}
          auth={true}
          redirection='/'
        />
        <AuthRoute
          path="/*"
          component={NotFound}
        />
      </Switch>
    );
};