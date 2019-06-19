import { Meteor } from "meteor/meteor";
import React from 'react';
import { PropTypes } from 'prop-types';
import { Session } from 'meteor/session';
import withWidth from '@material-ui/core/withWidth';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Routes from "./Routes";

import 'normalize.css';
import theme from '../client/styles/theme.js';

import '../startup/simple-schema-configuration.js';

export class App extends React.Component {
  constructor(props) {
    super(props);

    const { width } = this.props;

    console.log(theme);
    Session.set('selectedSongId', undefined);
    Session.set('isNavOpen', false);
    Session.set('search', {});

    localStorage.setItem('zoom', localStorage.getItem('zoom') || (
      width == 'xs' ? 0.7
        : width == 'sm' ? 0.8
          : width == 'md' ? 0.9
            : width == 'lg' ? 1
              : 1.1
    ));

    Tracker.autorun(() => {
      const isNavOpen = Session.get('isNavOpen');
      document.body.classList.toggle('is-nav-open', isNavOpen);
    });

    Tracker.autorun(() => {
      const isAuthenticated = !!Meteor.userId();
      const currentPagePrivacy = Session.get('currentPagePrivacy');
      const isUnauthenticatedPage = currentPagePrivacy === 'unauth';
      const isAuthenticatedPage = currentPagePrivacy === 'auth';

      if (isUnauthenticatedPage && isAuthenticated)
        this.props.history.replace("/dashboard");
      else if (isAuthenticatedPage && !isAuthenticated)
        this.props.history.replace("/");
    });

    Tracker.autorun(() => {
      const selectedSongId = Session.get('selectedSongId');
      Session.set('isNavOpen', false);
      if (selectedSongId) {
        props.history.push(`/dashboard/${selectedSongId}`);
      } else {
        props.history.push(`/dashboard`);
      }
    });
  }

  render() {
    return (
      <div>
        <CssBaseline />
        <MuiThemeProvider theme={theme}>
          <Routes />
        </MuiThemeProvider>
      </div>
    );
  }
};

App.propTypes = {
  width: PropTypes.string.isRequired,
};

export default withWidth()(App);