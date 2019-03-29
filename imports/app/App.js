import { Meteor } from "meteor/meteor";
import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom';
import { Session } from 'meteor/session';

import AuthRoute from './AuthRoute';
import NotFound from "../ui/NotFound";
import Signup from "../ui/Signup";
import Dashboard from '../ui/Dashboard';
import Login from "../ui/Login";

export class App extends React.Component {
  constructor(props) {
    super(props);

    Tracker.autorun(() => {
      const isNavOpen = Session.get('isNavOpen');
      document.body.classList.toggle('is-nav-open', isNavOpen);
    });

    Tracker.autorun(() => {
      const isAuthenticated = !!Meteor.userId();
      const currentPagePrivacy = Session.get('currentPagePrivacy');
      const isUnauthenticatedPage = currentPagePrivacy === 'unauth';
      const isAuthenticatedPage = currentPagePrivacy === 'auth';

      if (isUnauthenticatedPage && isAuthenticated)
        this.props.history.replace("/dashboard");
      else if (isAuthenticatedPage && !isAuthenticated)
        this.props.history.replace("/");
    });

    Tracker.autorun(() => {
      const selectedNoteId = Session.get('selectedNoteId');
      Session.set('isNavOpen', false);
      if (selectedNoteId) {
        props.history.push(`/dashboard/${selectedNoteId}`);
      } else {
        props.history.push(`/dashboard`);
      }
    });
  }

  render() {
    return (
      <div>
        <Switch>
          <AuthRoute
            exact path="/"
            component={Login}
            auth={false}
            redirection='/dashboard'
            linkChild={<Link to='/signup'>Need an account?</Link>}
          />
          <AuthRoute
            path="/signup"
            component={Signup}
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
            component={Dashboard}
            auth={true}
            redirection='/'
          />
          <AuthRoute
            path="/*"
            component={NotFound}
          />
        </Switch>
      </div>
    );
  }
};

export const onAuthChange = (history, isAuthenticated, currentPagePrivacy) => {
};