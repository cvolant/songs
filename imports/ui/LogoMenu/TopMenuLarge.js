import React from "react";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Drawer from '@material-ui/core/Drawer';

const useStyles = makeStyles(theme => ({
  cushion: {
    transition: theme.transitions.create('margin-top', { duration: theme.transitions.duration.shorter }),
    marginTop: ({ topMenuIsOpen }) => topMenuIsOpen && theme.sizes.menuItem,
  },
}));

export const TopMenuLarge = ({ children, PaperProps, topMenuIsOpen }) => {
  const classes = useStyles({ topMenuIsOpen });

  return (
    <React.Fragment>
      <Drawer
        anchor="top"
        open={topMenuIsOpen}
        PaperProps={PaperProps}
        variant="persistent"
      >
        {children}
      </Drawer>
      <div className={classes.cushion} />
    </React.Fragment>
  );
}

TopMenuLarge.propTypes = {
  topMenuIsOpen: PropTypes.bool.isRequired,
};

export default TopMenuLarge;