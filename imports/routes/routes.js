import { Meteor } from "meteor/meteor";
import React from "react";
import { Router, Route, browserHistory } from "react-router";

import NotFound from "../ui/NotFound";
import Signup from "../ui/Signup";
import Dashboard from '../ui/Dashboard';
import Login from "../ui/Login";
import { Session } from 'meteor/session';

const onEnterNotePage = (nextState) => {
  Session.set('selectedNodeId', nextState.params.id);
};
const onLeaveNotePage = () => {
  Session.set('selectedNodeId', undefined);
};


export const globalOnChange = (prevState, nextState) => {
  globalOnEnter(nextState);
}
export const globalOnEnter = (nextState) => {
  const lastRoute = nextState.routes[nextState.routes.length - 1];
  Session.set('currentPagePrivacy', lastRoute.privacy);
}

export const routes = (
  <Router history={browserHistory}>
    <Route onEnter={globalOnEnter} onChange={globalOnChange}>
      <Route path="/" component={Login} privacy='unauth' />
      <Route path="/signup" component={Signup} privacy='unauth' />
      <Route path="/dashboard" component={Dashboard} privacy='auth' />
      <Route path="/dashboard/:id" component={Dashboard} privacy='auth' onEnter={onEnterNotePage} onLeave={onLeaveNotePage} />
      <Route path="/*" component={NotFound} />
    </Route>
  </Router>
);

export const onAuthChange = (isAuthenticated, currentPagePrivacy) => {
  const isUnauthenticatedPage = currentPagePrivacy === 'unauth';
  const isAuthenticatedPage = currentPagePrivacy === 'auth';
  if (isUnauthenticatedPage && isAuthenticated) browserHistory.replace("/dashboard");
  else if (isAuthenticatedPage && !isAuthenticated) browserHistory.replace("/");
};