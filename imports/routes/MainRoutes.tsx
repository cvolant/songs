import React, { lazy, Suspense } from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';
import Loading from '../ui/Loading';
import { usePath } from '../hooks/usePath';
import { IRouteProps, IRouteBranchName } from '../types/routeTypes';

const AboutPage = lazy(() => import('../ui/About'));
const NotFoundPage = lazy(() => import('../ui/NotFound'));
const SearchPage = lazy(() => import('../ui/Search'));
const DashboardPage = lazy(() => import('../ui/Dashboard'));
const SignUpPage = lazy(() => import('../ui/Authentication/SignUpPage'));
const SignInPage = lazy(() => import('../ui/Authentication/SignInPage'));
const BroadcastPage = lazy(() => import('../ui/Broadcast/BroadcastPage'));

const mainRoutes: (IRouteProps & {
  name: IRouteBranchName;
  component: React.LazyExoticComponent<React.FC<{}>>;
})[] = [
  {
    name: 'home',
    component: SearchPage,
    exact: true,
  },
  {
    name: 'signin',
    auth: false,
    component: SignInPage,
    redirection: 'dashboard',
  },
  {
    name: 'signup',
    auth: false,
    component: SignUpPage,
    redirection: 'dashboard',
  },
  {
    name: 'about',
    component: AboutPage,
  },
  {
    name: 'dashboard',
    auth: true,
    component: DashboardPage,
    redirection: 'home',
  },
  {
    name: 'song',
    component: SearchPage,
  },
  {
    name: 'reception',
    component: BroadcastPage,
  },
  {
    name: 'notFound',
    component: NotFoundPage,
  },
];

export const MainRoutes: React.FC = () => {
  const { path } = usePath('MainRoutes');

  return (
    <Switch>
      {mainRoutes.map(({ name, component: Component, ...routeProps }) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Route key={name} {...routeProps} path={path(name)}>
          <Suspense fallback={<Loading />}>
            <Component />
          </Suspense>
        </Route>
      ))}
    </Switch>
  );
};
export default MainRoutes;
