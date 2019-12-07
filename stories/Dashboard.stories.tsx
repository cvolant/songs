import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
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
import UserSongList, { WrappedUserSongList } from '../imports/ui/Dashboard/UserSongList';
import UserFolderList, { WrappedUserFolderList } from '../imports/ui/Dashboard/UserFolderList';
import UserCollectionName from '../imports/ui/Dashboard/UserCollectionName';
import FolderEditor from '../imports/ui/Dashboard/FolderEditor';
import FolderDashboard from '../imports/ui/Dashboard/FolderDashboard';
import MainDashboard from '../imports/ui/Dashboard/MainDashboard';

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
    handleSelectFolder={action('handleSelectFolder')}
    folders={folders}
  />
);

export const userFolderList = (): JSX.Element => (
  <UserFolderList
    displaySort={boolean('displaySort', false)}
    emptyListPlaceholder={(
      <Typography>
        No songs found in this folder...
      </Typography>
    )}
    handleToggleDisplaySort={(display?: boolean): () => void => action(`handleToggleDisplaySort(display: ${display})`)}
    logoMenuDeployed={boolean('logoMenuDeployed', true)}
    handleSelectFolder={action('handleSelectFolder')}
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
        Icon: Delete,
        key: 'delete',
        label: 'Delete',
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

export const userSongList = (): JSX.Element => (
  <UserSongList
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
        Icon: Delete,
        key: 'delete',
        label: 'Delete',
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
  />
);

export const folderEditor = (): JSX.Element => (
  <FolderEditor
    folder={folders[0]}
    goBack={action('goBack')}
    handleSongsAdding={action('handleSongsAdding')}
    handleSelectSong={action('handleSelectSong')}
    hidden={boolean('hidden', false)}
    logoMenuDeployed={boolean('logoMenuDeployed', true)}
  />
);

export const folderDashboard = (): JSX.Element => (
  <FolderDashboard
    folder={folders[0]}
    goBack={action('goBack')}
    handleToggleLogoMenu={(oc?: boolean): () => void => action(`handleToggleLogoMenu(oc: ${oc})`)}
    logoMenuDeployed={boolean('logoMenuDeployed', true)}
    setTutorialContentName={action('setTutorialContentName')}
  />
);

export const mainDashboard = (): JSX.Element => {
  const [display, setDisplay] = useState(UserCollectionName.FavoriteSongs);

  const handleChangeDisplay = (newDisplay?: UserCollectionName) => (): void => {
    setDisplay(newDisplay || UserCollectionName.FavoriteSongs);
  };

  return (
    <MainDashboard
      display={display}
      handleChangeDisplay={handleChangeDisplay}
      logoMenuDeployed={boolean('logoMenuDeployed', true)}
      handleSelectFolder={action('handleSelectFolder')}
      handleSelectSong={action('handleSelectSong')}
    />
  );
};
