import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs,
} from '@storybook/addon-knobs';

import { UserProvider } from '../imports/hooks/contexts/User';
import SearchList from '../imports/ui/Search/SearchList';
import { SearchListNoResult, SearchField } from '../imports/ui/Search';

export default {
  title: 'Search',
  decorators: [
    withKnobs,
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

export const searchListNoResult = (): JSX.Element => (
  <SearchListNoResult />
);

export const searchField = (): JSX.Element => (
  <SearchField
    handleNewSearch={action('handleNewSearch')}
    handleToggleDisplaySort={(display?: boolean): () => void => action(`handleToggleDisplaySort. focus: ${display}`)}
  />
);

export const searchList = (): JSX.Element => (
  <SearchList handleSelectSong={action('handleSelectSong')} />
);
