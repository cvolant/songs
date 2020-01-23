import React, {
  EventHandler,
  KeyboardEvent,
  MouseEvent,
  MouseEventHandler,
} from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import shortid from 'shortid';
import clsx from 'clsx';

import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Home from '@material-ui/icons/Home';
import Loupe from '@material-ui/icons/Loupe';
import Person from '@material-ui/icons/Person';
import Power from '@material-ui/icons/Power';
import PowerOff from '@material-ui/icons/PowerOff';
import RssFeed from '@material-ui/icons/RssFeed';

import { useDeviceSize } from '../../hooks/contexts/app-device-size-context';
import LanguagePicker from './LanguagePicker';

import { IBroadcastRights } from '../../types/broadcastTypes';

import routesPaths, { locales } from '../../app/routesPaths';
import { broadcastInsert } from '../../api/broadcasts/methods';

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
    borderBottom: `1px solid ${theme.palette.darken.light}`,
    color: 'white',
    marginBottom: '-1px',
    padding: theme.spacing(2),
    transition: theme.transitions.create('background-color'),
    verticalAlign: 'baseline',

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

interface ITopMenuContentProps {
  className?: string;
  handleLogout: () => void;
  handleToggleTopMenu: (deploy: boolean | undefined) => EventHandler<MouseEvent | KeyboardEvent>;
  isAuthenticated: boolean;
}

export const TopMenuContent: React.FC<ITopMenuContentProps> = ({
  className,
  handleLogout,
  handleToggleTopMenu,
  isAuthenticated,
}) => {
  const { t, i18n: { language: lng } } = useTranslation();
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const smallDevice = useDeviceSize('sm', 'down');

  console.log('From TopMenuContent. lng:', lng, 'routesPaths:', routesPaths);

  const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
    const { currentTarget: { classList: targetClasses } } = event;
    console.log('From TopMenuContent, handleClick. targetClasses:', targetClasses);
    if (!targetClasses || targetClasses.contains('languagePicker')) handleToggleTopMenu(false)(event);
  };

  const handleFreeBroadcast = (): void => {
    const addresses = ([
      'owner',
      'control',
      'navigate',
      'readOnly',
    ] as IBroadcastRights[]).map((rights) => ({
      id: shortid.generate(),
      rights,
    }));
    broadcastInsert.call({ addresses }, (_err, res) => {
      if (res) {
        history.push(routesPaths.path(lng, 'dashboard', 'broadcast', addresses[0].id));
      }
    });
  };

  const navLinks = [
    { name: t('Home'), path: `/${lng}`, Icon: Home },
    {
      name: t('About'),
      path: routesPaths.path(locales[lng], 'about'),
      Icon: Loupe,
    },
    {
      name: t('Dashboard'),
      path: routesPaths.path(locales[lng], 'dashboard'),
      hide: !isAuthenticated,
      Icon: Person,
    },
    {
      name: t('Free broadcast'),
      onClick: handleFreeBroadcast,
      hide: !isAuthenticated,
      Icon: RssFeed,
    },
    {
      name: t('Logout'),
      onClick: (): void => handleLogout(),
      hide: !isAuthenticated,
      Icon: PowerOff,
    },
    {
      name: t('Login'),
      path: routesPaths.path(locales[lng], 'signin'),
      hide: isAuthenticated,
      Icon: Power,
    },
  ];

  return (
    <div
      className={clsx(classes.fullList, className)}
      onClick={smallDevice ? handleClick : undefined}
      onKeyDown={handleToggleTopMenu(false)}
      role="menu"
      tabIndex={0}
    >
      <List className={classes.list}>
        {navLinks.map((navLink) => (
          !navLink.hide && navLink.path !== location.pathname
          && (
            <ListItem
              className={classes.listItem}
              component={navLink.path ? Link : ButtonBase}
              onClick={navLink.onClick}
              to={navLink.path}
              key={navLink.name}
            >
              <ListItemIcon className={classes.listItemIcon}><navLink.Icon /></ListItemIcon>
              <ListItemText primary={navLink.name} />
            </ListItem>
          )
        ))}
        <ListItem
          key={navLinks.length}
          listClasses={{ listItem: classes.listItem }}
          component={LanguagePicker}
        />
      </List>
    </div>
  );
};

export default TopMenuContent;
