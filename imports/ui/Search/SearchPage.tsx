import React, {
  createRef,
  useState,
  useEffect,
  MouseEventHandler,
} from 'react';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Clear from '@material-ui/icons/Clear';
import Eye from '@material-ui/icons/RemoveRedEye';

import { useDeviceSize } from '../../hooks/contexts/app-device-size-context';
import Editor from '../Editor';
import InfosSongBySong from './InfosSongBySong';
import PageLayout from '../Common/PageLayout';
import Screen from '../Station/Screen';
import SearchList from './SearchList';

import { IUnfetched } from '../../types';
import { IIconColor } from '../../types/iconButtonTypes';
import { IEditedSong, ISong } from '../../types/songTypes';

import routesPaths from '../../routes/routesPaths';

const useStyles = makeStyles((theme) => ({
  continueFabIcon: {
    border: `1px solid ${theme.palette.primary.main}`,
    fill: theme.palette.primary.main,
    borderRadius: '50%',
  },
  list: {
    scrollbarWidth: 'none',
  },
  continueFab: {
    background: theme.palette.grey[300],
    alignSelf: 'center',
    height: '3rem',
    margin: theme.spacing(1),
    paddingLeft: '4px',
    textTransform: 'none',

    '& > span > *': {
      marginRight: theme.spacing(1),
    },
  },
  pageContent: {
    flexGrow: 1,
    height: '100%',

    '& > *': {
      height: '100%',
      padding: theme.spacing(4, 4, 4, 4),
    },
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    padding: theme.spacing(2),
    width: '100vw',
  },
}));

interface ISearchPageProps {
  songId: string;
}

export const SearchPage: React.FC<ISearchPageProps> = ({
  songId,
}) => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const location = useLocation();

  const [logoMenuDeployed, setLogoMenuDeployed] = useState(true);
  const [selectedSong, setSelectedSong] = useState<IUnfetched<ISong> | undefined>();
  const [showInfos, setShowInfos] = useState(true);
  const [viewSong, setViewSong] = useState<IEditedSong | undefined>();
  const smallDevice = useDeviceSize('sm', 'down');
  const classes = useStyles();
  const contentAreaRef = createRef<HTMLDivElement>();

  useEffect((): void => {
    const unfetchedSong = /^(?:[0-9A-Fa-f]{6})+$/g.test(songId) ? { _id: new Mongo.ObjectID(songId) } : undefined;
    setSelectedSong(unfetchedSong);
  }, [songId]);

  const handleCloseInfos = (): void => {
    setShowInfos(false);
  };

  const handleCloseScreen = (): void => {
    setViewSong(undefined);
  };

  const handleGoBackFromEditor = (): void => {
    setSelectedSong(undefined);
    history.push(routesPaths.path(i18n.language, 'search') + location.search);
  };

  const handleOpenScreen = (song?: IUnfetched<ISong>) => (): void => {
    setViewSong(song);
  };

  const handleSelectSong = (song: ISong): void => {
    setSelectedSong(song);
    history.push(routesPaths.path(i18n.language, 'search', song._id.toHexString()) + location.search);
    /* console.log(
      'From SearchPage, handleSelectSong.',
      'history:', history,
      'song:', song,
      'song._id.toHexString():', song._id.toHexString(),
    ); */
  };

  const handleToggleLogoMenu = (oc?: boolean) => (): void => {
    setLogoMenuDeployed(typeof oc === 'undefined' ? !logoMenuDeployed : oc);
  };

  const scrollDown = (): void => {
    const { current: contentArea } = contentAreaRef;
    if (contentArea) {
      contentArea.scrollIntoView({ behavior: 'smooth' });
      setTimeout(handleCloseInfos, 500);
    }
  };

  const handleFocus = (focus?: boolean) => (): void => {
    if (smallDevice) setTimeout(handleToggleLogoMenu(!focus), 100);
    if (showInfos && smallDevice) scrollDown();
  };

  // console.log('From SearchPage. render.');

  return (viewSong
    ? (
      <Screen
        disableLogoMenu
        headerAction={{
          Icon: Clear,
          label: t('Close'),
          onClick: handleCloseScreen,
        }}
        headerSubheader={viewSong.subtitle}
        headerTitle={viewSong.title}
        song={viewSong}
        title={`Alleluia.plus - ${viewSong.title}`}
      />
    ) : (
      <PageLayout
        menuProps={{ handleToggleLogoMenu, logoMenuDeployed }}
        sidePanel={showInfos && !Meteor.userId()
          ? (
            <InfosSongBySong handleCloseInfos={handleCloseInfos}>
              {smallDevice && (
                <Fab
                  variant="extended"
                  size="small"
                  aria-label="Continue"
                  className={classes.continueFab}
                  onClick={scrollDown}
                >
                  <ExpandMore className={classes.continueFabIcon} />
                  <Typography>{t('Continue')}</Typography>
                </Fab>
              )}
            </InfosSongBySong>
          )
          : undefined}
        title={t('search.Search songs', 'Search songs')}
        tutorialContentName={selectedSong ? 'Editor' : 'Search'}
        contentAreaRef={contentAreaRef}
        scrollDown={scrollDown}
      >
        <SearchList
          handleFocus={handleFocus}
          handleSelectSong={handleSelectSong}
          hidden={!!selectedSong}
          shortFirstItem={false}
          shortSearchField={logoMenuDeployed}
        />
        {selectedSong
          ? (
            <Editor
              actionIconButtonsProps={[{
                Icon: Eye,
                onClick: {
                  build: ({ element }: {
                    element?: IUnfetched<ISong>;
                  }): MouseEventHandler => (
                    element
                      ? handleOpenScreen(element)
                      : (): void => { /* Empty function */ }
                  ),
                },
                color: 'primary' as IIconColor,
                disabled: {
                  build: ({ otherParams }: {
                    otherParams?: { isThereSelected?: boolean };
                  }): boolean => !(otherParams && otherParams.isThereSelected),
                },
                key: 'view',
                label: t('editor.View', 'View'),
                labelVisible: !smallDevice,
              }]}
              goBack={handleGoBackFromEditor}
              logoMenuDeployed={logoMenuDeployed}
              song={selectedSong}
            />
          )
          : null}
      </PageLayout>
    )
  );
};

export default SearchPage;
