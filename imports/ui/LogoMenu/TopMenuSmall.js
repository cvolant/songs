import React from "react";
import PropTypes from 'prop-types';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

export const TopMenuSmall = ({ children, handleToggleTopMenu, PaperProps, topMenuIsOpen }) => (
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

TopMenuSmall.propTypes = {
  className: PropTypes.object,
  handleToggleTopMenu: PropTypes.func.isRequired,
  topMenuIsOpen: PropTypes.bool.isRequired,
};

export default TopMenuSmall;