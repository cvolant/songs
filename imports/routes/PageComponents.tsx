import { lazy } from 'react';
import { IPageComponents } from '../types/routeTypes';

const AboutPage = lazy(() => import('../ui/About'));
const NotFoundPage = lazy(() => import('../ui/NotFound'));
const SearchPage = lazy(() => import('../ui/Search'));
const DashboardPage = lazy(() => import('../ui/Dashboard'));
const FolderDashboard = lazy(() => import('../ui/Dashboard/FolderDashboard'));
const SignUpPage = lazy(() => import('../ui/Authentication/SignUpPage'));
const SignInPage = lazy(() => import('../ui/Authentication/SignInPage'));
const BroadcastPage = lazy(() => import('../ui/Broadcast/BroadcastPage'));

export const PageComponents: IPageComponents = {
  AboutPage,
  BroadcastPage,
  DashboardPage,
  FolderDashboard,
  NotFoundPage,
  SearchPage,
  SignInPage,
  SignUpPage,
};

export default PageComponents;
