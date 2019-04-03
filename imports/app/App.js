import { Meteor } from "meteor/meteor";
import React from 'react';
import { Session } from 'meteor/session';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Routes from "./Routes";
import theme from '../client/styles/theme.js';
import '../startup/simple-schema-configuration.js';

export class App extends React.Component {
  constructor(props) {
    super(props);

    console.log(theme);
    Session.set('selectedNoteId', undefined);
    Session.set('isNavOpen', false);

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
      const selectedNoteId = Session.get('selectedNoteId');
      Session.set('isNavOpen', false);
      if (selectedNoteId) {
        props.history.push(`/dashboard/${selectedNoteId}`);
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

export default App;