import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs,
} from '@storybook/addon-knobs';

import { CreateNewDialog } from '../imports/ui/Dashboard';

export default {
  title: 'Dashboard',
  decorators: [withKnobs],
};

export const createNewDialog = (): JSX.Element => (
  <CreateNewDialog
    buttonText="New Stuff"
    dialogText="Enter stuff name"
    handleCreateNew={action('handleCreateNew')}
    inputLabel="Stuff name"
  />
);
