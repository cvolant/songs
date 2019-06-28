import React from "react";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { ButtonBase, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Home, Loupe, Power, PowerOff, ScreenShare } from '@material-ui/icons';
import ListIcon from '@material-ui/icons/List';

const useStyles = makeStyles(theme => ({
  cushion: {
    marginTop: theme.sizes.menuItem,
  },
  list: {
    padding: 0,
    overflow: 'hidden',
  },
  listItem: {
    transition: 'background-color 0.3s ease',
    borderBottom: `1px solid ${theme.palette.darken.light}`,
    marginBottom: '-1px',
    padding: theme.spacing(2),

    [theme.breakpoints.up('md')]: {
      display: 'inline-flex',
      width: 'auto',
    },
    '&:hover': {
      background: theme.palette.darken.light,
    },
  },
  listItemIcon: {
    color: 'inherit',
    marginRight: theme.spacing(1),
    minWidth: 0,
  },
  fullList: {
    width: 'auto',
  },
}));

const NavButton = React.forwardRef(({ nestedProps, ...others }, ref) => <ButtonBase {...others} {...nestedProps} ref={ref} />);

export const TopMenuContent = ({ isAuthenticated, handleLogout, handleToggleTopMenu, smallDevice }) => {
  const classes = useStyles();

  const navLinks = [
    { name: 'Home', path: '/', Icon: Home },
    { name: 'Song lists', path: '/song-lists', Icon: ListIcon, disabled: true },
    { name: 'Shared view', path: '/shared view', Icon: ScreenShare, disabled: true },
    { name: 'About', path: '/about', Icon: Loupe, disabled: true },
    { name: 'Logout', onClick: () => handleLogout(), hide: !isAuthenticated, Icon: PowerOff },
    { name: 'Login', path: '/signin', hide: isAuthenticated, Icon: Power },
  ];

  return (
    <React.Fragment>
      <div
        className={classes.fullList}
        role="presentation"
        onClick={smallDevice ? handleToggleTopMenu(false) : undefined}
        onKeyDown={handleToggleTopMenu(false)}
      >
        <List className={classes.list}>
          {navLinks.map((navLink, index) => (
            navLink.hide || navLink.path == location.pathname ? null :
              <ListItem
                className={classes.listItem}
                component={NavButton}
                nestedProps={{
                  component: navLink.path ? Link : undefined,
                  disabled: navLink.disabled,
                  onClick: navLink.onClick,
                  to: navLink.path,
                }}
                key={index}
              >
                <ListItemIcon className={classes.listItemIcon}><navLink.Icon /></ListItemIcon>
                <ListItemText primary={navLink.name} />
              </ListItem>
          ))}
        </List>
      </div>
    </React.Fragment>
  );
}

TopMenuContent.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
  handleToggleTopMenu: PropTypes.func.isRequired,
};

export default TopMenuContent;