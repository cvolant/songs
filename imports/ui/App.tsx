/* global localStorage */
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Session } from 'meteor/session';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Routes from '../routes/Routes';
import routesPaths from '../routes/routesPaths';
import { UserProvider } from '../hooks/contexts/app-user-context';

import 'normalize.css';
import '../startup/simple-schema-configuration';
import theme from '../client/theme';
import { DeviceSizeProvider } from '../hooks/contexts/app-device-size-context';

const languages = ['en', 'fr'];

interface IAppProps {
  match: {
    isExact: boolean;
    params: {
      lng?: string;
    };
    path: string;
    url: string;
  };
}

export const App: React.FC<IAppProps> = ({
  match,
}) => {
  const history = useHistory();
  const { i18n } = useTranslation();

  let lng: string;
  if (match.params.lng === undefined || !languages.includes(match.params.lng)) {
    lng = ['en', 'en-en'].includes(i18n.language.toLocaleLowerCase()) ? 'en' : 'fr';
    /* console.log(
      'From App, render. REDIRECTION.',
      'Language undefined or invalid. redirection using language:', lng,
    ); */
    history.replace(`/${lng + match.url}`);
  } else {
    lng = match.params.lng;
    if (i18n.language !== lng) i18n.changeLanguage(lng);
  }

  const xs = useMediaQuery(theme.breakpoints.only('xs'));
  const sm = useMediaQuery(theme.breakpoints.only('sm'));
  const md = useMediaQuery(theme.breakpoints.only('md'));
  const lg = useMediaQuery(theme.breakpoints.only('lg'));

  useEffect(() => {
    // console.log('From App, useEffect. App mounted.\ntheme:', theme);

    Session.set('selectedSongId', undefined);
    Session.set('isNavOpen', false);

    localStorage.setItem('zoom', localStorage.getItem('zoom') || (
      (xs && 0.6) || (sm && 0.7) || (md && 0.8) || (lg && 1) || 1.2
    ).toString());

    // eslint-disable-next-line no-undef
    Tracker.autorun(() => {
      const isAuthenticated = !!Meteor.userId();
      const currentPagePrivacy = Session.get('currentPagePrivacy');
      const isUnauthenticatedPage = currentPagePrivacy === 'unauth';
      const isAuthenticatedPage = currentPagePrivacy === 'auth';

      // props here are the props useEffect received, not the current props,
      // but history is mutable: it is always the current history.
      if (isUnauthenticatedPage && isAuthenticated) {
        const { state } = history.location as { state?: { from?: string } };
        if (state && state.from) {
          history.replace(history.location.pathname.indexOf(routesPaths.path(lng, 'signin')) >= 0 ? state.from : routesPaths.path(lng, 'dashboard'));
        } else {
          history.replace(routesPaths.path(lng, 'dashboard'));
        }
      } else if (isAuthenticatedPage && !isAuthenticated) {
        history.replace(`/${lng}`);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lng, xs, sm, md, lg]);

  return (
    <div>
      <Helmet>
        <html lang={lng} />
        <title>Alleluia.plus</title>
      </Helmet>
      <CssBaseline />
      <MuiThemeProvider theme={theme}>
        <UserProvider>
          <DeviceSizeProvider>
            <Routes lng={lng} />
          </DeviceSizeProvider>
        </UserProvider>
      </MuiThemeProvider>
    </div>
  );
};

export default App;
