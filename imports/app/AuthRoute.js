import { Meteor } from "meteor/meteor";
import React from "react";
import { Route, Redirect } from 'react-router-dom';
import { Session } from 'meteor/session';

export default AuthRoute = (
  { component: Component, auth, redirection, linkChild, ...rest }
) => {

  return (
    <Route {...rest} render={props => {

      props.linkChild = linkChild;

      if (redirection) {
        console.log(`Authenticated ? ${!!Meteor.userId()}. Page for ? ${auth ? 'logged in' : 'unlogged'} visitors:`)
        Session.set('currentPagePrivacy', !!Meteor.userId() ? 'auth' : 'unauth');
        if (auth === !!Meteor.userId()) {
          console.log(`OK, go to location: "${props.location.pathname}"`);
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