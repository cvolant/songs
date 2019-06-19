import React, { createRef, useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import LogoMenu from '../LogoMenu';
import SearchField from './SearchField';
import InfosSongBySong from './InfosSongBySong';
import SongList from '../SongList';

import {
  Fab,
  Grid,
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
  pageContent: {
    '& > *': {
      height: '100vh',
      padding: theme.spacing(4, 4, 4, 4),
    }
  },
  root: {
    height: '100vh',
    width: '100vw',
    padding: theme.spacing(2),
  },
  searchPannel: {
    overflow: 'hidden',
  },
}));

export const SearchPage = () => {
  let smallDevice;

  const classes = useStyles();
  const [showInfos, setShowInfos] = useState(25);
  const [logoMenuDeployed, setLogoMenuDeployed] = useState(true);
  
  useEffect(() => {
    console.log('From SearchPage, useEffect.');
    if (smallDevice) {
      console.log('From SearchPage, useEffect. smallDevice:', smallDevice);
      const menuDeployment = setTimeout(() => setLogoMenuDeployed(false),5000);
      return () => clearTimeout(menuDeployment); 
    }
  }, [smallDevice]);

  smallDevice = useMediaQuery(theme.breakpoints.down('sm'));

  const searchPannelRef = createRef();

  const handleCloseInfos = () => setShowInfos(0);

  const handleToggleLogoMenu = () => {
    const isDeployed = logoMenuDeployed;
    setLogoMenuDeployed(!isDeployed);
    if (smallDevice && !isDeployed) {
      setTimeout(() => {
        setLogoMenuDeployed(false);
      },5000)
    }
  };

  const scrollDown = () => {
    searchPannelRef.current.scrollIntoView({ behavior: "smooth" });
    setTimeout(handleCloseInfos, 1000);
  };

  return (
    <div className={classes.root}>
      <LogoMenu
        handleToggle={handleToggleLogoMenu}
        isDeployed={logoMenuDeployed}
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
        <Grid item xs={12} md={showInfos ? 8 : undefined} lg={showInfos ? 9 : undefined} ref={searchPannelRef} className={classes.searchPannel}>
          <SearchField extended={!logoMenuDeployed} />
          <SongList />
        </Grid>
      </Grid>
    </div >
  );
}

export default SearchPage;