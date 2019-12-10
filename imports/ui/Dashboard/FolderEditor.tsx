import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';
import Settings from '@material-ui/icons/Settings';
import Sort from '@material-ui/icons/Sort';

import { useUser } from '../../hooks/contexts/app-user-context';
import FullCardLayout from '../utils/FullCardLayout';
import UserSongList from './UserSongList';
import UserCollectionName from './UserCollectionName';

import { IFolder, ISong, IUnfetched } from '../../types';
import { IIconButtonCallback } from '../../types/iconButtonTypes';

import { foldersUpdateSongsRemove } from '../../api/folders/methods';

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
  const { t } = useTranslation();
  const classes = useStyles({ logoMenuDeployed });
  const user = useUser();

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
