import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  circularProgress: {
    height: '8rem',
    weight: '8rem',
  },
}));

export const SongListItemLoading = () => {
  const classes = useStyles();

  return (
    <ListItem className={classes.root} divider>
      <CircularProgress />
    </ListItem>
  );
};

export default SongListItemLoading;
