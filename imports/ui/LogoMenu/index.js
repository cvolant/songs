import { Meteor } from 'meteor/meteor';
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import clsx from 'clsx';
import { ButtonBase } from '@material-ui/core';
import { ExpandLess, Help, Menu, Person } from '@material-ui/icons';

import Logo from './Logo';
import TopMenuLarge from './TopMenuLarge';
import TopMenuSmall from './TopMenuSmall';
import TopMenuContent from './TopMenuContent';

const useStyles = makeStyles(theme => ({
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
    opacity: '0.5',
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
    transform: ({ scale }) => `scale(${scale})`,
  },
  tab2: {
    transform: ({ scale }) => `rotate(30deg) scale(${scale})`,
  },
  tab3: {
    transform: ({ scale }) => `rotate(60deg) scale(${scale})`,
  },

  tabIcon: {
    position: 'relative',
    right: '-30%',
    top: '30%',
    transformOrigin: '30% 50%',

    '& svg': {
      width: '2.8rem',
      height: '2.8rem',
    }
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
    transition: 'all 0.3s ease',

    /* border-radius */
    borderRadius: '0 0 0 100%',
    transformOrigin: '100% 0',
  },
}));

export const LogoMenu = props => {
  const smallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  const [topMenuIsOpen, setTopMenuIsOpen] = useState(false);
  const [logoMenuDeployed, setLogoMenuDeployed] = props.logoMenuDeployed ?
    [props.logoMenuDeployed, undefined] :
    useState(true);
  const { isAuthenticated, handleLogout } = props;
  const classes = useStyles({ scale: logoMenuDeployed ? 1 : 0.63 });

  const PaperProps = { classes: { root: classes.drawerPaper }, elevation: 3 };

  const handleToggleTopMenu = oc => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      console.log('From LogoMenu, handleToggleTopMenu. aborted. event.type:', event.type, 'event.key:', event.key);
      return;
    }
    console.log('From LogoMenu, handleToggleTopMenu. performed. oc (should be a bool):', oc, 'former topMenuIsOpen:', topMenuIsOpen);
    setTopMenuIsOpen(typeof oc == 'undefined' ? !topMenuIsOpen : !!oc);
  }

  const handleToggleLogoMenu = props.handleToggleLogoMenu ?
    props.handleToggleLogoMenu :
    oc => () => {
      console.log('From LogoMenu, handleToggleLogoMenu. oc (should be a bool):', oc);
      setLogoMenuDeployed(typeof oc == 'undefined' ? !logoMenuDeployed : !!oc);
    };

  return (
    <React.Fragment>
      {
        smallDevice ?
          <TopMenuSmall
            PaperProps={PaperProps}
            handleToggleTopMenu={handleToggleTopMenu}
            topMenuIsOpen={topMenuIsOpen}
          >
            <TopMenuContent
              isAuthenticated={isAuthenticated}
              handleLogout={handleLogout}
              handleToggleTopMenu={handleToggleTopMenu}
              smallDevice={smallDevice}
            />
          </TopMenuSmall>
          :
          <TopMenuLarge
            PaperProps={PaperProps}
            topMenuIsOpen={topMenuIsOpen}
            smallDevice={smallDevice}
          >
            <TopMenuContent
              isAuthenticated={isAuthenticated}
              handleLogout={handleLogout}
              handleToggleTopMenu={handleToggleTopMenu}
              smallDevice={smallDevice}
            />
          </TopMenuLarge>
      }
      <div className={classes.root}>
        <div className={clsx(classes.tabShape, classes.tab1, classes.shadow)}></div>
        <ButtonBase
          aria-label='Help'
          className={clsx(classes.tabShape, classes.tab, classes.tab1)}
          component='div'
        >
          <div className={clsx(classes.tabIcon, classes.tabIcon1)}>
            <Help />
          </div>
        </ButtonBase>

        <div className={clsx(classes.tabShape, classes.tab2, classes.shadow)}></div>
        <ButtonBase
          aria-label={isAuthenticated ? 'Dashboard' : location.pathname == '/signin' ? 'Sign up' : 'Sign in'}
          className={clsx(classes.tabShape, classes.tab, classes.tab2)}
          component={Link}
          to={isAuthenticated ? '/dashboard' : location.pathname == '/signin' ? '/signup' : '/signin'}
        >
          <div className={clsx(classes.tabIcon, classes.tabIcon2)}>
            <Person />
          </div>
        </ButtonBase >

        <div className={clsx(classes.tabShape, classes.tab3, classes.shadow)}></div>
        <ButtonBase
          aria-label='Toggle menu'
          className={clsx(classes.tabShape, classes.tab, classes.tab3)}
          component='div'
          onClick={handleToggleTopMenu()}
        >
          <div className={clsx(classes.tabIcon, classes.tabIcon3)}>
            {topMenuIsOpen ? <ExpandLess /> : <Menu />}
          </div>
        </ButtonBase >

        <div className={clsx(classes.logoAreaShape, classes.shadow)}></div>
        <ButtonBase
          component='div'
          onClick={handleToggleLogoMenu()}
          className={clsx(classes.logoAreaShape, classes.logoArea)}
        >
          <Logo className={classes.logo} fill={theme.palette.secondary.main} />
        </ButtonBase>
      </div>
    </React.Fragment>
  );
}

LogoMenu.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
  handleToggleLogoMenu: PropTypes.func,
  logoMenuDeployed: PropTypes.bool,
};

export default withTracker(props => ({
  handleLogout: () => Accounts.logout(),
  isAuthenticated: !!Meteor.userId(),
}))(LogoMenu);