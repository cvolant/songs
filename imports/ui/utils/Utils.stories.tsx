import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs, text, number,
} from '@storybook/addon-knobs';
import {
  Meteor, Mongo, Session,
} from '../../stories';
import SnackbarMessage from './SnackBarMessage';
import Panel from './Panel';

export default {
  title: 'Utils',
  parameters: {
    Session, Meteor, Mongo,
  },
  decorators: [withKnobs],
};

export const snackBarMessage = (): JSX.Element => (
  <SnackbarMessage
    message={text('message', 'Message')}
    variant={text('variant', 'info') as 'info' | 'error' | 'warning' | 'success'}
    autoHideDuration={number('autoHideDuration', 10000)}
    anchorOrigin={{
      vertical: text('anchor-vertical', 'bottom') as 'bottom' | 'top',
      horizontal: text('anchor-horizontal', 'left') as 'left' | 'center' | 'right',
    }}
  />
);

export const panel = (): JSX.Element => (
  <Panel
    closeName="Close name"
    handleClosePanel={action('handleClosePanel')}
  >
    <p>Children</p>
  </Panel>
);
