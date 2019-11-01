import { Meteor } from 'meteor/meteor';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Session } from 'meteor/session';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Routes from './Routes';
import routesPaths from './routesPaths';
import { UserProvider } from '../state-contexts/app-user-context';

import 'normalize.css';
import '../startup/simple-schema-configuration';
import theme from '../client/theme';

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
  const location = useLocation();
  const { i18n } = useTranslation();

  let lng: string;
  if (match.params.lng === undefined || !languages.includes(match.params.lng)) {
    lng = ['en', 'en-en'].includes(i18n.language.toLocaleLowerCase()) ? 'en' : 'fr';
    console.log('From App, render. REDIRECTION. Language undefined or invalid. redirection using language:', lng);
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
    console.log('From App, useEffect. App mounted.\ntheme:', theme);

    Session.set('selectedSongId', undefined);
    Session.set('isNavOpen', false);

    // eslint-disable-next-line no-undef
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
        console.log('From App, Tracker.autorun. history:', history, 'location:', location, 'history.location.state:', history.location.state);
        if (history.location.state.from) {
          console.log('From App, Tracker.autorun. REDIRECTION. history.location', history.location, ' location:', location, ' JSON.stringigy(location):', JSON.stringify(location), ' JSON.stringigy(history.location):', JSON.stringify(history.location));
          history.replace(history.location.pathname.indexOf(routesPaths.translatePath('/en/signin', lng)) >= 0 ? history.location.state.from : routesPaths.translatePath('/en/dashboard', lng));
        } else {
          console.log('From App, Tracker.autorun. REDIRECTION. No state... history.location:', history.location, 'location:', location, ' JSON.stringigy(location):', JSON.stringify(location), ' JSON.stringigy(history.location):', JSON.stringify(history.location));
          history.replace(routesPaths.translatePath('/en/dashboard', lng));
        }
      } else if (isAuthenticatedPage && !isAuthenticated) {
        console.log('From App, Tracker.autorun. REDIRECTION. Autenticated page but unauthenticated: redirection to home.');
        history.replace(`/${lng}`);
      }
    });
  }, []);

  return (
    <div>
      <Helmet>
        <html lang={lng} />
        <title>Alleluia.plus</title>
      </Helmet>
      <CssBaseline />
      <MuiThemeProvider theme={theme}>
        <UserProvider>
          <Routes lng={lng} />
        </UserProvider>
      </MuiThemeProvider>
    </div>
  );
};

export default App;
