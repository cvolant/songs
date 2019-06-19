import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import {
  Button,
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core';
import Clear from '@material-ui/icons/Clear';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    float: 'left',
    height: '100%',
    justifyContent: 'space-between',
    padding: theme.spacing(4),
    position: 'relative',
  },
  bottomButtons: {
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    alignSelf: 'center',
    margin: theme.spacing(1, 0),
    maxWidth: '45rem',
    width: '100%',
  },
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: theme.spacing(1),
  },
  logoSpace: {
    borderRadius: '0 0 0 100%',
    float: 'right',
    height: '10rem',
    width: '10rem',
  },
  text: {
    overflow: 'auto',
    overflowWrap: 'break-word',
    marginTop: theme.spacing(1),
  },
}));

export const InfosSongBySong = props => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <IconButton className={classes.close} onClick={props.handleCloseInfos}>
        <Clear />
      </IconButton>
      <div className={classes.text}>
        <div className={classes.logoSpace} />
        <Typography variant="h2" component="h2" gutterBottom>
          Search song by song
        </Typography>
        <Typography component="p">
          Here you can search and display songs one by one, but you need to sign in if you want to build a repertoire, a song list for an event, save your songs, etc.
        </Typography>
      </div>
      {props.children}
      <div className={classes.bottomButtons}>
        <Button variant="contained" color="primary" className={classes.button}>
          Sign In
      </Button>
        <Button variant="contained" color="primary" className={classes.button}>
          Create an&nbsp;Account (that's&nbsp;free)
      </Button>
      </div>
    </Paper>
  );
}

InfosSongBySong.propTypes = {
  handleCloseInfos: PropTypes.func.isRequired,
  showInfos: PropTypes.number.isRequired,
};

export default InfosSongBySong;