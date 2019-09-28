import React, { createRef, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { withRouter } from "react-router";
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

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

const useStyles = makeStyles(theme => ({
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
    }
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

export const SearchPage = ({ songId, history }) => {
  const { t, i18n } = useTranslation();
  const [logoMenuDeployed, setLogoMenuDeployed] = useState(true);
  const [selectedSong, setSelectedSong] = useState(/^(?:[0-9A-Fa-f]{6})+$/g.test(songId) ? { _id: new Meteor.Collection.ObjectID(songId) } : undefined);
  const [showInfos, setShowInfos] = useState(true);
  const [viewer, setViewer] = useState(null);
  const smallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();
  const contentAreaRef = createRef();

  const handleCloseInfos = () => setShowInfos(0);

  const handleFocus = focus => () => {
    if (smallDevice) handleToggleLogoMenu(!focus)();
    if (showInfos && smallDevice) scrollDown();
  };

  const handleGoBackFromEditor = () => {
    setSelectedSong(undefined);
    history.push(routesPaths.translatePath('/en/search/', i18n.language));
  };

  const handleSelectSong = song => {
    setSelectedSong(song);
    history.push(routesPaths.translatePath(`/en/search/${song._id._str}`, i18n.language));
    console.log('From SearchPage, handleSelectSong. history:', history, 'song:', song, 'song._id._str:', song._id._str);
  };
  
  const handleToggleLogoMenu = oc => () => setLogoMenuDeployed(typeof oc == 'undefined' ? !logoMenuDeployed : !!oc);
  
  const scrollDown = () => {
    contentAreaRef.current.scrollIntoView({ behavior: "smooth" });
    setTimeout(handleCloseInfos, 500);
  };

  console.log('From SearchPage. render.')

  return (
    <PageLayout
      menuProps={{ handleToggleLogoMenu, logoMenuDeployed }}
      showSidePanel={showInfos}
      sidePanel={showInfos && !Meteor.userId() &&
        <InfosSongBySong {...{ handleCloseInfos }}>
          {smallDevice &&
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
          }
        </InfosSongBySong>
      || undefined}
      title={t("search.Search songs", "Search songs")}
      tutorialContentName={selectedSong ? 'Editor' : 'SearchPage'}
      {...{ contentAreaRef, scrollDown, smallDevice, viewer }}
    >
      <div className={selectedSong ? classes.hidden : classes.searchPanel}>
        <SongList {...{ handleFocus, handleSelectSong, logoMenuDeployed, smallDevice }} />
      </div>
      {selectedSong ?
        <Editor
          logoMenuDeployed={logoMenuDeployed}
          song={selectedSong}
          goBack={handleGoBackFromEditor}
          viewer={toSendToViewer => setViewer(toSendToViewer)}
        />
        :
        null
      }
    </PageLayout >
  );
};

SearchPage.propTypes = {
  history: PropTypes.object.isRequired,
  songId: PropTypes.string,
};

export default withRouter(SearchPage);