import { Meteor } from "meteor/meteor";
import React from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Session } from 'meteor/session';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { App } from "../imports/app/App";
import theme from '../imports/client/styles/theme.js';
import '../imports/startup/simple-schema-configuration.js';

Meteor.startup(() => {
  console.log(theme);
  Session.set('selectedNoteId', undefined);
  Session.set('isNavOpen', false);
  ReactDOM.render((
    <Router>
      <CssBaseline />
      <MuiThemeProvider theme={theme}>
        <Route path="/" component={App} />
      </MuiThemeProvider>
    </Router>
  ), document.getElementById("app"));
});