import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, number } from '@storybook/addon-knobs';

import { UserProvider } from '../imports/hooks/contexts/app-user-context';
import { Station } from '../imports/ui/Station';

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

export const station = (): JSX.Element => (
  <Station
    broadcastId={[
      'idAddressRO1',
      'idAddressN1',
      'idAddressRO2',
      'idAddressC2',
    ][number("0: idAddressRO1, 1: 'idAddressN1'; 2: 'idAddressRO2'; 3: 'idAddressC2'", 0, { min: 0, max: 3 })]}
  />
);
