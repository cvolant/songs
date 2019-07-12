import React, { createRef, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { withRouter } from "react-router";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Editor from '../Editor';
import InfosSongBySong from './InfosSongBySong';
import PageLayout from '../utils/PageLayout';
import SongList from '../SongList';

import {
  Fab,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

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
    maxWidth: '1000px',
    margin: '0 auto',
    overflow: 'hidden',
    width: '100%',
  },
}));

export const SearchPage = ({ songId, history }) => {
  const [logoMenuDeployed, setLogoMenuDeployed] = useState(true);
  const [selectedSong, setSelectedSong] = useState(/^(?:[0-9A-Fa-f]{6})+$/g.test(songId) ? { _id: new Meteor.Collection.ObjectID(songId) } : undefined);
  const [showInfos, setShowInfos] = useState(true);
  const [viewer, setViewer] = useState(null);
  const smallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();
  const contentAreaRef = createRef();

  const handleCloseInfos = () => setShowInfos(0);

/*   const handleToggleTutorial = open => () => setShowTutorial(typeof open == 'undefined' ? !showTutorial : !!open); */

  const handleFocus = focus => () => {
    if (smallDevice) handleToggleLogoMenu(!focus)();
    if (showInfos && smallDevice) scrollDown();
  };

  const handleGoBackFromEditor = () => {
    setSelectedSong(undefined);
    history.push('/search/');
  };

  const handleSelectSong = song => {
    setSelectedSong(song);
    history.push('/search/' + song._id._str);
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
      sidePanel={
        showInfos && <InfosSongBySong {...{ handleCloseInfos }}>
          {smallDevice &&
              <Fab
                variant="extended"
                size="small"
                aria-label="Continue"
                className={classes.continueFab}
                onClick={scrollDown}
              >
                <ExpandMore className={classes.continueFabIcon} />
                <Typography>Continuer</Typography>
              </Fab>
          }
        </InfosSongBySong>
      }
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