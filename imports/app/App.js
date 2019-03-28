import { Meteor } from "meteor/meteor";
import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Session } from 'meteor/session';

import NotFound from "../ui/NotFound";
import Signup from "../ui/Signup";
import Dashboard from '../ui/Dashboard';
import Login from "../ui/Login";

function AuthRoute({ component: Component, auth, redirection, ...rest }) {
  return (
    <Route {...rest} render={props => {
      if (redirection) {
        console.log(`Authenticated ? ${!!Meteor.userId()}. Page for ? ${auth ? 'logged in' : 'unlogged'} visitors:`)
        Session.set('currentPagePrivacy', !!Meteor.userId() ? 'auth' : 'unauth');
        if (auth === !!Meteor.userId()) {
          console.log(`OK, go to location: "${props.location.pathname}" => Component = `, Component);
          return <Component {...props} />;
        } else {
          console.log(`Redirection to: "${redirection}" from location: "${props.location.pathname}" (match: "${props.match.path}")`);
          return <Redirect to={{
            pathname: redirection,
            state: { from: props.location }
          }} />;
        }
      } else {
        Session.set('currentPagePrivacy', undefined);
        return <Component {...props} />;
      }
    }} />
  );
}

export class Routes extends React.Component {
  constructor(props) {
    super(props);

    Tracker.autorun(() => {
      const isNavOpen = Session.get('isNavOpen');
      document.body.classList.toggle('is-nav-open', isNavOpen);
    });

    Tracker.autorun(() => {
      const isAuthenticated = !!Meteor.userId();
      const currentPagePrivacy = Session.get('currentPagePrivacy');
      onAuthChange(props.history, isAuthenticated, currentPagePrivacy);
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
        <AuthRoute exact path="/" component={Login} auth={false} redirection='/dashboard' />
        <AuthRoute path="/signup" component={Signup} auth={false} redirection='/dashboard' />
        <AuthRoute exact path="/dashboard" component={Dashboard} auth={true} redirection='/' />
        <AuthRoute path="/dashboard/:id" component={Dashboard} auth={true} redirection='/' />
        <AuthRoute path="/*" component={NotFound} />
      </Switch>
    );
  }
};

export const App = props => {
  return (
    <Router>
      <Route path="/" component={Routes} />
    </Router>
  );
}

export const onAuthChange = (history, isAuthenticated, currentPagePrivacy) => {
  const isUnauthenticatedPage = currentPagePrivacy === 'unauth';
  const isAuthenticatedPage = currentPagePrivacy === 'auth';
  if (isUnauthenticatedPage && isAuthenticated) { console.log('history.replace("/dashboard")'); history.replace("/dashboard"); }
  else if (isAuthenticatedPage && !isAuthenticated) { console.log('history.replace("/")'); history.replace("/"); }
};