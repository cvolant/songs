import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React, { Suspense, useMemo, ReactNode } from 'react';
import { Redirect, Route as RouterRoute, RouteComponentProps } from 'react-router-dom';

import Loading from '../ui/Loading';
import PageComponents from './PageComponents';
import { IRouteProps } from '../types/routeTypes';

export const Route: React.FC<IRouteProps> = (props) => {
  const {
    auth,
    exact,
    path,
    redirection,
    render,
  } = useMemo((): IRouteProps => {
    const result = { ...props };
    const {
      children,
      component,
      componentName,
    } = result;
    if (children) {
      result.render = (): ReactNode => children;
    }
    if (!result.render) {
      /* eslint-disable react/jsx-props-no-spreading */
      if (component) {
        const Component = component;
        result.render = (renderProps: RouteComponentProps): JSX.Element => (
          <Component {...renderProps} />
        );
      } else if (componentName) {
        const Component = PageComponents[componentName];
        result.render = (renderProps: RouteComponentProps): JSX.Element => (
          <Suspense fallback={<Loading />}>
            <Component {...renderProps} />
          </Suspense>
        );
      }
      /* eslint-enable react/jsx-props-no-spreading */
    }
    return result;
  }, [props]);

  return (
    <RouterRoute
      exact={exact}
      path={path}
      render={(renderProps): React.ReactNode => {
        if (redirection) {
          Session.set('currentPagePrivacy', Meteor.userId() ? 'auth' : 'unauth');

          if (auth === !Meteor.userId()) {
            return (
              <Redirect to={{
                pathname: redirection,
                state: { from: renderProps.location },
              }}
              />
            );
          }
        } else {
          Session.set('currentPagePrivacy', undefined);
        }

        return render ? render(renderProps) : null;
      }}
    />
  );
};
export default Route;
