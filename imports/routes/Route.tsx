import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React, { useMemo } from 'react';
import {
  Redirect,
  Route as RouterRoute,
  useLocation,
  useHistory,
} from 'react-router-dom';

import usePath from '../hooks/usePath';
import { IRouteProps } from '../types/routeTypes';

export const Route: React.FC<IRouteProps> = (props) => {
  const location = useLocation<{}>();
  const history = useHistory();
  // eslint-disable-next-line react/destructuring-assignment
  const { path: makePath } = usePath(`Route ${props.path}`);

  const routeProps = useMemo((): IRouteProps => {
    const {
      auth,
      children,
      component,
      path,
      render: initialRender,
      redirection,
      ...otherProps
    } = props;

    const stringPath = typeof path === 'object' ? [''].concat(path).join('/') : path || '';

    if (stringPath.includes(':')) {
      const {
        hash,
        pathname,
        search,
        state,
      } = location;
      const paramOccurences = [...stringPath.matchAll(/.+?:[^/?]+/g)];
      console.log('From Route. stringPath:', stringPath, 'location:', location, 'paramOccurences:', paramOccurences);

      if (paramOccurences.length > (state?.params ? state?.params.length : 0)) {
        const params = paramOccurences.reduce(
          (res, cv) => [
            ...res,
            cv[0].replace(/[^/]+/g, '').length + (res.length ? res[res.length - 1] : 0),
          ],
          [] as number[],
        );
        console.log('From Route. Adds params to location state.', pathname + search + hash, { ...state, params });
        history.replace(pathname + search + hash, { ...state, params });
      }
    }
    if (typeof props.auth === 'undefined') {
      return props;
    }

    const render: IRouteProps['render'] = (renderProps) => {
      if (redirection) {
        Session.set('currentPagePrivacy', Meteor.userId() ? 'auth' : 'unauth');

        if (auth === !Meteor.userId()) {
          return (
            <Redirect to={{
              pathname: makePath(redirection),
              state: { from: renderProps.location },
            }}
            />
          );
        }
      } else {
        Session.set('currentPagePrivacy', undefined);
      }


      if (children) {
        return children;
      }
      if (!initialRender) {
        if (component) {
          const Component = component;
          // eslint-disable-next-line react/jsx-props-no-spreading
          return <Component {...renderProps} />;
        }
      }
      return initialRender ? initialRender(renderProps) : null;
    };

    return {
      path,
      render,
      ...otherProps,
    };
  }, [history, location, makePath, props]);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <RouterRoute {...routeProps} />
  );
};
export default Route;
