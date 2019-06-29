import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import LogoMenu from '../LogoMenu';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    padding: theme.spacing(2),
    width: '100vw',
  },
  pageContent: {
    flexGrow: 1,
    height: '100%',

    '& > *': {
      height: '100%',
      padding: theme.spacing(4, 4, 4, 4),
    }
  },
}));

export const PageLayout = ({ children, menuProps }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LogoMenu {...menuProps} />
      <Grid container spacing={4} className={classes.pageContent}>
        {children}
      </Grid>
    </div >
  );
};

export default PageLayout;