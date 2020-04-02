import { IRouteBranch } from '../types/routeTypes';
/**
 * Each route branch must have a unique name
 * If exact (boolean) is not defined, it is considered to be:
 * - false if the branch has subbranches,
 * - true if it has not.
  */
export const routesTree: IRouteBranch[] = [
  {
    name: 'lang',
    optional: true,
    pathPartValues: {
      en: 'en',
      fr: 'fr',
    },
    subbranches: [
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
        subbranches: [
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
            subbranches: [
              {
                name: 'folder',
                auth: true,
                componentName: 'FolderDashboard',
              },
            ],
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
            subbranches: [
              {
                name: 'broadcastId',
              },
            ],
          },
        ],
      },
      {
        name: 'song',
        componentName: 'SearchPage',
        pathPartValues: {
          en: 'song',
          fr: 'chant',
        },
        subbranches: [
          {
            name: 'titleSlug',
            subbranches: [
              {
                name: 'authorAndTitleSlug',
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
        subbranches: [
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
