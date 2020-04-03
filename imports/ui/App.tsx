import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import RoutesConfig from '../routes';
import { UserProvider } from '../hooks/contexts/app-user-context';

import 'normalize.css';
import '../startup/simple-schema-configuration';
import theme from '../client/theme';
import { DeviceSizeProvider } from '../hooks/contexts/app-device-size-context';

import Songs from '../api/songs/songs';
import Folders from '../api/folders/folders';
import Broadcasts from '../api/broadcasts/broadcasts';

export const App: React.FC = () => {
  console.log(
    'From App. render.',
    '\nSongs:', Songs,
    '\nFolders:', Folders,
    '\nBroadcasts:', Broadcasts,
  );

  return (
    <div>
      <CssBaseline />
      <MuiThemeProvider theme={theme}>
        <UserProvider>
          <DeviceSizeProvider>
            <Router>
              <Route path="/:lng?" component={RoutesConfig} />
            </Router>
          </DeviceSizeProvider>
        </UserProvider>
      </MuiThemeProvider>
    </div>
  );
};

export default App;
