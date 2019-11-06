import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs, boolean,
} from '@storybook/addon-knobs';

import { UserProvider } from '../imports/state-contexts/app-user-context';
import { WrappedSearchList } from '../imports/ui/SearchPage/SearchList';
import { SearchListNoResult, SearchField } from '../imports/ui/SearchPage';
import { songs, users } from './fixtures';

export default {
  title: 'Search',
  decorators: [
    withKnobs,
    (storyFn: () => JSX.Element): JSX.Element => (
      <UserProvider user={users[0]}>
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
    logoMenuDeployed={boolean('logoMenuDeployed', true)}
    handleFocus={(focus?: boolean): () => void => action(`handleFocus. focus: ${focus}`)}
  />
);

export const wrappedSearchList = (): JSX.Element => (
  <WrappedSearchList
    handleFocus={(focus?: boolean): () => void => action(`handleFocus. focus: ${focus}`)}
    handleSelectSong={action('handleSelectSong')}
    logoMenuDeployed={boolean('logoMenuDeployed', true)}
    meteorCall={action('meteorCall')}
    favoriteSongs={[]}
    isAuthenticated={boolean('isAuthenticated', true)}
    songs={songs}
  />
);
