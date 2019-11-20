import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import Settings from '@material-ui/icons/Settings';
import Sort from '@material-ui/icons/Sort';

import { useUser } from '../../hooks/contexts/app-user-context';
import FullCardLayout from '../utils/FullCardLayout';
import UserSongList from './UserSongList';
import UserCollectionName from './UserCollectionName';

import { IUnfetchedFolder } from '../../types/folderTypes';
import { IUnfetchedSong } from '../../types/songTypes';

import { folderUpdateRemoveSong } from '../../api/folders/methods';

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
  folder: IUnfetchedFolder;
  goBack: () => void;
  handleSongsAdding: () => void;
  handleSelectSong: (song: IUnfetchedSong) => void;
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
  const { t } = useTranslation();
  const classes = useStyles({ logoMenuDeployed });
  const user = useUser();

  const [displaySort, setDisplaySort] = useState(false);

  const handleDeleteSong = (
    song: IUnfetchedSong,
    callback?: (err: Meteor.Error, res: void) => void,
  ): void => {
    folderUpdateRemoveSong.call({ folderId: folder._id, songId: song._id }, callback);
  };

  const handleToggleDisplaySort = (newDisplaySort?: boolean) => (): void => {
    setDisplaySort(newDisplaySort === undefined ? !displaySort : newDisplaySort);
  };

  const handleEditSettings = (): void => {};

  return (
    <FullCardLayout
      actions={[
        <Button
          className={classes.button}
          color="primary"
          key="add"
          onClick={handleSongsAdding}
          size="large"
          variant="contained"
        >
          <Add />
          {t('folder.Add songs', 'Add songs')}
        </Button>,
        <Button
          className={classes.button}
          color="primary"
          key="settings"
          onClick={handleEditSettings}
          size="large"
          variant="outlined"
        >
          <Settings />
          {t('folder.Settings', 'Settings')}
        </Button>,
      ]}
      className={hidden ? classes.hidden : undefined}
      handleReturn={goBack}
      headerAction={(
        <IconButton
          aria-label={t('search.Sort', 'Sort')}
          onClick={handleToggleDisplaySort()}
          size="small"
        >
          <Sort />
        </IconButton>
      )}
      headerProps={{ disableTypography: true }}
      headerTitle={(
        <Typography variant="h4">
          {folder.name}
        </Typography>
      )}
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
            ariaLabel: t('Delete'),
            Icon: Delete,
            key: 'delete',
            onClick: {
              build: (
                song: IUnfetchedSong,
                callback?: (err: Meteor.Error, res: void) => void,
              ) => (): void => handleDeleteSong(song, callback),
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
