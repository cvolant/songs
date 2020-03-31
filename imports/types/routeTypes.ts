import { FC } from 'react';
import { Locale } from '../i18n';

export interface IPageComponents {
  AboutPage: FC;
  BroadcastPage: FC;
  DashboardPage: FC;
  NotFoundPage: FC;
  SearchPage: FC;
  SignInPage: FC;
  SignUpPage: FC;
}
export type IPageComponentName = keyof IPageComponents;

export type IRouteBranchName =
| 'about'
| 'authorAndTitleSlug'
| 'broadcast'
| 'broadcastId'
| 'createdSongs'
| 'dashboard'
| 'favoriteSongs'
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

export interface IRouteProps extends IRouteBranch {
  path: string;
  exact?: boolean;
  componentName: IPageComponentName;
}

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
  children?: IRouteBranch[];
}
