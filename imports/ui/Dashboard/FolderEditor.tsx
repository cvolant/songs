import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import PlayArrow from '@material-ui/icons/PlayArrow';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';
import Settings from '@material-ui/icons/Settings';
import Sort from '@material-ui/icons/Sort';

import { useUser } from '../../hooks/contexts/app-user-context';
import { useDeviceSize } from '../../hooks/contexts/app-device-size-context';
import FullCardLayout from '../utils/FullCardLayout';
import UserSongList from './UserSongList';
import UserCollectionName from './UserCollectionName';

import { IFolder, ISong, IUnfetched } from '../../types';
import { IIconButtonCallback } from '../../types/iconButtonTypes';

import { foldersUpdateSongsRemove, foldersUpdateBroadcastsInsert } from '../../api/folders/methods';
import routesPaths from '../../app/routesPaths';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    padding: theme.spacing(1, 1.5),
  },
  hidden: {
    display: 'none',
  },
}));

interface IFolderEditorProps {
  folder: IUnfetched<IFolder>;
  goBack: () => void;
  handleSongsAdding: () => void;
  handleSelectSong: (song: IUnfetched<ISong>) => void;
  hidden?: boolean;
  logoMenuDeployed: boolean;
}

export const FolderEditor: React.FC<IFolderEditorProps> = ({
  folder,
  goBack,
  handleSongsAdding,
  handleSelectSong,
  hidden = false,
  logoMenuDeployed,
}) => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const classes = useStyles({ logoMenuDeployed });
  const user = useUser();
  const smallDevice = useDeviceSize('sm', 'down');

  const [displaySort, setDisplaySort] = useState(false);

  const handleDeleteSong = (
    song: IUnfetched<ISong>,
    callback?: (err: Meteor.Error, res: void) => void,
  ): void => {
    foldersUpdateSongsRemove.call({ folderId: folder._id, songId: song._id }, callback);
  };

  const handleToggleDisplaySort = (newDisplaySort?: boolean) => (): void => {
    setDisplaySort(newDisplaySort === undefined ? !displaySort : newDisplaySort);
  };

  const handleBroadcast = (): void => {
    let { broadcastOwnerId } = folder;
    if (!broadcastOwnerId) {
      broadcastOwnerId = foldersUpdateBroadcastsInsert.call({ folderId: folder._id });
    }
    history.push(routesPaths.path(i18n.language, 'dashboard', 'broadcast', broadcastOwnerId));
  };

  const handleEditSettings = (): void => {};

  return (
    <FullCardLayout
      actions={[[
        {
          color: 'primary',
          Icon: PlayArrow,
          key: 'broadcast',
          label: t('folder.Broadcast', 'Broadcast'),
          labelVisible: !smallDevice,
          onClick: handleBroadcast,
          variant: 'contained',
        },
        {
          color: 'primary',
          Icon: Add,
          key: 'add',
          label: t('folder.Add songs', 'Add songs'),
          labelVisible: !smallDevice,
          onClick: handleSongsAdding,
          variant: 'contained',
        },
        {
          color: 'primary',
          Icon: Settings,
          key: 'settings',
          label: t('folder.Settings', 'Settings'),
          labelVisible: !smallDevice,
          onClick: handleEditSettings,
          variant: 'outlined',
        },
      ]]}
      className={hidden ? classes.hidden : undefined}
      handleReturn={goBack}
      headerAction={{
        Icon: Sort,
        label: t('search.Sort', 'Sort') as string,
        onClick: handleToggleDisplaySort(),
        size: 'small',
      }}
      headerProps={{ disableTypography: true }}
      headerTitle={(
        <Typography variant="h4">
          {folder.name}
        </Typography>
      )}
      shortHeader={logoMenuDeployed ? 2 : 1}
    >
      <UserSongList
        displaySort={displaySort}
        emptyListPlaceholder={(
          <Typography>
            {t('folder.No songs found in this folder', 'No songs found in this folder...')}
          </Typography>
        )}
        folder={folder}
        handleToggleDisplaySort={handleToggleDisplaySort}
        logoMenuDeployed={logoMenuDeployed}
        handleSelectSong={handleSelectSong}
        secondaryActions={[
          {
            Icon: RemoveCircleOutline,
            key: 'remove',
            label: t('Remove'),
            onClick: {
              build: ({ element, callback }: {
                element?: IUnfetched<ISong>;
                callback?: IIconButtonCallback;
              }): () => void => (element
                ? (): void => handleDeleteSong(element, callback)
                : (): void => {}),
              callback: true,
            },
          },
        ]}
        userSongList={UserCollectionName.Folders}
        user={user}
      />
    </FullCardLayout>
  );
};

export default FolderEditor;
