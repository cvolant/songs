import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import React, { SyntheticEvent, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { useTheme, makeStyles } from '@material-ui/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLess from '@material-ui/icons/ExpandLess';
import Help from '@material-ui/icons/Help';
import HelpOutline from '@material-ui/icons/HelpOutline';
import Home from '@material-ui/icons/Home';
import Menu from '@material-ui/icons/Menu';
import Person from '@material-ui/icons/Person';

import { useDeviceSize } from '../../state-contexts/app-device-size-context';
import Logo from './Logo';
import TopMenuLarge from './TopMenuLarge';
import TopMenuSmall from './TopMenuSmall';
import TopMenuContent from './TopMenuContent';

import routesPaths from '../../app/routesPaths';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '0 auto',
    width: theme.sizes.menuItem,
    height: theme.sizes.menuItem,
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: 2000,
  },

  drawerPaper: {
    background: theme.palette.primary.main,
    color: 'white',
    padding: theme.spacing(0, 1),
  },

  logo: {
    position: 'absolute',
    top: '10%',
    right: '10%',
    width: '60%',
    height: '60%',
  },

  logoArea: {
    background: theme.palette.primary.main,
  },

  logoAreaShape: {
    margin: '0 auto',
    width: '100%',
    height: '100%',
    position: 'absolute',
    right: '0',

    /* border-radius */
    borderRadius: '0 0 0 90%',
  },

  shadow: {
    filter: 'blur(5px)',
    background: 'black',
    opacity: 0.5,
  },

  tab: {
    background: theme.palette.secondary.main,
    color: 'black',
    cursor: 'pointer',

    '&:hover': {
      background: theme.palette.secondary.dark,
      color: theme.palette.secondary.light,
    },
  },
  tab1: {
    transform: (
      { scale }: { scale: number },
    ): string => `scale(${scale})`,
  },
  tab2: {
    transform: (
      { scale }: { scale: number },
    ): string => `rotate(30deg) scale(${scale})`,
  },
  tab3: {
    transform: (
      { scale }: { scale: number },
    ): string => `rotate(60deg) scale(${scale})`,
  },

  tabIcon: {
    position: 'relative',
    right: '-30%',
    top: '30%',
    transformOrigin: '30% 50%',

    '& svg': {
      width: '2.8rem',
      height: '2.8rem',
    },
  },
  tabIcon1: {
    transform: 'rotate(-0deg)',
  },
  tabIcon2: {
    transform: 'rotate(-30deg)',
  },
  tabIcon3: {
    transform: 'rotate(-60deg)',
  },

  tabShape: {
    color: 'black',
    height: '175%',
    margin: '0 auto',
    position: 'absolute',
    right: '0',
    width: '175%',
    transition: theme.transitions.create('transform'),

    /* border-radius */
    borderRadius: '0 0 0 100%',
    transformOrigin: '100% 0',
  },
}));

interface ILogoMenuProps {
  handleToggleLogoMenu?: (deploy?: boolean) => () => void;
  handleToggleTutorial?: (open?: boolean) => () => void;
  logoMenuDeployed?: boolean;
  showTutorial?: boolean;
  tutorialAvailable: boolean;
}
interface ILogoMenuWTData {
  isAuthenticated: boolean;
  handleLogout: () => void;
}
interface IWrappedLogoMenuProps
  extends ILogoMenuProps, ILogoMenuWTData {}

export const WrappedLogoMenu: React.FC<IWrappedLogoMenuProps> = ({
  isAuthenticated,
  handleLogout,
  handleToggleLogoMenu: propsHandleToggleLogoMenu,
  handleToggleTutorial,
  logoMenuDeployed: propsLogoMenuDeployed,
  showTutorial,
  tutorialAvailable,
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const location = useLocation();
  const smallDevice = useDeviceSize('sm.down');
  const [topMenuIsOpen, setTopMenuIsOpen] = useState(false);
  const [logoMenuDeployed, setLogoMenuDeployed] = typeof propsLogoMenuDeployed === 'undefined'
    ? useState(true)
    : [propsLogoMenuDeployed, (): void => { console.error('LogoMenu received a logoMenuDeployed prop without receiving a handleToggleLogoMenu prop...'); }];
  const classes = useStyles({ scale: logoMenuDeployed ? 1 : 0.63 });

  const handleToggleLogoMenu = propsHandleToggleLogoMenu
    || ((deploy?: boolean) => (): void => setLogoMenuDeployed(typeof deploy === 'undefined' ? !logoMenuDeployed : !!deploy));

  const PaperProps = { classes: { root: classes.drawerPaper }, elevation: 3 };

  let middleButton;
  const currentlyAt = (
    pathname: string,
  ): boolean => location.pathname.indexOf(routesPaths.translatePath(pathname, i18n.language)) >= 0;
  if (isAuthenticated) {
    middleButton = {
      ariaLabel: currentlyAt('/en/dashboard') ? t('Home') : t('Dashboard'),
      to: currentlyAt('/en/dashboard') ? `/${i18n.language}` : routesPaths.translatePath('/en/dashboard', i18n.language),
    };
  } else {
    middleButton = {
      ariaLabel: currentlyAt('/en/signin') ? t('Sign up') : t('Sign in'),
      to: {
        pathname: currentlyAt('/en/signin') ? routesPaths.translatePath('/en/signup', i18n.language) : routesPaths.translatePath('/en/signin', i18n.language),
        state: { from: location },
      },
    };
  }

  console.log('From LogoMenu. render.');

  const handleToggleTopMenu = (
    deploy?: boolean,
  ) => (
    event: SyntheticEvent<{}, Event>,
  ): void => {
    if (event && event.type === 'keydown') {
      const { key } = event as unknown as KeyboardEvent;
      if (key === 'Tab' || key === 'Shift') {
        console.log('From LogoMenu, handleToggleTopMenu. aborted. event.type:', event.type, 'event.key:', key);
        return;
      }
    }
    console.log('From LogoMenu, handleToggleTopMenu. performed. deploy (should be a bool):', deploy, 'former topMenuIsOpen:', topMenuIsOpen, 'event.currentTarget:', event.currentTarget);
    setTopMenuIsOpen(typeof deploy === 'undefined' ? !topMenuIsOpen : !!deploy);
  };

  return (
    <>
      {smallDevice
        ? (
          <TopMenuSmall
            PaperProps={PaperProps}
            handleToggleTopMenu={handleToggleTopMenu}
            topMenuIsOpen={topMenuIsOpen}
          >
            <TopMenuContent
              isAuthenticated={isAuthenticated}
              handleLogout={handleLogout}
              handleToggleTopMenu={handleToggleTopMenu}
            />
          </TopMenuSmall>
        )
        : (
          <TopMenuLarge
            PaperProps={PaperProps}
            topMenuIsOpen={topMenuIsOpen}
          >
            <TopMenuContent
              isAuthenticated={isAuthenticated}
              handleLogout={handleLogout}
              handleToggleTopMenu={handleToggleTopMenu}
            />
          </TopMenuLarge>
        )}
      <div className={classes.root}>
        <div className={clsx(classes.tabShape, classes.tab1, classes.shadow)} />
        <ButtonBase
          aria-label={t('Help')}
          className={clsx(classes.tabShape, classes.tab, classes.tab1)}
          component="div"
          disabled={!tutorialAvailable}
          onClick={handleToggleTutorial ? handleToggleTutorial() : undefined}
        >
          <div className={clsx(classes.tabIcon, classes.tabIcon1)}>
            {showTutorial ? <HelpOutline /> : <Help />}
          </div>
        </ButtonBase>

        <div className={clsx(classes.tabShape, classes.tab2, classes.shadow)} />
        <ButtonBase
          aria-label={middleButton.ariaLabel}
          className={clsx(classes.tabShape, classes.tab, classes.tab2)}
          component={Link}
          to={middleButton.to}
        >
          <div className={clsx(classes.tabIcon, classes.tabIcon2)}>
            {location.pathname.indexOf(routesPaths.translatePath('/en/dashboard', i18n.language)) >= 0 ? <Home /> : <Person />}
          </div>
        </ButtonBase>

        <div className={clsx(classes.tabShape, classes.tab3, classes.shadow)} />
        <ButtonBase
          aria-label={t('menus.Toggle detailed menu', 'Toggle detailed menu')}
          className={clsx(classes.tabShape, classes.tab, classes.tab3)}
          component="div"
          onClick={handleToggleTopMenu()}
        >
          <div className={clsx(classes.tabIcon, classes.tabIcon3)}>
            {topMenuIsOpen ? <ExpandLess /> : <Menu />}
          </div>
        </ButtonBase>

        <div className={clsx(classes.logoAreaShape, classes.shadow)} />
        <ButtonBase
          aria-label={t('menus.Toggle small menu', 'Toggle small menu')}
          component="div"
          onClick={handleToggleLogoMenu()}
          className={clsx(classes.logoAreaShape, classes.logoArea)}
        >
          <Logo className={classes.logo} fill={theme.palette.secondary.main} />
        </ButtonBase>
      </div>
    </>
  );
};

export const LogoMenu = withTracker<ILogoMenuWTData, ILogoMenuProps>(() => ({
  handleLogout: (): void => Accounts.logout(),
  isAuthenticated: !!Meteor.userId(),
}))(WrappedLogoMenu);

export default LogoMenu;
