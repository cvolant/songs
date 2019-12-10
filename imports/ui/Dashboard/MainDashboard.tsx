import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import Build from '@material-ui/icons/Build';
import Favorite from '@material-ui/icons/Favorite';
import Folder from '@material-ui/icons/Folder';
import Sort from '@material-ui/icons/Sort';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

import { useUser } from '../../hooks/contexts/app-user-context';
import FolderDialog from '../Folders/FolderDialog';
import SongDialog from '../Songs/SongDialog';
import FullCardLayout from '../utils/FullCardLayout';
import UserFolderList from './UserFolderList';
import UserSongList from './UserSongList';
import UserCollectionName from './UserCollectionName';

import { IFolder, ISong, IUnfetched } from '../../types';
import { IIconColor } from '../../types/iconButtonTypes';

interface IMainDashboardProps {
  display: UserCollectionName;
  handleChangeDisplay: (newDisplay?: UserCollectionName) => () => void;
  logoMenuDeployed: boolean;
  handleSelectFolder: (folder: IUnfetched<IFolder>) => void;
  handleSelectSong: (song: IUnfetched<ISong>) => void;
}

type IDialog = 'folder' | 'song' | '';

export const MainDashboard: React.FC<IMainDashboardProps> = ({
  display,
  handleChangeDisplay,
  handleSelectSong,
  logoMenuDeployed,
  handleSelectFolder,
}) => {
  const { t } = useTranslation();
  const user = useUser();

  console.log('From MainDashboard, render. user:', user);

  const [displaySort, setDisplaySort] = useState(false);
  const [dialog, setDialog] = useState<IDialog>('');

  const handleToggleDisplaySort = (newDisplaySort?: boolean) => (): void => {
    setDisplaySort(newDisplaySort === undefined ? !displaySort : newDisplaySort);
  };

  const handleDialog = (newDialog: IDialog) => (): void => {
    setDialog(newDialog);
  };

  const userSongLists: Record<UserCollectionName, {
    title: string;
    notFound: string;
    Icon: React.FunctionComponent<SvgIconProps>;
  }> = {
    favoriteSongs: {
      title: t('dashboard.Favorite songs', 'Favorite songs'),
      notFound: t('dashboard.No favorite songs found', 'No favorite songs found...'),
      Icon: Favorite,
    },
    createdSongs: {
      title: t('dashboard.Created songs', 'Created songs'),
      notFound: t('dashboard.No created songs found', 'No created songs found...'),
      Icon: Build,
    },
    folders: {
      title: t('dashboard.Folders', 'Folders'),
      notFound: t('dashboard.No folders found', 'No folders found...'),
      Icon: Folder,
    },
  };

  return (
    <>
      <FullCardLayout<typeof display extends 'folders' ? IFolder : ISong>
        fab={{
          color: 'primary' as IIconColor,
          Icon: Add,
          label: display === 'folders'
            ? t('dashboard.New folder', 'New folder')
            : t('dashboard.New song', 'New song'),
          onClick: handleDialog(display === 'folders' ? 'folder' : 'song'),
        }}
        headerAction={(
          <div>
            <IconButton
              aria-label={t('search.Sort', 'Sort')}
              onClick={handleToggleDisplaySort()}
              size="small"
              color={displaySort ? 'primary' : 'default'}
            >
              <Sort />
            </IconButton>
            {
              Object.entries(userSongLists).map(([
                list,
                { title, Icon },
              ]) => (
                <IconButton
                  aria-label={title}
                  color={list === display ? 'primary' : undefined}
                  key={list}
                  onClick={handleChangeDisplay(list as UserCollectionName)}
                  size="small"
                >
                  <Icon />
                </IconButton>
              ))
            }
          </div>
        )}
        headerTitle={(
          <Typography variant="h4">
            {userSongLists[display].title}
          </Typography>
        )}
        headerProps={{ disableTypography: true }}
        shortHeader={logoMenuDeployed}
      >
        {display === 'folders'
          ? (
            <UserFolderList
              displaySort={displaySort}
              emptyListPlaceholder={(
                <Typography>
                  {t('dashboard.No folders found', 'No folders found...')}
                </Typography>
              )}
              handleToggleDisplaySort={handleToggleDisplaySort}
              logoMenuDeployed={logoMenuDeployed}
              handleSelectFolder={handleSelectFolder}
            />
          ) : (
            <UserSongList
              displaySort={displaySort}
              emptyListPlaceholder={
                <Typography>{userSongLists[display].notFound}</Typography>
              }
              handleToggleDisplaySort={handleToggleDisplaySort}
              logoMenuDeployed={logoMenuDeployed}
              handleSelectSong={handleSelectSong}
              user={user}
              userSongList={display}
            />
          )}
      </FullCardLayout>
      <FolderDialog
        handleClose={handleDialog('')}
        handleSelectFolder={handleSelectFolder}
        open={dialog === 'folder'}
        title={t('dashboard.New folder', 'New folder')}
      />
      <SongDialog
        handleClose={handleDialog('')}
        handleSelectSong={handleSelectSong}
        open={dialog === 'song'}
        title={t('dashboard.New song', 'New song')}
      />
    </>
  );
};

export default MainDashboard;
