import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs, boolean,
} from '@storybook/addon-knobs';

import { UserProvider } from '../imports/hooks/contexts/app-user-context';
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
    shortSearchField={boolean('shortSearchField', true)}
    handleFocus={(focus?: boolean): () => void => action(`handleFocus. focus: ${focus}`)}
  />
);

export const searchList = (): JSX.Element => (
  <SearchList
    handleFocus={(focus?: boolean): () => void => action(`handleFocus. focus: ${focus}`)}
    handleSelectSong={action('handleSelectSong')}
    shortFirstItem={boolean('shortFirstItem', true)}
    shortSearchField={boolean('shortSearchField', true)}
  />
);
