import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Session } from 'meteor/session';

interface IAuthRouteProps {
  auth?: boolean;
  exact?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: React.ComponentType<any>;
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (props: any) => React.ReactNode;
  redirection?: string;
}

export const AuthRoute: React.FC<IAuthRouteProps> = ({
  auth,
  component: Component,
  exact,
  path,
  render: originalRender,
  redirection,
}) => (
  <Route
    exact={exact}
    path={path}
    render={(props): React.ReactNode => {
      console.log('From AuthRoute. props:', props);

      let goal: React.ReactNode;
      if (originalRender) {
        goal = originalRender(props);
      } else if (Component) {
        // eslint-disable-next-line react/jsx-props-no-spreading
        goal = <Component {...props} />;
      } else {
        throw new Meteor.Error('goal-needed', 'A component or a render function must be provided to the AuthRoute');
      }

      if (redirection) {
        console.log(`Authenticated ? ${!!Meteor.userId()}. Page for ? ${auth ? 'logged in' : 'unlogged'} visitors:`);
        Session.set('currentPagePrivacy', Meteor.userId() ? 'auth' : 'unauth');
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
