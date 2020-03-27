import { Locale } from '../i18n';

export type IPageComponentName =
| 'AboutPage'
| 'BroadcastPage'
| 'DashboardPage'
| 'SearchPage'
| 'SignInPage'
| 'SignUpPage';

export interface IRouteBranch {
  name: string;
  pathPartValues?: {
    [Locale.en]: string;
    [Locale.fr]: string;
  };
  optional?: boolean;
  variable?: boolean;
  any?: string;
  children?: IRouteBranch[];
  component?: IPageComponentName;
}

export const routesTree: IRouteBranch[] = [
  {
    name: 'lang',
    optional: true,
    pathPartValues: {
      en: 'en',
      fr: 'fr',
    },
    children: [
      {
        name: 'home',
        component: 'SearchPage',
        any: '',
      },
      {
        name: 'signin',
        component: 'SignInPage',
        pathPartValues: {
          en: 'signin',
          fr: 'connexion',
        },
      },
      {
        name: 'signup',
        component: 'SignUpPage',
        pathPartValues: {
          en: 'signup',
          fr: 'inscription',
        },
      },
      {
        name: 'about',
        component: 'AboutPage',
        pathPartValues: {
          en: 'about',
          fr: 'a-propos',
        },
      },
      {
        name: 'dashboard',
        component: 'DashboardPage',
        pathPartValues: {
          en: 'dashboard',
          fr: 'espace-personnel',
        },
        children: [
          {
            name: 'favoriteSongs',
            component: 'DashboardPage',
            pathPartValues: {
              en: 'favorite-songs',
              fr: 'chants-favoris',
            },
          },
          {
            name: 'createdSongs',
            component: 'DashboardPage',
            pathPartValues: {
              en: 'created-songs',
              fr: 'chants-crees',
            },
          },
          {
            name: 'folders',
            component: 'DashboardPage',
            pathPartValues: {
              en: 'folders',
              fr: 'dossiers',
            },
          },
          {
            name: 'broadcast',
            component: 'DashboardPage',
            pathPartValues: {
              en: 'broadcast',
              fr: 'diffusion',
            },
            children: [
              {
                name: 'broadcastId',
                variable: true,
              },
            ],
          },
        ],
      },
      {
        name: 'song',
        pathPartValues: {
          en: 'song',
          fr: 'chant',
        },
        children: [
          {
            name: 'titleSlug',
            component: 'SearchPage',
            variable: true,
            children: [
              {
                name: 'authorAndTitleSlug',
                component: 'SearchPage',
                variable: true,
              },
            ],
          },
        ],
      },
      {
        name: 'reception',
        pathPartValues: {
          en: 'r',
          fr: 'r',
        },
        children: [
          {
            name: 'receptionId',
            variable: true,
          },
        ],
      },
    ],
  },
];

export default routesTree;
