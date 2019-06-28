import React, { createRef, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { withRouter } from "react-router";
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import LogoMenu from '../LogoMenu';
import SearchField from './SearchField';
import InfosSongBySong from './InfosSongBySong';
import SongList from '../SongList';
import Editor from '../Editor';

import {
  Fab,
  Grid,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  contentArea: {
    display: 'flex',
    overflow: 'hidden',
  },
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
    width: '100%',
  },
}));

export const SearchPage = ({ songId, history }) => {
  const [loading, setLoading] = useState(false);
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

  const handleGoBackFromEditor = () => setSelectedSong(undefined);

  const handleSelectSong = song => {
    setSelectedSong(song);
    history.push('/search/' + song._id._str);
    console.log('From SearchPage, handleSelectSong. history:', history, 'song:', song, 'song._id._str:', song._id._str);
  };

  const handleToggleLogoMenu = oc => () => {
    console.log('From SearchPage, handleToggleLogoMenu. oc (should be a bool):', oc);
    setLogoMenuDeployed(typeof oc == 'undefined' ? !logoMenuDeployed : !!oc);
  }

  const scrollDown = () => {
    contentAreaRef.current.scrollIntoView({ behavior: "smooth" });
    setTimeout(handleCloseInfos, 500);
  };

  console.log('From SearchPage. render.')

  return (
    <div className={classes.root}>
      <LogoMenu
        handleToggleLogoMenu={handleToggleLogoMenu}
        logoMenuDeployed={logoMenuDeployed}
      />
      <Grid container spacing={4} className={classes.pageContent}>
        {showInfos ?
          <Grid item sm={12} md={4} lg={3}>
            <InfosSongBySong
              handleCloseInfos={handleCloseInfos}
            >
              {
                smallDevice ?
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
                  : undefined
              }
            </InfosSongBySong>
          </Grid>
          : null}
        <Grid item xs={12} md={showInfos ? 8 : undefined} lg={showInfos ? 9 : undefined} ref={contentAreaRef} className={classes.contentArea}>
          <div className={selectedSong ? classes.hidden : classes.searchPanel}>
            <SearchField extended={!logoMenuDeployed} handleFocus={handleFocus} loading={loading} />
            <SongList handleSelectSong={handleSelectSong} setLoading={setLoading} />
          </div>
          {selectedSong ?
            <Editor
              song={selectedSong}
              goBack={handleGoBackFromEditor}
              viewer={toSendToViewer => setViewer(toSendToViewer)}
            />
            :
            null
          }
        </Grid>
      </Grid>
      {viewer}
    </div >
  );
};

SearchPage.propTypes = {
  history: PropTypes.object.isRequired,
  songId: PropTypes.string,
};

export default withRouter(SearchPage);