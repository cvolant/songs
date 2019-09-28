import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';

import ButtonBase from '@material-ui/core/ButtonBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Home from '@material-ui/icons/Home';
import Loupe from '@material-ui/icons/Loupe';
import Power from '@material-ui/icons/Power';
import PowerOff from '@material-ui/icons/PowerOff';
import ScreenShare from '@material-ui/icons/ScreenShare';

import ListIcon from '@material-ui/icons/List';

import LanguagePicker from './LanguagePicker';

import routesPaths from '../../app/routesPaths';

const useStyles = makeStyles((theme) => ({
  cushion: {
    marginTop: theme.sizes.menuItem,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  list: {
    padding: 0,
    overflow: 'hidden',
  },
  listItem: {
    transition: theme.transitions.create('background-color'),
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

const NavButton = React.forwardRef(({
  nestedProps,
  ...others
}, ref) => <ButtonBase {...others} {...nestedProps} ref={ref} />);

export const TopMenuContent = ({
  isAuthenticated, handleLogout, handleToggleTopMenu, history, smallDevice,
}) => {
  const { t, i18n: { language: lng } } = useTranslation();
  const classes = useStyles();

  console.log('From TopMenuContent. lng:', lng, 'routesPaths:', routesPaths);

  const handleClick = (event) => {
    const { target } = event;
    const targetClasses = target.classList
      && [...target.classList, ...target.parentElement.classList];

    console.log('From TopMenuContent, handleClick. targetClasses:', targetClasses);
    if (!targetClasses || targetClasses.indexOf('languagePicker') === -1) handleToggleTopMenu(false)(event);
  };

  const navLinks = [
    { name: t('Home'), path: `/${lng}`, Icon: Home },
    {
      name: t('Song lists'), path: routesPaths.translatePath('/en/song-lists', lng), Icon: ListIcon, disabled: true,
    },
    {
      name: t('Shared view'), path: routesPaths.translatePath('/en/shared-view', lng), Icon: ScreenShare, disabled: true,
    },
    {
      name: t('About'), path: routesPaths.translatePath('/en/about', lng), Icon: Loupe, disabled: true,
    },
    {
      name: t('Logout'), onClick: () => handleLogout(), hide: !isAuthenticated, Icon: PowerOff,
    },
    {
      name: t('Login'), path: routesPaths.translatePath('/en/signin', lng), hide: isAuthenticated, Icon: Power,
    },
  ];

  return (
    <div
      className={classes.fullList}
      role={t('menu')}
      onClick={smallDevice ? handleClick : undefined}
      onKeyDown={handleToggleTopMenu(false)}
    >
      <List className={classes.list}>
        {navLinks.map((navLink, index) => (
          !navLink.hide && navLink.path !== location.pathname
          && (
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
          )
        ))}
        <ListItem
          key={navLinks.length}
          history={history}
          listClasses={{ listItem: classes.listItem, listItemText: classes.listItemText }}
          component={LanguagePicker}
        />
      </List>
    </div>
  );
};

TopMenuContent.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
  handleToggleTopMenu: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  smallDevice: PropTypes.bool,
};

export default withRouter(TopMenuContent);
