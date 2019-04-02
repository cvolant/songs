import { Meteor } from "meteor/meteor";
import React from "react";
import { BrowserRouter as Router, Switch, Link } from 'react-router-dom';
import { Session } from 'meteor/session';

import AuthRoute from './AuthRoute';
import NotFound from "../ui/NotFound";
import Dashboard from '../ui/Dashboard';
import SignUp from "../ui/SignUp";
import SignIn from "../ui/SignIn";

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
  }
};