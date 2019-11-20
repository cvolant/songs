import { Meteor } from 'meteor/meteor';
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs, boolean,
} from '@storybook/addon-knobs';

import Typography from '@material-ui/core/Typography';
import Delete from '@material-ui/icons/Delete';

import { CreateNewDialog } from '../imports/ui/Dashboard';
import { FolderDialog } from '../imports/ui/Folders/CreateNewFolder';
import { SongDialog } from '../imports/ui/Songs/SongDialog';
import { WrappedUserSongList } from '../imports/ui/Dashboard/UserSongList';
import { WrappedUserFolderList } from '../imports/ui/Dashboard/UserFolderList';
import UserCollectionName from '../imports/ui/Dashboard/UserCollectionName';

import { IUnfetchedSong } from '../imports/types/songTypes';

import { folders, songs, users } from './fixtures';

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

export const wrappedUserFolderList = (): JSX.Element => (
  <WrappedUserFolderList
    displaySort={boolean('displaySort', false)}
    emptyListPlaceholder={(
      <Typography>
        No songs found in this folder...
      </Typography>
    )}
    handleToggleDisplaySort={(display?: boolean): () => void => action(`handleToggleDisplaySort(display: ${display})`)}
    logoMenuDeployed={boolean('logoMenuDeployed', true)}
    selectFolder={action('selectFolder')}
    folders={folders}
  />
);


export const wrappedUserSongList = (): JSX.Element => (
  <WrappedUserSongList
    displaySort={boolean('displaySort', true)}
    emptyListPlaceholder={(
      <Typography>
        No songs found in this folder...
      </Typography>
    )}
    folder={folders[0]}
    handleToggleDisplaySort={(display?: boolean): () => void => action(`handleToggleDisplaySort(display: ${display})`)}
    logoMenuDeployed={boolean('logoMenuDeployed', true)}
    handleSelectSong={action('handleSelectSong')}
    secondaryActions={[
      {
        ariaLabel: 'Delete',
        Icon: Delete,
        key: 'delete',
        onClick: {
          build: (
            song: IUnfetchedSong,
            callback?: (err: Meteor.Error, res: void) => void,
          ): (
            ) => void => action(`handleDeleteSong(song: ${song}, callback: ${callback})`),
        },
      },
    ]}
    userSongList={UserCollectionName.Folders}
    user={users[0]}
    favoriteSongs={users[0].favoriteSongs}
    songs={songs}
  />
);
