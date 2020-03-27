import { Meteor } from 'meteor/meteor';
import React, { createRef, useState } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import ExpandMore from '@material-ui/icons/ExpandMore';

import { useDeviceSize } from '../../hooks/contexts/app-device-size-context';
import InfosSongBySong from './InfosSongBySong';
import PageLayout from '../Common/PageLayout';
import SearchList from './SearchList';
import SongPage from '../Editor';

import { ISong } from '../../types/songTypes';

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

interface ISlugParams {
  authorSlug: string;
  titleSlug: string;
}

export const SearchPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const matchWithAuthor = useRouteMatch<ISlugParams>(routesPaths.path(i18n.language, 'song', ':authorSlug', ':titleSlug'));
  const matchWithoutAuthor = useRouteMatch<ISlugParams>(routesPaths.path(i18n.language, 'song', ':titleSlug'));
  const {
    params: {
      authorSlug,
      titleSlug,
    },
  } = matchWithAuthor || matchWithoutAuthor || { params: {} };
  const slug = `${authorSlug ? `${authorSlug}/` : ''}${titleSlug}`;

  console.log(
    'From SearchPage.',
    '\nuseRouteMatch:', useRouteMatch,
    '\nauthorSlug:', authorSlug,
    '\ntitleSlug:', titleSlug,
  );
  const [logoMenuDeployed, setLogoMenuDeployed] = useState(true);
  const [showInfos, setShowInfos] = useState(true);
  const smallDevice = useDeviceSize('sm', 'down');
  const classes = useStyles();
  const contentAreaRef = createRef<HTMLDivElement>();

  const handleCloseInfos = (): void => {
    setShowInfos(false);
  };

  const handleSelectSong = (song: ISong): void => {
    history.push(routesPaths.path(i18n.language, 'song', song.slug) + location.search);
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

  return (
    <>
      {titleSlug ? <SongPage slug={slug} /> : null}
      <PageLayout
        className={titleSlug ? classes.hidden : undefined}
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
        tutorialContentName="Search"
        contentAreaRef={contentAreaRef}
        scrollDown={scrollDown}
      >
        <SearchList
          handleFocus={handleFocus}
          handleSelectSong={handleSelectSong}
          shortFirstItem={false}
          shortSearchField={logoMenuDeployed}
        />
      </PageLayout>
    </>
  );
};

export default SearchPage;
