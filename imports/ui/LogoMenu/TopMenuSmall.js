import React from "react";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

const useStyles = makeStyles(theme => ({
  cushion: {
    marginTop: theme.sizes.menuItem,
  },
}));

export const TopMenuSmall = ({ children, handleToggleTopMenu, PaperProps, topMenuIsOpen }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <SwipeableDrawer
        anchor="top"
        open={topMenuIsOpen}
        onClose={handleToggleTopMenu(false)}
        onOpen={handleToggleTopMenu(true)}
        PaperProps={PaperProps}
      >
        {children}
      </SwipeableDrawer>
    </React.Fragment>
  );
}

TopMenuSmall.propTypes = {
  className: PropTypes.object,
  handleToggleTopMenu: PropTypes.func.isRequired,
  topMenuIsOpen: PropTypes.bool.isRequired,
};

export default TopMenuSmall;