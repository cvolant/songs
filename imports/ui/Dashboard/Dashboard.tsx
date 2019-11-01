import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Build from '@material-ui/icons/Build';
import Favorite from '@material-ui/icons/Favorite';
import Folder from '@material-ui/icons/Folder';
import Sort from '@material-ui/icons/Sort';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

import PageLayout from '../utils/PageLayout';
import Panel from '../utils/Panel';
import Editor from '../Editor';
import NewSongDialog from './NewSongDialog';
import UserSongList from './UserSongList';
import { ISong, IUser } from '../../types';

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

type IUserCollectionName = keyof IUser & 'favoriteSongs' | 'createdSongs' | 'folders';

export const Dashboard: React.FC<{}> = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const smallDevice = useMediaQuery(theme.breakpoints.down('sm'));

  const [display, setDisplay] = useState<IUserCollectionName>('favoriteSongs');
  const [displaySort, setDisplaySort] = useState(false);
  const [logoMenuDeployed, setLogoMenuDeployed] = useState(true);
  const [selectedSong, setSelectedSong] = useState<ISong | undefined>(undefined);
  const [showPanel, setShowPanel] = useState(true);

  const classes = useStyles({ logoMenuDeployed });

  const userSongLists: Record<IUserCollectionName, {
    title: string;
    notFound: string;
    Icon: React.FunctionComponent<SvgIconProps>;
  }> = {
    favoriteSongs: {
      title: t('dashboard.Favorite songs', 'Favorite songs'),
      notFound: t('dashboard.No favorite song found', 'No favorite song found...'),
      Icon: Favorite,
    },
    createdSongs: {
      title: t('dashboard.Created songs', 'Created songs'),
      notFound: t('dashboard.No created song found', 'No created song found...'),
      Icon: Build,
    },
    folders: {
      title: t('dashboard.Folders', 'Folders'),
      notFound: t('dashboard.No folder found', 'No folder found...'),
      Icon: Folder,
    },
  };

  const handleToggleLogoMenu = (oc?: boolean) => (): void => {
    setLogoMenuDeployed(typeof oc === 'undefined' ? !logoMenuDeployed : oc);
  };

  const goBack = (): void => {
    setSelectedSong(undefined);
  };

  const handleClosePanel = (): void => setShowPanel(false);

  const handleChangeDisplay = (newDisplay?: IUserCollectionName) => (): void => {
    setDisplay(newDisplay || 'favoriteSongs');
  };

  const handleToggleDisplaySort = (newDisplaySort?: boolean) => (): void => {
    setDisplaySort(newDisplaySort === undefined ? !displaySort : newDisplaySort);
  };

  return (
    <PageLayout
      menuProps={{ handleToggleLogoMenu, logoMenuDeployed }}
      sidePanel={showPanel
        ? (
          <Panel
            handleClosePanel={handleClosePanel}
            closeName={t('dashboard.Close dashboard message', 'Close dashboard message')}
          >
            <Typography>
              {t('dashboard.Dashboard welcome', 'Welcome')}
              <DashboardIcon />
            </Typography>
            <Typography>
              <Trans i18nKey="dashboard.Dashboard message">
                <span>Sorry,</span>
                {' '}
                it is
                {' '}
                <span>empty</span>
                . It is yet to build.
              </Trans>
            </Typography>
          </Panel>
        )
        : undefined}

      title={t('dashboard.Dashboard', 'Dashboard')}
      tutorialContentName={selectedSong ? 'Editor' : 'Dashboard'}
      smallDevice={smallDevice}
    >
      {selectedSong
        ? (
          <Editor
            edit={selectedSong.userId === Meteor.userId() && !selectedSong.pg}
            goBack={goBack}
            logoMenuDeployed={logoMenuDeployed}
            song={selectedSong}
          />
        )
        : (
          <Card className={classes.card}>
            <CardHeader
              action={(
                <div>
                  {display !== 'folders' && (
                    <IconButton
                      aria-label={t('search.Sort', 'Sort')}
                      onClick={handleToggleDisplaySort()}
                      size="small"
                    >
                      <Sort />
                    </IconButton>
                  )}
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
                ? <div />
                : (
                  <UserSongList
                    displaySort={displaySort}
                    emptyListPlaceholder={
                      <Typography>{userSongLists[display].notFound}</Typography>
                    }
                    handleToggleDisplaySort={handleToggleDisplaySort}
                    logoMenuDeployed={logoMenuDeployed}
                    userSongList={display}
                  />
                )}
            </CardContent>
            <CardActions className={classes.cardAction}>
              <NewSongDialog setSelectedSong={setSelectedSong} />
            </CardActions>
          </Card>
        )}
    </PageLayout>
  );
};
export default Dashboard;
