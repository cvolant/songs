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
import NewSongDialog from './NewSongDialog';

export default {
  title: 'Dashboard',
  parameters: {
    Session, Meteor, Mongo,
  },
  decorators: [withKnobs],
};

export const newSongDialog = (): JSX.Element => (
  <NewSongDialog
    handleNewSong={action('handleNewSong')}
  />
);
