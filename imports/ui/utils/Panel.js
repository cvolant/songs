import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import {
  IconButton,
  Paper,
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
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: theme.spacing(1),
  },
}));

export const Panel = ({ children, handleClosePanel }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <IconButton className={classes.close} onClick={handleClosePanel}>
        <Clear />
      </IconButton>
      {children}
    </Paper>
  );
}

Panel.propTypes = {
  handleClosePanel: PropTypes.func.isRequired,
};

export default Panel;