import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Session } from 'meteor/session';

const AuthRoute = ({
  auth,
  component: Component,
  lng,
  render: originalRender,
  redirection,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => {
      console.log('From AuthRoute. props:', props);

      let goal;
      if (originalRender) {
        goal = originalRender(props);
      } else if (Component) {
        goal = <Component {...props} />;
      } else {
        throw new Meteor.Error('goal-needed', 'A component or a render function must be provided to the AuthRoute');
      }

      if (redirection) {
        console.log(`Authenticated ? ${!!Meteor.userId()}. Page for ? ${auth ? 'logged in' : 'unlogged'} visitors:`);
        Session.set('currentPagePrivacy', !!Meteor.userId() ? 'auth' : 'unauth');
        if (auth === !!Meteor.userId()) {
          console.log(`OK, go to location: "${props.location.pathname}"`);
          return goal;
        }
        console.log(`Redirection to: "${redirection}" from location: "${props.location.pathname}" (match: "${props.match.path}")`);
        return (
          <Redirect to={{
            pathname: redirection,
            state: { from: props.location },
          }}
          />
        );
      }
      console.log('No redirection, go to goal. goal:', goal);
      Session.set('currentPagePrivacy', undefined);
      return goal;
    }}
  />
);

export default AuthRoute;
