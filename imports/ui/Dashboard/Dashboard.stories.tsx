import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs,
} from '@storybook/addon-knobs';
import {
  Meteor, Mongo, Session,
} from '../../stories';
import CreateNewDialog from './CreateNewDialog';

export default {
  title: 'Dashboard',
  parameters: {
    Session, Meteor, Mongo,
  },
  decorators: [withKnobs],
};

export const newSongDialog = (): JSX.Element => (
  <CreateNewDialog
    buttonText="New Stuff"
    dialogText="Enter stuff name"
    handleCreateNew={action('handleCreateNew')}
    inputLabel="Stuff name"
  />
);
