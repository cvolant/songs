import { lazy } from 'react';
import { IPageComponents } from '../types/routeTypes';

const AboutPage = lazy(() => import('../ui/About'));
const NotFoundPage = lazy(() => import('../ui/NotFound'));
const SearchPage = lazy(() => import('../ui/Search'));
const DashboardPage = lazy(() => import('../ui/Dashboard'));
const SignUpPage = lazy(() => import('../ui/Authentication/SignUpPage'));
const SignInPage = lazy(() => import('../ui/Authentication/SignInPage'));
const BroadcastPage = lazy(() => import('../ui/Broadcast/BroadcastPage'));

export const PageComponents: IPageComponents = {
  AboutPage,
  BroadcastPage,
  DashboardPage,
  NotFoundPage,
  SearchPage,
  SignInPage,
  SignUpPage,
};


export default PageComponents;
