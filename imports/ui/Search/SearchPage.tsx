import { Meteor } from 'meteor/meteor';
import React, { createRef, useState } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import ExpandMore from '@material-ui/icons/ExpandMore';

import { useDeviceSize } from '../../hooks/contexts/DeviceSize';
import usePath from '../../hooks/usePath';
import InfosSongBySong from './InfosSongBySong';
import PageLayout from '../Common/PageLayout';
import Route from '../../routes/Route';
import SearchList from './SearchList';
import SongPage from '../Editor';

import { ISong } from '../../types/songTypes';

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
}));

export const SearchPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const { path } = usePath('SearchPage');
  const displaySongPage = !!useRouteMatch(path('song'));

  const [showInfos, setShowInfos] = useState(true);
  const smallDevice = useDeviceSize('sm', 'down');
  const classes = useStyles();
  const contentAreaRef = createRef<HTMLDivElement>();

  const handleCloseInfos = (): void => {
    setShowInfos(false);
  };

  const handleSelectSong = (song: ISong): void => {
    history.push(path(['song', ':songSlug'], { ':songSlug': song.slug }) + location.search);
    /* console.log(
      'From SearchPage, handleSelectSong.',
      'history:', history,
      'song:', song,
      'song._id.toHexString():', song._id.toHexString(),
    ); */
  };

  const scrollDown = (): void => {
    const { current: contentArea } = contentAreaRef;
    if (contentArea) {
      contentArea.scrollIntoView({ behavior: 'smooth' });
      setTimeout(handleCloseInfos, 500);
    }
  };

  // console.log('From SearchPage. render.');

  return (
    <>
      <Route exact path={path(['song', ':titleSlug'])} component={SongPage} />
      <Route exact path={path(['song', ':authorSlug', ':titleSlug'])} component={SongPage} />
      <PageLayout
        className={displaySongPage ? classes.hidden : undefined}
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
        tutorialContentName="Search"
        contentAreaRef={contentAreaRef}
        scrollDown={scrollDown}
      >
        <SearchList handleSelectSong={handleSelectSong} />
      </PageLayout>
    </>
  );
};

export default SearchPage;
