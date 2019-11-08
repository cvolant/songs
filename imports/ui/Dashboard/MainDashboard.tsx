import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Build from '@material-ui/icons/Build';
import Favorite from '@material-ui/icons/Favorite';
import Folder from '@material-ui/icons/Folder';
import Sort from '@material-ui/icons/Sort';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

import CreateNewDialog from './CreateNewDialog';
import FullCardLayout from '../utils/FullCardLayout';
import UserFolderList from './UserFolderList';
import UserSongList from './UserSongList';

import { IUnfetchedFolder } from '../../types/folderTypes';
import { IUnfetchedSong } from '../../types/songTypes';

export type IUserCollectionName = 'favoriteSongs' | 'createdSongs' | 'folders';
interface IMainDashboardProps {
  display: IUserCollectionName;
  handleChangeDisplay: (newDisplay?: IUserCollectionName) => () => void;
  logoMenuDeployed: boolean;
  selectFolder: (folder: IUnfetchedFolder) => void;
  handleSelectSong: (song: IUnfetchedSong) => void;
}

export const MainDashboard: React.FC<IMainDashboardProps> = ({
  display, handleChangeDisplay, logoMenuDeployed, selectFolder, handleSelectSong,
}) => {
  const { t } = useTranslation();

  const [displaySort, setDisplaySort] = useState(false);

  const handleToggleDisplaySort = (newDisplaySort?: boolean) => (): void => {
    setDisplaySort(newDisplaySort === undefined ? !displaySort : newDisplaySort);
  };

  const handleNewFolder = (
    folderName: string,
    callback: (err: Meteor.Error, res: Mongo.ObjectID) => void,
  ): void => {
    Meteor.call('user.folders.insert', { name: folderName }, (err: Meteor.Error, res: Mongo.ObjectID) => {
      callback(err, res);
      if (res) {
        selectFolder({ _id: res, name: folderName });
      }
    });
  };

  const handleNewSong = (
    songTitle: string,
    callback: (err: Meteor.Error, res: Mongo.ObjectID) => void,
  ): void => {
    Meteor.call('user.createdSongs.insert', { song: { title: songTitle } }, (err: Meteor.Error, res: Mongo.ObjectID) => {
      callback(err, res);
      if (res) {
        handleSelectSong({ _id: res, title: songTitle });
      }
    });
  };


  const userSongLists: Record<IUserCollectionName, {
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
        <CreateNewDialog
          buttonText={t('dashboard.New song', 'New song')}
          dialogText={t('dashboard.Enter title', 'Enter title')}
          handleCreateNew={handleNewSong}
          inputLabel={t('song.Title', 'Title')}
          key="New song"
        />,
        <CreateNewDialog
          buttonText={t('dashboard.New folder', 'New folder')}
          dialogText={t('dashboard.Enter folder name', 'Enter folder name')}
          handleCreateNew={handleNewFolder}
          inputLabel={t('folder.Folder name', 'Folder name')}
          key="New folder"
        />,
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
                key={title}
                onClick={handleChangeDisplay(list as IUserCollectionName)}
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
            userSongList={display}
          />
        )}
    </FullCardLayout>
  );
};

export default MainDashboard;
