import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import { UserProvider } from '../imports/hooks/contexts/User';
import AboutPage from '../imports/ui/About/AboutPage';

export default {
  title: 'About',
  decorators: [
    (storyFn: () => JSX.Element): JSX.Element => (
      <UserProvider>
        <BrowserRouter>
          <Route>
            {storyFn()}
          </Route>
        </BrowserRouter>
      </UserProvider>
    ),
  ],
};

export const aboutPage = (): JSX.Element => (
  <AboutPage />
);
