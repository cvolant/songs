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

import { useDeviceSize } from '../../hooks/contexts/app-device-size-context';
import Logo from './Logo';
import TopMenuLarge from './TopMenuLarge';
import TopMenuSmall from './TopMenuSmall';
import TopMenuContent from './TopMenuContent';
import { IIcon } from '../../types/iconButtonTypes';

import routesPaths from '../../routes/routesPaths';

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

interface IMiddleButton {
  ariaLabel: string;
  Icon: IIcon;
  to: string;
}
type IKnownMiddleButtonNames = 'home' | 'dashboard' | 'signup' | 'signin';
export type ILogoMenuMiddleButtonProp = IMiddleButton | IKnownMiddleButtonNames;
export interface ILogoMenuClasses {
  logoMenu?: string;
  topMenu?: string;
  topMenuContent?: string;
  topMenuLarge?: string;
  topMenuSmall?: string;
}

interface ILogoMenuProps {
  classes?: ILogoMenuClasses;
  handleToggleLogoMenu?: (deploy?: boolean) => () => void;
  handleToggleTutorial?: (open?: boolean) => () => void;
  logoMenuDeployed?: boolean;
  middleButton?: ILogoMenuMiddleButtonProp;
  showTutorial?: boolean;
  tutorialAvailable: boolean;
}
interface ILogoMenuWTData {
  isAuthenticated: boolean;
  handleLogout: () => void;
}
interface IWrappedLogoMenuProps
  extends ILogoMenuProps, ILogoMenuWTData { }

export const WrappedLogoMenu: React.FC<IWrappedLogoMenuProps> = ({
  classes: {
    logoMenu: logoMenuClassNameProp,
    topMenu: topMenuClassNameProp,
    topMenuContent: topMenuContentClassNameProp,
    topMenuLarge: topMenuLargeClassNameProp,
    topMenuSmall: topMenuSmallClassNameProp,
  } = {},
  handleLogout,
  handleToggleLogoMenu: propsHandleToggleLogoMenu,
  handleToggleTutorial,
  isAuthenticated,
  logoMenuDeployed: propsLogoMenuDeployed,
  middleButton: middleButtonProps,
  showTutorial,
  tutorialAvailable,
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const location = useLocation();
  const smallDevice = useDeviceSize('sm', 'down');
  const [topMenuIsOpen, setTopMenuIsOpen] = useState(false);
  const [logoMenuDeployed, setLogoMenuDeployed] = typeof propsLogoMenuDeployed === 'undefined'
    ? useState(true)
    : [propsLogoMenuDeployed, (): void => { console.error('LogoMenu received a logoMenuDeployed prop without receiving a handleToggleLogoMenu prop...'); }];
  const classes = useStyles({ scale: logoMenuDeployed ? 1 : 0.63 });

  const handleToggleLogoMenu = propsHandleToggleLogoMenu
    || ((deploy?: boolean) => (): void => setLogoMenuDeployed(typeof deploy === 'undefined' ? !logoMenuDeployed : !!deploy));

  const PaperProps = { classes: { root: classes.drawerPaper }, elevation: 3 };

  const middleButton = ((): IMiddleButton => {
    const middleButtons: Record<IKnownMiddleButtonNames, IMiddleButton> = {
      home: {
        ariaLabel: t('Home'),
        Icon: Home,
        to: `/${i18n.language}`,
      },
      dashboard: {
        ariaLabel: t('Dashboard'),
        Icon: Person,
        to: '/en/dashboard',
      },
      signup: {
        ariaLabel: t('Sign up'),
        Icon: Person,
        to: '/en/signup',
      },
      signin: {
        ariaLabel: t('Sign in'),
        Icon: Person,
        to: '/en/signin',
      },
    };

    if (middleButtonProps) {
      if (typeof middleButtonProps === 'string' && Object.keys(middleButtons).includes(middleButtonProps)) {
        return middleButtons[middleButtonProps];
      }
      if (typeof middleButtonProps === 'object' && 'to' in middleButtonProps) {
        return middleButtonProps;
      }
    }

    const currentlyAt = (pathname: 'dashboard' | 'signin' | 'signup' | 'home'): boolean => (
      pathname === 'home'
        ? location.pathname === routesPaths.path(i18n.language, pathname)
        : location.pathname.indexOf(routesPaths.path(i18n.language, pathname)) >= 0
    );

    /* console.log(
      'From LogoMenu, middleButton.',
      'currentlyAt:', currentlyAt,
      'isAuthenticated:', isAuthenticated,
      'curentlyAt(home)', currentlyAt('home'),
    ); */

    if (isAuthenticated && currentlyAt('home')) {
      return middleButtons.dashboard;
    }
    if (currentlyAt('signin')) {
      return middleButtons.signup;
    }
    if (currentlyAt('home') || currentlyAt('signup')) {
      return middleButtons.signin;
    }
    return middleButtons.home;
  })();

  /* console.log(
    'From LogoMenu, render.',
    'middleButton:', middleButton,
    'middleButtonProps:', middleButtonProps,
  ); */

  const handleToggleTopMenu = (
    deploy?: boolean,
  ) => (
    event: SyntheticEvent<{}, Event>,
  ): void => {
    if (event && event.type === 'keydown') {
      const { key } = event as unknown as KeyboardEvent;
      if (key === 'Tab' || key === 'Shift') {
        /* console.log(
          'From LogoMenu, handleToggleTopMenu. aborted.',
          'event.type:', event.type,
          'event.key:', key,
        ); */
        return;
      }
    }
    /* console.log(
      'From LogoMenu, handleToggleTopMenu. performed.',
      'deploy (should be a bool):', deploy,
      'former topMenuIsOpen:', topMenuIsOpen,
      'event.currentTarget:', event.currentTarget,
    ); */
    setTopMenuIsOpen(typeof deploy === 'undefined' ? !topMenuIsOpen : !!deploy);
  };

  return (
    <>
      {smallDevice
        ? (
          <TopMenuSmall
            className={clsx(topMenuClassNameProp, topMenuSmallClassNameProp)}
            PaperProps={PaperProps}
            handleToggleTopMenu={handleToggleTopMenu}
            topMenuIsOpen={topMenuIsOpen}
          >
            <TopMenuContent
              className={topMenuContentClassNameProp}
              isAuthenticated={isAuthenticated}
              handleLogout={handleLogout}
              handleToggleTopMenu={handleToggleTopMenu}
            />
          </TopMenuSmall>
        )
        : (
          <TopMenuLarge
            className={clsx(topMenuClassNameProp, topMenuLargeClassNameProp)}
            PaperProps={PaperProps}
            topMenuIsOpen={topMenuIsOpen}
          >
            <TopMenuContent
              className={topMenuContentClassNameProp}
              isAuthenticated={isAuthenticated}
              handleLogout={handleLogout}
              handleToggleTopMenu={handleToggleTopMenu}
            />
          </TopMenuLarge>
        )}
      <div className={clsx(classes.root, logoMenuClassNameProp)}>
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
          to={{
            pathname: routesPaths.translatePath(middleButton.to, i18n.language),
            state: {
              from: location,
            },
          }}
        >
          <div className={clsx(classes.tabIcon, classes.tabIcon2)}>
            <middleButton.Icon />
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
