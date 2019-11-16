import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Build from '@material-ui/icons/Build';
import Favorite from '@material-ui/icons/Favorite';
import Folder from '@material-ui/icons/Folder';
import Sort from '@material-ui/icons/Sort';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

import { useUser } from '../../hooks/contexts/app-user-context';
import FolderDialog from '../Folders/CreateNewFolder';
import SongDialog from '../Songs/SongDialog';
import FullCardLayout from '../utils/FullCardLayout';
import UserFolderList from './UserFolderList';
import UserSongList from './UserSongList';
import UserCollectionName from './UserCollectionName';

import { IUnfetchedFolder } from '../../types/folderTypes';
import { IUnfetchedSong } from '../../types/songTypes';

export type IUserCollectionName = 'favoriteSongs' | 'createdSongs' | 'folders';
interface IMainDashboardProps {
  display: UserCollectionName;
  handleChangeDisplay: (newDisplay?: UserCollectionName) => () => void;
  logoMenuDeployed: boolean;
  selectFolder: (folder: IUnfetchedFolder) => void;
  handleSelectSong: (song: IUnfetchedSong) => void;
}

export const MainDashboard: React.FC<IMainDashboardProps> = ({
  display,
  handleChangeDisplay,
  handleSelectSong,
  logoMenuDeployed,
  selectFolder,
}) => {
  const { t } = useTranslation();
  const [user] = useUser();

  console.log('From MainDashboard, render. user:', user);

  const [displaySort, setDisplaySort] = useState(false);

  const handleToggleDisplaySort = (newDisplaySort?: boolean) => (): void => {
    setDisplaySort(newDisplaySort === undefined ? !displaySort : newDisplaySort);
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
    <FullCardLayout
      actions={[
        <SongDialog key="newSong" handleSelectSong={handleSelectSong} />,
        <FolderDialog key="newFolder" handleSelectFolder={handleSelectSong} />,
      ]}
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
            selectFolder={selectFolder}
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
  );
};

export default MainDashboard;
