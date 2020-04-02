import { FC } from 'react';
import { RouteComponentProps, RouteProps } from 'react-router-dom';
import { Locale } from '../i18n';

type IRouteComponent = FC<Partial<RouteComponentProps>>;

export interface IPageComponents {
  AboutPage: IRouteComponent;
  BroadcastPage: IRouteComponent;
  DashboardPage: IRouteComponent;
  FolderDashboard: IRouteComponent;
  NotFoundPage: IRouteComponent;
  SearchPage: IRouteComponent;
  SignInPage: IRouteComponent;
  SignUpPage: IRouteComponent;
}
export type IPageComponentName = keyof IPageComponents;

export type IRouteBranchName =
| 'about'
| 'authorAndTitleSlug'
| 'broadcast'
| 'broadcastId'
| 'createdSong'
| 'createdSongs'
| 'dashboard'
| 'favoriteSong'
| 'favoriteSongs'
| 'folder'
| 'folders'
| 'home'
| 'lang'
| 'notFound'
| 'signin'
| 'signup'
| 'song'
| 'reception'
| 'receptionId'
| 'titleSlug';

export interface IRouteBranch {
  name: IRouteBranchName;
  any?: string;
  auth?: boolean;
  componentName?: IPageComponentName;
  exact?: boolean;
  pathPartValues?: {
    [Locale.en]: string;
    [Locale.fr]: string;
  };
  optional?: boolean;
  redirection?: IRouteBranchName;
  subbranches?: IRouteBranch[];
}

export interface IRouteProps extends Partial<IRouteBranch>, RouteProps {}
