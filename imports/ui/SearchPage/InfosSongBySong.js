import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Panel from '../utils/Panel';

import {
  Button,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  bottomButtons: {
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    alignSelf: 'center',
    margin: theme.spacing(1, 0),
    maxWidth: '45rem',
    width: '100%',
    textAlign: 'center',
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
    <Panel handleClosePanel={props.handleCloseInfos}>
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
        <Button component={Link} to="/signin" variant="contained" color="primary" className={classes.button}>
          Sign In
        </Button>
        <Button component={Link} to="/signup" variant="contained" color="primary" className={classes.button}>
          Create an&nbsp;Account (that's&nbsp;free)
        </Button>
      </div>
    </Panel>
  );
}

InfosSongBySong.propTypes = {
  handleCloseInfos: PropTypes.func.isRequired,
};

export default InfosSongBySong;