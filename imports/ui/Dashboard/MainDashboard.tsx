import React, { useMemo, useState } from 'react';
import {
  Switch,
  Redirect,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';

import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import Build from '@material-ui/icons/Build';
import Favorite from '@material-ui/icons/Favorite';
import Folder from '@material-ui/icons/Folder';
import Sort from '@material-ui/icons/Sort';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

import { useUser } from '../../hooks/contexts/User';
import { useMenu } from '../../hooks/contexts/Menu';
import usePath from '../../hooks/usePath';
import FolderSettingsDialog from '../Folders/FolderSettingsDialog';
import FullCardLayout from '../Common/FullCardLayout';
import Route from '../../routes/Route';
import SongDialog from '../Songs/SongDialog';
import UserFolderList from './UserFolderList';
import UserSongList from './UserSongList';
import UserCollectionName from './UserCollectionName';

import { IFolder, ISong, IUnfetched } from '../../types';
import { IIconColor } from '../../types/iconButtonTypes';

const useStyles = makeStyles((theme) => ({
  divider: {
    height: '3rem',
    margin: theme.spacing(0, 0.5),
  },
  menuActions: {
    display: 'flex',
  },
}));

type IDialog = 'folder' | 'song' | '';

export const MainDashboard: React.FC = () => {
  const { t } = useTranslation();
  const user = useUser();
  const classes = useStyles();
  const { path } = usePath('MainDashboard');
  const history = useHistory();
  const { logoMenuDeployed } = useMenu();
  const isCreatedSongs = !!useRouteMatch(path(['dashboard', 'createdSongs']));
  const isFolders = !!useRouteMatch(path(['dashboard', 'folders']));

  const display: UserCollectionName = (isCreatedSongs && UserCollectionName.CreatedSongs)
    || (isFolders && UserCollectionName.Folders)
    || UserCollectionName.FavoriteSongs;

  // console.log('From MainDashboard, render. user:', user);

  const [displaySort, setDisplaySort] = useState(false);
  const [dialog, setDialog] = useState<IDialog>('');

  const handleToggleDisplaySort = (newDisplaySort?: boolean) => (): void => {
    setDisplaySort(newDisplaySort === undefined ? !displaySort : newDisplaySort);
  };

  const handleDialog = (newDialog: IDialog) => (): void => {
    setDialog(newDialog);
  };

  const handleChangeDisplay = (newDisplay: UserCollectionName) => (): void => {
    history.push(path(['dashboard', newDisplay]));
  };

  const handleSelectFolder = (folder: IUnfetched<IFolder>): void => {
    history.push(path(['dashboard', UserCollectionName.Folders, ':folderSlug'], { ':folderSlug': folder._id.toHexString() }));
  };
  const handleSelectSong = (song: IUnfetched<ISong>): void => {
    history.push(path(['song', ':songSlug'], { ':songSlug': song.slug }));
  };

  const userSongLists: Record<UserCollectionName, {
    title: string;
    notFound: string;
    Icon: React.FunctionComponent<SvgIconProps>;
  }> = useMemo(() => ({
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
  }), [t]);

  return (
    <>
      <FullCardLayout<typeof isFolders extends true ? IFolder : ISong>
        fabs={{
          color: 'primary' as IIconColor,
          Icon: Add,
          label: isFolders
            ? t('dashboard.New folder', 'New folder')
            : t('dashboard.New song', 'New song'),
          onClick: handleDialog(isFolders ? 'folder' : 'song'),
        }}
        headerAction={(
          <div className={classes.menuActions}>
            <IconButton
              aria-label={t('search.Sort', 'Sort')}
              onClick={handleToggleDisplaySort()}
              size="small"
              color={displaySort ? 'primary' : 'default'}
            >
              <Sort />
            </IconButton>
            <Divider orientation="vertical" className={classes.divider} />
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
        headerTitle={userSongLists[display].title}
        shortHeader={logoMenuDeployed ? 2 : 1}
      >
        <Switch>
          {/* eslint-disable react/jsx-props-no-spreading */}
          <Route path={path(['dashboard', UserCollectionName.Folders])}>
            <UserFolderList
              displaySort={displaySort}
              emptyListPlaceholder={(
                <Typography>
                  {t('dashboard.No folders found', 'No folders found...')}
                </Typography>
              )}
              handleToggleDisplaySort={handleToggleDisplaySort}
              handleSelectFolder={handleSelectFolder}
            />
          </Route>
          <Route path={path(['dashboard', display])}>
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
          </Route>
          <Route>
            <Redirect to={path(['dashboard', UserCollectionName.FavoriteSongs])} />
          </Route>
          {/* eslint-enable react/jsx-props-no-spreading */}
        </Switch>
      </FullCardLayout>
      <FolderSettingsDialog
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
