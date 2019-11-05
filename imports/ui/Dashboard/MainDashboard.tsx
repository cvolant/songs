import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Build from '@material-ui/icons/Build';
import Favorite from '@material-ui/icons/Favorite';
import Folder from '@material-ui/icons/Folder';
import Sort from '@material-ui/icons/Sort';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

import UserSongList from './UserSongList';
import CreateNewDialog from './CreateNewDialog';
import UserFolderList from './UserFolderList';

import { IUnfetchedFolder } from '../../types/folderTypes';
import { IUnfetchedSong } from '../../types/songTypes';

const useStyles = makeStyles((theme) => ({
  card: {
    position: 'relative',
    width: '100%',
  },
  cardAction: {
    bottom: 0,
    position: 'absolute',
  },
  cardContent: {
    paddingTop: 0,
  },
  cardHeader: {
    paddingBottom: 0,
    paddingRight: (
      { logoMenuDeployed }: { logoMenuDeployed: boolean },
    ): number | string => theme.spacing(logoMenuDeployed ? 16 : 10),
    transition: theme.transitions.create('padding-right'),
  },
}));

export type IUserCollectionName = 'favoriteSongs' | 'createdSongs' | 'folders';
interface IMainDashboardProps {
  display: IUserCollectionName;
  handleChangeDisplay: (newDisplay?: IUserCollectionName) => () => void;
  logoMenuDeployed: boolean;
  selectFolder: (folder: IUnfetchedFolder) => void;
  selectSong: (song: IUnfetchedSong) => void;
}

export const MainDashboard: React.FC<IMainDashboardProps> = ({
  display, handleChangeDisplay, logoMenuDeployed, selectFolder, selectSong,
}) => {
  const { t } = useTranslation();
  const classes = useStyles({ logoMenuDeployed });

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
        selectSong({ _id: res, title: songTitle });
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
    <Card className={classes.card}>
      <CardHeader
        action={(
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
        className={classes.cardHeader}
        disableTypography
        title={(
          <Typography variant="h4">
            {userSongLists[display].title}
          </Typography>
        )}
      />
      <CardContent className={classes.cardContent}>
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
              selectSong={selectSong}
              userSongList={display}
            />
          )}
      </CardContent>
      <CardActions className={classes.cardAction}>
        <CreateNewDialog
          buttonText={t('dashboard.New song', 'New song')}
          dialogText={t('dashboard.Enter title', 'Enter title')}
          handleCreateNew={handleNewSong}
          inputLabel={t('song.Title', 'Title')}
        />
        <CreateNewDialog
          buttonText={t('dashboard.New folder', 'New folder')}
          dialogText={t('dashboard.Enter folder name', 'Enter folder name')}
          handleCreateNew={handleNewFolder}
          inputLabel={t('folder.Folder name', 'Folder name')}
        />
      </CardActions>
    </Card>
  );
};

export default MainDashboard;
