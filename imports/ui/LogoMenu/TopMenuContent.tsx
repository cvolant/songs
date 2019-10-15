import React, {
  EventHandler,
  KeyboardEvent,
  MouseEvent,
  MouseEventHandler,
} from 'react';
import { Link, useLocation } from 'react-router-dom';

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
import routesPaths, { locales } from '../../app/routesPaths';

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
  handleLogout: () => void;
  handleToggleTopMenu: (deploy: boolean | undefined) => EventHandler<MouseEvent | KeyboardEvent>;
  isAuthenticated: boolean;
  smallDevice: boolean;
}
/* interface INavButtonProps {
  className: string;
  key: string;
  nestedProps: {
    component: React.Component | undefined;
    disabled: boolean;
    onClick: MouseEventHandler;
    to: string;
  };
}

const NavButton: React.FC<
INavButtonProps
> = React.forwardRef<any, INavButtonProps>(({
  className,
  key,
  nestedProps: {
    component,
    disabled,
    onClick,
    to,
  },
}, ref) => (
  <ButtonBase
    className={className}
    component={component}
    disabled={disabled}
    key={key}
    onClick={onClick}
    ref={ref}
    to={to}
  />
));
 */
export const TopMenuContent: React.FC<ITopMenuContentProps> = ({
  handleLogout,
  handleToggleTopMenu,
  isAuthenticated,
  smallDevice,
}) => {
  const { t, i18n: { language: lng } } = useTranslation();
  const classes = useStyles();
  const location = useLocation();

  console.log('From TopMenuContent. lng:', lng, 'routesPaths:', routesPaths);

  const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
    const { currentTarget: { classList: targetClasses } } = event;
    console.log('From TopMenuContent, handleClick. targetClasses:', targetClasses);
    if (!targetClasses || targetClasses.contains('languagePicker')) handleToggleTopMenu(false)(event);
  };

  const navLinks = [
    { name: t('Home'), path: `/${lng}`, Icon: Home },
    {
      name: t('Song lists'),
      path: routesPaths.translatePath('/en/song-lists', locales[lng]),
      Icon: ListIcon,
      disabled: true,
    },
    {
      name: t('Shared view'),
      path: routesPaths.translatePath('/en/shared-view', locales[lng]),
      Icon: ScreenShare,
      disabled: true,
    },
    {
      name: t('About'),
      path: routesPaths.translatePath('/en/about', locales[lng]),
      Icon: Loupe,
      disabled: true,
    },
    {
      name: t('Logout'),
      onClick: (): void => handleLogout(),
      hide: !isAuthenticated,
      Icon: PowerOff,
    },
    {
      name: t('Login'),
      path: routesPaths.translatePath('/en/signin', locales[lng]),
      hide: isAuthenticated,
      Icon: Power,
    },
  ];

  return (
    <div
      className={classes.fullList}
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
              disabled={navLink.disabled}
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
