import React from 'react';
import PropTypes from 'prop-types';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

export const TopMenuSmall = ({
  children, handleToggleTopMenu, PaperProps, topMenuIsOpen,
}) => (
  <>
    <SwipeableDrawer
      anchor="top"
      open={topMenuIsOpen}
      onClose={handleToggleTopMenu(false)}
      onOpen={handleToggleTopMenu(true)}
      PaperProps={PaperProps}
    >
      {children}
    </SwipeableDrawer>
  </>
);

TopMenuSmall.propTypes = {
  handleToggleTopMenu: PropTypes.func.isRequired,
  topMenuIsOpen: PropTypes.bool.isRequired,
};

export default TopMenuSmall;
