import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, number, boolean } from '@storybook/addon-knobs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';

import { UserProvider } from '../imports/hooks/contexts/User';
import {
  BroadcastPage,
  PublishDialog,
} from '../imports/ui/Broadcast';

import { IIconButtonCallback } from '../imports/types/iconButtonTypes';

import { broadcasts } from './fixtures';

export default {
  title: 'Station',
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

export const publishDialog = (): JSX.Element => (
  <PublishDialog
    broadcastOwnerId={broadcasts[0].addresses[0].id}
    broadcastStatus={broadcasts[0].status}
    handleClose={action('handleClose')}
    handleTogglePublished={(callback?: IIconButtonCallback) => (): void => {
      action('handleTogglePublished')();
      if (callback) {
        setTimeout(callback, 1000);
      }
    }}
    open={boolean('open', false)}
  />
);

export const broadcastFetcher = (): JSX.Element => (
  <BroadcastPage
    broadcastId={[
      'idAddressRO1',
      'idAddressN1',
      'idAddressRO2',
      'idAddressC2',
    ][number("0: idAddressRO1, 1: 'idAddressN1'; 2: 'idAddressRO2'; 3: 'idAddressC2'", 0, { min: 0, max: 3 })]}
  />
);
