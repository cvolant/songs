import { IRouteBranch } from '../types/routeTypes';

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
        componentName: 'SearchPage',
        any: '',
      },
      {
        name: 'signin',
        auth: false,
        componentName: 'SignInPage',
        pathPartValues: {
          en: 'signin',
          fr: 'connexion',
        },
        redirection: 'dashboard',
      },
      {
        name: 'signup',
        auth: false,
        componentName: 'SignUpPage',
        pathPartValues: {
          en: 'signup',
          fr: 'inscription',
        },
        redirection: 'dashboard',
      },
      {
        name: 'about',
        componentName: 'AboutPage',
        pathPartValues: {
          en: 'about',
          fr: 'a-propos',
        },
      },
      {
        name: 'dashboard',
        auth: true,
        componentName: 'DashboardPage',
        pathPartValues: {
          en: 'dashboard',
          fr: 'espace-personnel',
        },
        redirection: 'home',
        children: [
          {
            name: 'favoriteSongs',
            auth: true,
            componentName: 'DashboardPage',
            pathPartValues: {
              en: 'favorite-songs',
              fr: 'chants-favoris',
            },
            redirection: 'home',
          },
          {
            name: 'createdSongs',
            auth: true,
            componentName: 'DashboardPage',
            pathPartValues: {
              en: 'created-songs',
              fr: 'chants-crees',
            },
            redirection: 'home',
          },
          {
            name: 'folders',
            auth: true,
            componentName: 'DashboardPage',
            pathPartValues: {
              en: 'folders',
              fr: 'dossiers',
            },
            redirection: 'home',
          },
          {
            name: 'broadcast',
            auth: true,
            componentName: 'DashboardPage',
            pathPartValues: {
              en: 'broadcast',
              fr: 'diffusion',
            },
            redirection: 'home',
            children: [
              {
                name: 'broadcastId',
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
            componentName: 'SearchPage',
            children: [
              {
                name: 'authorAndTitleSlug',
                componentName: 'SearchPage',
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
          },
        ],
      },
      {
        name: 'notFound',
        any: '',
        componentName: 'NotFoundPage',
        exact: false,
      },
    ],
  },
];

export default routesTree;
