import React, { createRef, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import ExpandMore from '@material-ui/icons/ExpandMore';

import Editor from '../Editor';
import InfosSongBySong from './InfosSongBySong';
import PageLayout from '../utils/PageLayout';
import SongList from '../SongList';

import routesPaths from '../../app/routesPaths';
import { ISong } from '../../api/songs';

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
  hidden: {
    display: 'none',
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
  searchPanel: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0 auto',
    overflow: 'hidden',
    width: '100%',
  },
}));

interface ISearchPageProps {
  songId: string;
}

export const SearchPage: React.FC<ISearchPageProps> = ({
  songId,
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const history = useHistory();
  const [logoMenuDeployed, setLogoMenuDeployed] = useState(true);
  const [selectedSong, setSelectedSong] = useState(/^(?:[0-9A-Fa-f]{6})+$/g.test(songId) ? { _id: new Meteor.Collection.ObjectID(songId) } : undefined);
  const [showInfos, setShowInfos] = useState(true);
  const [viewer, setViewer] = useState<React.ReactNode | null>(undefined);
  const smallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();
  const contentAreaRef = createRef<HTMLDivElement>();

  const handleCloseInfos = (): void => { setShowInfos(false); };

  const handleGoBackFromEditor = (): void => {
    setSelectedSong(undefined);
    history.push(routesPaths.translatePath('/en/search/', i18n.language));
  };

  const handleSelectSong = (song: ISong): void => {
    setSelectedSong(song);
    history.push(routesPaths.translatePath(`/en/search/${song._id.toHexString()}`, i18n.language));
    console.log('From SearchPage, handleSelectSong. history:', history, 'song:', song, 'song._id.toHexString():', song._id.toHexString());
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
    if (smallDevice) handleToggleLogoMenu(!focus)();
    if (showInfos && smallDevice) scrollDown();
  };

  console.log('From SearchPage. render.');

  return (
    <PageLayout
      menuProps={{ handleToggleLogoMenu, logoMenuDeployed }}
      sidePanel={showInfos && !Meteor.userId()
        ? (
          <InfosSongBySong handleCloseInfos={handleCloseInfos}>
            {smallDevice
              && (
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
      tutorialContentName={selectedSong ? 'Editor' : 'SearchPage'}
      contentAreaRef={contentAreaRef}
      scrollDown={scrollDown}
      smallDevice={smallDevice}
      viewer={viewer}
    >
      <div className={selectedSong ? classes.hidden : classes.searchPanel}>
        <SongList
          handleFocus={handleFocus}
          handleSelectSong={handleSelectSong}
          logoMenuDeployed={logoMenuDeployed}
          smallDevice={smallDevice}
        />
      </div>
      {selectedSong
        ? (
          <Editor
            logoMenuDeployed={logoMenuDeployed}
            song={selectedSong}
            goBack={handleGoBackFromEditor}
            viewer={setViewer}
          />
        )
        : null}
    </PageLayout>
  );
};

export default SearchPage;
