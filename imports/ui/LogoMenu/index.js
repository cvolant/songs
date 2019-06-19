import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Accounts } from "meteor/accounts-base";
import { Session } from "meteor/session";
import { withTracker } from 'meteor/react-meteor-data';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { ButtonBase } from '@material-ui/core';
import { Clear, Home, Menu, Person } from '@material-ui/icons';

import Logo from './Logo';

const useStyles = makeStyles(theme => ({
  root: {
    margin: '0 auto',
    width: '15rem',
    height: '15rem',
    position: 'fixed',
    top: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 2,
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
    width: '50%',
    height: '50%',
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
    height: '85%',
    margin: '0 auto',
    position: 'absolute',
    right: '0',
    width: '85%',
    transition: 'all 0.3s ease',

    /* border-radius */
    borderRadius: '0 0 0 100%',
    transformOrigin: '100% 0',
  },
}));

export const LogoMenu = ({ handleLogout, handleToggleNav, isNavOpen, handleToggle, isDeployed }) => {
  const classes = useStyles({ scale: isDeployed ? 1 : 0.65 });

  return (
    <div className={classes.root}>

      <div className={clsx(classes.tabShape, classes.tab1, classes.shadow)}></div>
      <ButtonBase
        aria-label='Head home'
        className={clsx(classes.tabShape, classes.tab, classes.tab1)}
        component='div'
      >
        <div className={clsx(classes.tabIcon, classes.tabIcon1)}>
          <Home />
        </div>
      </ButtonBase>

      <div className={clsx(classes.tabShape, classes.tab2, classes.shadow)}></div>
      <ButtonBase
        aria-label='Toggle menu'
        className={clsx(classes.tabShape, classes.tab, classes.tab2)}
        component='div'
        onClick={handleToggleNav}
      >
        <div className={clsx(classes.tabIcon, classes.tabIcon2)}>
          {isNavOpen ? <Menu /> : <Clear />}
        </div>
      </ButtonBase >

      <div className={clsx(classes.tabShape, classes.tab3, classes.shadow)}></div>
      <ButtonBase
        aria-label='Log in, log out'
        className={clsx(classes.tabShape, classes.tab, classes.tab3)}
        component='div'
        onClick={() => handleLogout()}
      >
        <div className={clsx(classes.tabIcon, classes.tabIcon3)}>
          <Person />
        </div>
      </ButtonBase >

      <div className={clsx(classes.logoAreaShape, classes.shadow)}></div>
      <ButtonBase
        component='div'
        onClick={handleToggle}
        className={clsx(classes.logoAreaShape, classes.logoArea)}
      >
        <Logo className={classes.logo} fill={theme.palette.secondary.main} />
      </ButtonBase>
    </div>
  );
}

LogoMenu.propTypes = {
  handleLogout: PropTypes.func.isRequired,
  handleToggleNav: PropTypes.func.isRequired,
  isNavOpen: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  isDeployed: PropTypes.bool.isRequired,
};

export default withTracker(props => {
  return {
    handleLogout: () => Accounts.logout(),
    isNavOpen: Session.get('isNavOpen'),
    handleToggleNav: () => Session.set('isNavOpen', !Session.get('isNavOpen'))
  };
})(LogoMenu);