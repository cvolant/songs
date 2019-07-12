import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
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
    justifyContent: 'space-between',
    padding: theme.spacing(4),
    position: 'relative',
    
    '& > *': {
      zIndex: 0,
    },
  },
  close: {
    margin: theme.spacing(1),
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 2,
  },
}));

export const Panel = ({ children, classes: propClasses, className, handleClosePanel }) => {
  const classes = useStyles();

  return (
    <Paper className={clsx(classes.root, className, propClasses && propClasses.root)}>
      <IconButton className={clsx(classes.close, propClasses && propClasses.iconButton)} onClick={handleClosePanel}>
        <Clear className={propClasses && propClasses.icon} />
      </IconButton>
      {children}
    </Paper>
  );
}

Panel.propTypes = {
  handleClosePanel: PropTypes.func.isRequired,
  classes: PropTypes.object,
};

export default Panel;