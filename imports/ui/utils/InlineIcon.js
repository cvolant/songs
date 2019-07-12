import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  inlineIcon: {
      height: '0.8em',
      margin: '0 3px',
      position: 'relative',
      top: '4px',
  },
}));

export const InlineIcon = ({ Icon }) => {
  const classes = useStyles();

  return (
    <Icon className={classes.inlineIcon}>
      
    </Icon>
  );
}

InlineIcon.propTypes = {
  Icon: PropTypes.object.isRequired,
};

export default InlineIcon;