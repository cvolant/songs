import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { DeviceSizeProvider } from '../hooks/contexts/DeviceSize';
import { UserProvider } from '../hooks/contexts/User';
import { MenuProvider } from '../hooks/contexts/Menu';
import RoutesConfig from '../routes';
import Songs from '../api/songs/songs';
import Folders from '../api/folders/folders';
import Broadcasts from '../api/broadcasts/broadcasts';

import 'normalize.css';
import '../startup/simple-schema-configuration';
import theme from '../client/theme';

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
          <MenuProvider>
            <DeviceSizeProvider>
              <Router>
                <Route path="/:lng?" component={RoutesConfig} />
              </Router>
            </DeviceSizeProvider>
          </MenuProvider>
        </UserProvider>
      </MuiThemeProvider>
    </div>
  );
};

export default App;
