import React from 'react';
import PropTypes from 'prop-types';
import { Accounts } from "meteor/accounts-base";
import { Session } from "meteor/session";
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

function ButtonAppBar(props) {
  const navImageSrc = props.isNavOpen ? '/images/x.svg' : '/images/bars.svg';
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton className={'head-bar__nav-toggle ' + classes.menuButton} color="inherit" aria-label="Menu" onClick={props.toggleNav}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            {props.title}
          </Typography>
          <Button color="inherit" onClick={() => props.handleLogout()}>Logout</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  handleLogout: PropTypes.func.isRequired,
  isNavOpen: PropTypes.bool.isRequired,
  toggleNav: PropTypes.func.isRequired
};

export default withTracker(props => {
  return {
    handleLogout: () => Accounts.logout(),
    isNavOpen: Session.get('isNavOpen'),
    toggleNav: () => Session.set('isNavOpen', !Session.get('isNavOpen'))
  };
})(withStyles(styles)(ButtonAppBar));