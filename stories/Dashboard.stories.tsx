import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs, boolean,
} from '@storybook/addon-knobs';

import { CreateNewDialog } from '../imports/ui/Dashboard';
import { FolderDialog } from '../imports/ui/Folders/CreateNewFolder';
import { SongDialog } from '../imports/ui/Songs/SongDialog';

import { folders } from './fixtures';

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

export const songDialog = (): JSX.Element => (
  <SongDialog handleSelectSong={action('handleSelectSong')} />
);

export const folderDialog = (): JSX.Element => (
  <FolderDialog
    folder={boolean('folder', true) ? folders[1] : undefined}
    handleSelectFolder={action('handleSelectFolder')}
  />
);
