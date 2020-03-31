import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React, { Suspense } from 'react';
import { Route as RouterRoute, Redirect } from 'react-router-dom';

import Loading from '../ui/Loading';
import PageComponents from './PageComponents';
import { IRouteProps } from '../types/routeTypes';


export const Route: React.FC<IRouteProps> = ({
  path,
  exact,
  auth,
  componentName,
  redirection,
}) => (
  <RouterRoute
    exact={exact}
    path={path}
    render={(renderProps): React.ReactNode => {
      // console.log('From Route. renderProps:', renderProps);

      if (redirection) {
        /* console.log(
          `Authenticated ? ${!!Meteor.userId()}.`,
          `Page for ? ${auth ? 'logged in' : 'unlogged'} visitors:`
        ); */
        Session.set('currentPagePrivacy', Meteor.userId() ? 'auth' : 'unauth');

        if (auth === !Meteor.userId()) {
          /* console.log(
            `Redirection to: "${redirection}" from location: "${renderProps.location.pathname}"`,
            `(match: "${renderProps.match.path}")`,
          ); */
          return (
            <Redirect to={{
              pathname: redirection,
              state: { from: renderProps.location },
            }}
            />
          );
        }
      } else {
        // console.log('No redirection, go to goal. goal:', goal);
        Session.set('currentPagePrivacy', undefined);
      }

      const Component = PageComponents[componentName];
      return (
        <Suspense fallback={<Loading />}>
          <Component />
        </Suspense>
      );
    }}
  />
);

export default Route;
