import { Meteor } from "meteor/meteor";
import React, { useEffect } from 'react';
import { Session } from 'meteor/session';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Routes from "./Routes";

import 'normalize.css';
import theme from '../theme';

import '../startup/simple-schema-configuration.js';

const App = props => {

  console.log('From App. render. props:', props);

  const xs = useMediaQuery(theme.breakpoints.only('xs'));
  const sm = useMediaQuery(theme.breakpoints.only('sm'));
  const md = useMediaQuery(theme.breakpoints.only('md'));
  const lg = useMediaQuery(theme.breakpoints.only('lg'));

  useEffect(() => {
    console.log('From App, useEffect. App mounted.\ntheme:', theme, '\nprops:', props);

    Session.set('selectedSongId', undefined);
    Session.set('isNavOpen', false);

    localStorage.setItem('zoom', localStorage.getItem('zoom') || (
      xs ? 0.6
        : sm ? 0.7
          : md ? 0.8
            : lg ? 0.9
              : 1
    ));
  }, []);

  useEffect(() => {
    Tracker.autorun(() => {
      const isAuthenticated = !!Meteor.userId();
      const currentPagePrivacy = Session.get('currentPagePrivacy');
      const isUnauthenticatedPage = currentPagePrivacy === 'unauth';
      const isAuthenticatedPage = currentPagePrivacy === 'auth';
  
      // props here are the props useEffect received, not the current props,
      // but history is mutable: it is always the current history.
      if (isUnauthenticatedPage && isAuthenticated) {
        console.log('From App, Tracker.autorun. props.history:', props.history, 'props.location:', props.location, 'props.history.location.state:', props.history.location.state);
        if (props.history.location.state.from) {
          console.log('From App, Tracker.autorun. props.history.location', props.history.location, ' props.location:', props.location, ' JSON.stringigy(props.location):', JSON.stringify(props.location), ' JSON.stringigy(props.history.location):', JSON.stringify(props.history.location));
          props.history.replace(props.history.location.pathname == '/signin' ? props.history.location.state.from : '/DDDASHHdashboard');
        } else {
          console.log('From App, Tracker.autorun. No state...  props.history.location:', props.history.location, ' props.location:', props.location, ' JSON.stringigy(props.location):', JSON.stringify(props.location), ' JSON.stringigy(props.history.location):', JSON.stringify(props.history.location));
          props.history.replace('/dashboard');
        }
      } else if (isAuthenticatedPage && !isAuthenticated) props.history.replace("/");
    });
  }, []);

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