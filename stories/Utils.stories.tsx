import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs, text, number, boolean,
} from '@storybook/addon-knobs';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import Sync from '@material-ui/icons/Sync';

import SnackbarMessage from '../imports/ui/Utils/SnackBarMessage';
import Panel from '../imports/ui/Utils/Panel';
import CustomIconButton from '../imports/ui/Utils/CustomIconButton';
import { IUnfetched, ISong } from '../imports/types';
import { IIconButtonCallback } from '../imports/types/iconButtonTypes';

export default {
  title: 'Utils',
  decorators: [withKnobs],
};

export const snackBarMessage = (): JSX.Element => (
  <SnackbarMessage
    message={text('message', 'Message')}
    variant={text('variant', 'info') as 'info' | 'error' | 'warning' | 'success'}
    autoHideDuration={number('autoHideDuration', 5000)}
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

export const customIconButton = (): JSX.Element => (
  <CustomIconButton
    Component={[Button, IconButton, Fab][number('0: Button; 1: IconButton, 2: Fab', 0, { min: 0, max: 2 })]}
    iconButtonProps={{
      color: [
        'inherit',
        'primary',
        'secondary',
        'default',
      ][number('0: inherit; 1: primary; 2: secondary; 3: default', 0, { min: 0, max: 3 })] as 'inherit' | 'primary' | 'secondary' | 'default',
      disabled: boolean('disabled', false),
      Icon: boolean('Icon?', true) ? Sync : undefined,
      label: text('label', 'Label'),
      labelVisible: boolean('labelVisible', true),
      onClick: {
        build: ({ callback }: {
          element?: IUnfetched<ISong>;
          callback?: IIconButtonCallback;
        }) => (): void => {
          action('onClick')();
          if (callback) {
            setTimeout(callback, 50000);
            setTimeout(action('onClick callback'), 50000);
          }
        },
        callback: true,
      },
      variant: [
        undefined,
        'text',
        'outlined',
        'contained',
      ][number("0: undefined, 1: 'text'; 2: 'outlined'; 3: 'contained'", 0, { min: 0, max: 3 })] as undefined | 'text' | 'outlined' | 'contained',
    }}
  />
);
