import { Meteor } from "meteor/meteor";
import React, { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { Session } from 'meteor/session';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Routes from "./Routes";

import 'normalize.css';
import theme from '../client/styles/theme.js';

import '../startup/simple-schema-configuration.js';

const App = props => {

  const xs = useMediaQuery(theme.breakpoints.only('xs'));
  const sm = useMediaQuery(theme.breakpoints.only('sm'));
  const md = useMediaQuery(theme.breakpoints.only('md'));
  const lg = useMediaQuery(theme.breakpoints.only('lg'));
  
  useEffect(() => {
    console.log('From App, useEffect. App mounted.\ntheme:', theme, '\nprops:', props);
  
    Session.set('selectedSongId', undefined);
    Session.set('isNavOpen', false);
    Session.set('search', {});
  
    localStorage.setItem('zoom', localStorage.getItem('zoom') || (
      xs ? 0.6
        : sm ? 0.7
          : md ? 0.8
            : lg ? 0.9
              : 1
    ));
  }, []);

/* 
  Tracker.autorun(() => {
    const isNavOpen = Session.get('isNavOpen');
    document.body.classList.toggle('is-nav-open', isNavOpen);
  });
 */

  Tracker.autorun(() => {
    const isAuthenticated = !!Meteor.userId();
    const currentPagePrivacy = Session.get('currentPagePrivacy');
    const isUnauthenticatedPage = currentPagePrivacy === 'unauth';
    const isAuthenticatedPage = currentPagePrivacy === 'auth';

    if (isUnauthenticatedPage && isAuthenticated)
      props.history.replace("/dashboard");
    else if (isAuthenticatedPage && !isAuthenticated)
      props.history.replace("/");
  });

/* 
  Tracker.autorun(() => {
    const selectedSongId = Session.get('selectedSongId');
    Session.set('isNavOpen', false);
    if (selectedSongId) {
      props.history.push(`/dashboard/${selectedSongId}`);
    } else {
      props.history.push(`/dashboard`);
    }
  });
 */

  return (
    <div>
      <CssBaseline />
      <MuiThemeProvider theme={theme}>
        <Routes />
      </MuiThemeProvider>
    </div>
  );
};

export default App;