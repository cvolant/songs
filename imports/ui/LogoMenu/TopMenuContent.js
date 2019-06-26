import React from "react";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Home, Loupe, ScreenShare } from '@material-ui/icons';
import ListIcon from '@material-ui/icons/List';

const navLinks = [
  { name: 'Home', path: '/', Icon: Home },
  { name: 'Song lists', path: '/song-lists', Icon: ListIcon },
  { name: 'Shared view', path: '/shared view', Icon: ScreenShare },
  { name: 'About', path: '/about', Icon: Loupe },
];

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

export const TopMenuContent = ({ handleToggleTopMenu, smallDevice }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <div
        className={classes.fullList}
        role="presentation"
        onClick={handleToggleTopMenu(false)}
        onKeyDown={handleToggleTopMenu(false)}
      >
        <List className={classes.list}>
          {navLinks.map((navLink, index) => (
            <ListItem button className={classes.listItem} key={index}>
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
  smallDevice: PropTypes.bool.isRequired,
  handleToggleTopMenu: PropTypes.func.isRequired,
};

export default TopMenuContent;