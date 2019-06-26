import React, { createRef, useState } from 'react';

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
  CircularProgress,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  circularProgress: {
    width: '6rem',
    height: '6rem',
    position: 'relative',
    top: 'calc(50% - 6rem)',
    left: 'calc(50% - 6rem)',
  },
  contentArea: {
    display: 'flex',
    overflow: 'hidden',
  },
  continueFabIcon: {
    border: `1px solid ${theme.palette.primary.main}`,
    fill: theme.palette.primary.main,
    borderRadius: '50%',
  },
  /* 
  editor: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: '0',
    height: '100%',
    marginLeft: ({ editorVisible }) => (-editorVisible * 100) + '%',
    padding: '16px',
    top: '0',
    transform: 'translateZ()',
    transition: 'margin 0.5s ease',
    width: '100%',
    zIndex: '2',
  },
 */
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
  searchPannel: {
    width: '100%',
  },
}));

export const SearchPage = ({ songId }) => {
  const [loading, setLoading] = useState(false);
  const [logoMenuDeployed, setLogoMenuDeployed] = useState(true);
  const [selectedSong, setSelectedSong] = useState(songId ? { _id: songId } : undefined);
  const [showInfos, setShowInfos] = useState(25);
  /* const [editorVisible, setEditorVisible] = useState(!!songId); */
  const smallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles({ /* editorVisible */ });
  const contentAreaRef = createRef();

  const handleCloseInfos = () => setShowInfos(0);

  const handleFocus = focus => () => {
    if (smallDevice) handleToggleLogoMenu(!focus)();
    if (showInfos && smallDevice) scrollDown();
  };

  const handleGoBackFromEditor = () => {
    /* setEditorVisible(false);
    setTimeout(() => */ setSelectedSong(undefined)/* , 500) */;
  };

  const handleSelectSong = song => {
    setSelectedSong(song);
    /* setTimeout(() => setEditorVisible(true), 200); */
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
        smallDevice={smallDevice}
      />
      <Grid container spacing={4} className={classes.pageContent}>
        {showInfos ?
          <Grid item sm={12} md={4} lg={3}>
            <InfosSongBySong
              handleCloseInfos={handleCloseInfos}
              showInfos={showInfos}
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
          <div className={selectedSong ? classes.hidden : classes.searchPannel}>
            <SearchField extended={!logoMenuDeployed} handleFocus={handleFocus} loading={loading} />
            <SongList /* extended={!logoMenuDeployed} */ handleSelectSong={handleSelectSong} /* loading={loading} */ setLoading={setLoading} />
          </div>
          {
            selectedSong ?
              selectedSong.titre ? <Editor song={selectedSong} goBack={handleGoBackFromEditor} /* editorClassName={classes.editor} */ /> : <CircularProgress className={classes.circularProgress} />
              : null
          }
        </Grid>
      </Grid>
    </div >
  );
}

export default SearchPage;